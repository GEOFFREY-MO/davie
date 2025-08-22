import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await db.order.findUnique({ where: { id }, include: { items: true } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (e) {
    console.error('Error fetching order', e)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, trackingNumber, notes } = body
    const updated = await db.order.update({
      where: { id },
      data: {
        status: status ? String(status).toUpperCase() as any : undefined,
        trackingNumber,
        notes,
      },
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error('Error updating order', e)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.order.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error deleting order', e)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}










