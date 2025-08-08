import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { db } from '@/lib/db'

// GET - Public access to active banners (for customers)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const status = searchParams.get('status')

    let whereClause: any = {}

    // Filter by position
    if (position && position !== 'all') {
      whereClause.position = position
    }

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status
    } else {
      // Default to active banners for public access
      whereClause.status = 'ACTIVE'
    }

    // Only show banners that are currently active (within date range)
    const now = new Date()
    whereClause.AND = [
      { startDate: { lte: now } },
      { endDate: { gte: now } }
    ]

    const banners = await db.banner.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// POST - Admin only - Create new banner
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
      imageUrl,
      altText,
      linkUrl,
      status,
      position,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!title || !imageUrl || !altText || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const banner = await db.banner.create({
      data: {
        title,
        imageUrl,
        altText,
        linkUrl: linkUrl || null,
        status: status || 'ACTIVE',
        position: position || 'HERO',
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
