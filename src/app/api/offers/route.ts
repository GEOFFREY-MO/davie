import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { broadcastEvent } from '@/app/api/updates/stream/route'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const targetAudience = searchParams.get('targetAudience')
    const withProducts = searchParams.get('withProducts') === 'true'

    const whereClause: any = {
      AND: [
        {
          startDate: {
            lte: new Date()
          }
        },
        {
          endDate: {
            gte: new Date()
          }
        }
      ]
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

    if (targetAudience) {
      whereClause.targetAudience = targetAudience.toUpperCase()
    }

    const offers = await db.offer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: withProducts
        ? { products: { include: { product: true } } }
        : undefined
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      status = 'ACTIVE',
      targetAudience = 'ALL',
      minimumPurchase,
      maximumDiscount,
      usageLimit,
      productIds
    } = body

    const offer = await db.$transaction(async (tx) => {
      const created = await tx.offer.create({
        data: {
          title,
          description,
          discountPercentage,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: String(status).toUpperCase() as any,
          targetAudience: String(targetAudience).toUpperCase() as any,
          minimumPurchase,
          maximumDiscount,
          usageLimit
        }
      })

      if (Array.isArray(productIds) && productIds.length > 0) {
        // Link products
        await tx.offerProduct.createMany({
          data: productIds.map((pid: string) => ({ offerId: created.id, productId: pid })),
          skipDuplicates: true,
        })

        // Apply discounts to linked products
        for (const pid of productIds) {
          const product = await tx.product.findUnique({ where: { id: pid } })
          if (!product) continue
          const base = product.originalPrice ?? product.price
          const percent = Math.max(0, Math.min(100, Number(discountPercentage) || 0))
          let discounted = base * (1 - percent / 100)
          if (typeof maximumDiscount === 'number' && maximumDiscount > 0) {
            discounted = Math.max(base - maximumDiscount, discounted)
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

      return created
    })

    // Notify clients
    broadcastEvent({ type: 'offers:changed' })
    broadcastEvent({ type: 'products:changed' })
    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
