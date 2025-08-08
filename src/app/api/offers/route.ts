import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { db } from '@/lib/db'

// GET - Public access to active offers (for customers)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const targetAudience = searchParams.get('targetAudience')

    let whereClause: any = {}

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status
    } else {
      // Default to active offers for public access
      whereClause.status = 'ACTIVE'
    }

    // Filter by target audience
    if (targetAudience && targetAudience !== 'all') {
      whereClause.targetAudience = targetAudience
    }

    // Only show offers that are currently active (within date range)
    const now = new Date()
    whereClause.AND = [
      { startDate: { lte: now } },
      { endDate: { gte: now } }
    ]

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

// POST - Admin only - Create new offer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
      usageLimit
    } = body

    // Validate required fields
    if (!title || !description || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const offer = await db.offer.create({
      data: {
        title,
        description,
        discountPercentage: parseInt(discountPercentage),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'ACTIVE',
        targetAudience: targetAudience || 'ALL',
        minimumPurchase: minimumPurchase ? parseFloat(minimumPurchase) : null,
        maximumDiscount: maximumDiscount ? parseFloat(maximumDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        usedCount: 0
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
