import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { broadcastEvent } from '@/app/api/updates/stream/route'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const withProducts = searchParams.get('withProducts') === 'true'
    const offer = await db.offer.findUnique({
      where: { id },
      include: withProducts ? { products: { include: { product: true } } } : undefined,
    })
    if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      status,
      targetAudience,
      minimumPurchase,
      maximumDiscount,
      usageLimit,
    } = body

    const updated = await db.$transaction(async (tx) => {
      // Fetch existing linked products
      const existingLinks = await tx.offerProduct.findMany({ where: { offerId: id } })

      // Revert prices for previously linked products
      for (const link of existingLinks) {
        const p = await tx.product.findUnique({ where: { id: link.productId } })
        if (!p) continue
        if (p.originalPrice != null) {
          await tx.product.update({ where: { id: p.id }, data: { price: p.originalPrice } })
        }
      }

      // Update offer fields
      const updatedOffer = await tx.offer.update({
        where: { id },
        data: {
          title,
          description,
          discountPercentage,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status: status ? String(status).toUpperCase() as any : undefined,
          targetAudience: targetAudience ? String(targetAudience).toUpperCase() as any : undefined,
          minimumPurchase,
          maximumDiscount,
          usageLimit,
        },
      })

      // Update product links if provided
      const bodyJson = await request.json()
      const productIds: string[] | undefined = bodyJson?.productIds
      if (Array.isArray(productIds)) {
        await tx.offerProduct.deleteMany({ where: { offerId: id } })
        if (productIds.length > 0) {
          await tx.offerProduct.createMany({ data: productIds.map(pid => ({ offerId: id, productId: pid })), skipDuplicates: true })
          // Apply discounts to new set
          for (const pid of productIds) {
            const product = await tx.product.findUnique({ where: { id: pid } })
            if (!product) continue
            const base = product.originalPrice ?? product.price
            const percent = Math.max(0, Math.min(100, Number(updatedOffer.discountPercentage) || 0))
            let discounted = base * (1 - percent / 100)
            if (typeof updatedOffer.maximumDiscount === 'number' && updatedOffer.maximumDiscount > 0) {
              discounted = Math.max(base - updatedOffer.maximumDiscount, discounted)
            }
            discounted = Math.max(0, Number(discounted.toFixed(2)))
            await tx.product.update({
              where: { id: pid },
              data: {
                originalPrice: product.originalPrice ?? product.price,
                price: discounted,
              },
            })
          }
        }
      }

      return updatedOffer
    })
    broadcastEvent({ type: 'offers:changed' })
    broadcastEvent({ type: 'products:changed' })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    await db.$transaction(async (tx) => {
      const links = await tx.offerProduct.findMany({ where: { offerId: id } })
      for (const link of links) {
        const p = await tx.product.findUnique({ where: { id: link.productId } })
        if (p && p.originalPrice != null) {
          await tx.product.update({ where: { id: p.id }, data: { price: p.originalPrice } })
        }
      }
      await tx.offerProduct.deleteMany({ where: { offerId: id } })
      await tx.offer.delete({ where: { id } })
    })
    broadcastEvent({ type: 'offers:changed' })
    broadcastEvent({ type: 'products:changed' })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
}


