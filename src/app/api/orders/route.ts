import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { broadcastEvent } from '@/app/api/updates/stream/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')

    const where: any = {}
    if (status && status !== 'all') where.status = status.toUpperCase()
    if (paymentStatus && paymentStatus !== 'all') where.paymentStatus = paymentStatus.toUpperCase()

    const orders = await db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (e) {
    console.error('Error fetching orders', e)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// Public endpoint to create orders (e.g., checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, items, total, paymentMethod, notes } = body

    // Basic validation
    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const order = await db.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        items: { create: items.map((it: any) => ({ productId: it.productId, productName: it.productName, quantity: it.quantity, price: it.price, total: it.total })) },
        total,
        status: 'PENDING' as any,
        paymentStatus: 'PENDING' as any,
        paymentMethod: paymentMethod || 'mpesa',
        notes,
      },
      include: { items: true },
    })

    broadcastEvent({ type: 'orders:changed' })
    broadcastEvent({ type: 'stats:changed' })
    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    console.error('Error creating order', e)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}











