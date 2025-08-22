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
    const offer = await db.offer.findUnique({ where: { id } })
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

    const updated = await db.offer.update({
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
    broadcastEvent({ type: 'offers:changed' })
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
    await db.offer.delete({ where: { id } })
    broadcastEvent({ type: 'offers:changed' })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
}


