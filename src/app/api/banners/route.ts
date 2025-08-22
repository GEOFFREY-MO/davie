import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { broadcastEvent } from '@/app/api/updates/stream/route'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const status = searchParams.get('status')

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

    if (position) {
      whereClause.position = position.toUpperCase()
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const {
      title,
      imageUrl,
      altText,
      linkUrl,
      status = 'ACTIVE',
      position = 'HERO',
      startDate,
      endDate
    } = body

    const banner = await db.banner.create({
      data: {
        title,
        imageUrl,
        altText,
        linkUrl,
        status: status.toUpperCase(),
        position: position.toUpperCase(),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })

    broadcastEvent({ type: 'banners:changed' })
    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
