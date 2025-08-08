import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const targetAudience = searchParams.get('targetAudience')

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
      orderBy: { createdAt: 'desc' }
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
      usageLimit
    } = body

    const offer = await db.offer.create({
      data: {
        title,
        description,
        discountPercentage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status.toUpperCase(),
        targetAudience: targetAudience.toUpperCase(),
        minimumPurchase,
        maximumDiscount,
        usageLimit
      }
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
