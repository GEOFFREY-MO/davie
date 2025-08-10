import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function pctChange(current: number, prev: number) {
  if (!prev) return current ? 100 : 0
  return ((current - prev) / prev) * 100
}

export async function GET() {
  try {
    const now = new Date()
    const msInDay = 24 * 60 * 60 * 1000
    const last30Start = new Date(now.getTime() - 30 * msInDay)
    const prev30Start = new Date(now.getTime() - 60 * msInDay)
    const prev30End = last30Start

    // Totals (all time)
    const [ordersAll, productsAll] = await Promise.all([
      db.order.findMany({ select: { id: true, total: true, paymentStatus: true, createdAt: true, customerEmail: true } }),
      db.product.count(),
    ])

    const totalSalesAll = ordersAll
      .filter(o => String(o.paymentStatus).toUpperCase() === 'PAID')
      .reduce((sum, o) => sum + (o.total || 0), 0)
    const totalOrdersAll = ordersAll.length
    const totalProductsAll = productsAll
    const totalCustomersAll = new Set(ordersAll.map(o => o.customerEmail).filter(Boolean)).size

    // Windows
    const inLast30 = (d: Date) => d >= last30Start && d <= now
    const inPrev30 = (d: Date) => d >= prev30Start && d < prev30End

    const salesLast30 = ordersAll
      .filter(o => String(o.paymentStatus).toUpperCase() === 'PAID' && inLast30(o.createdAt))
      .reduce((sum, o) => sum + (o.total || 0), 0)
    const salesPrev30 = ordersAll
      .filter(o => String(o.paymentStatus).toUpperCase() === 'PAID' && inPrev30(o.createdAt))
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const ordersLast30 = ordersAll.filter(o => inLast30(o.createdAt)).length
    const ordersPrev30 = ordersAll.filter(o => inPrev30(o.createdAt)).length

    const customersLast30 = new Set(
      ordersAll.filter(o => inLast30(o.createdAt)).map(o => o.customerEmail).filter(Boolean)
    ).size
    const customersPrev30 = new Set(
      ordersAll.filter(o => inPrev30(o.createdAt)).map(o => o.customerEmail).filter(Boolean)
    ).size

    // Products window based on createdAt if present
    const productsLast30 = await db.product.count({ where: { createdAt: { gte: last30Start, lte: now } as any } as any })
    const productsPrev30 = await db.product.count({ where: { createdAt: { gte: prev30Start, lt: prev30End } as any } as any })

    // Recent orders
    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      totals: {
        totalSales: totalSalesAll,
        totalOrders: totalOrdersAll,
        totalProducts: totalProductsAll,
        totalCustomers: totalCustomersAll,
      },
      changes: {
        salesPct: pctChange(salesLast30, salesPrev30),
        ordersPct: pctChange(ordersLast30, ordersPrev30),
        productsPct: pctChange(productsLast30, productsPrev30),
        customersPct: pctChange(customersLast30, customersPrev30),
      },
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customerName: o.customerName,
        total: o.total,
        status: String(o.status).toLowerCase(),
        date: o.createdAt.toISOString().slice(0, 10),
      })),
    })
  } catch (e) {
    console.error('Error generating stats', e)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}


