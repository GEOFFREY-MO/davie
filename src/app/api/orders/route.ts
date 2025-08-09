import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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


