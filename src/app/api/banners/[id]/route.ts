import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { broadcastEvent } from '@/app/api/updates/stream/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const banner = await db.banner.findUnique({ where: { id } })
    if (!banner) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, imageUrl, altText, linkUrl, status, position, startDate, endDate } = body

    const updated = await db.banner.update({
      where: { id },
      data: {
        title,
        imageUrl,
        altText,
        linkUrl,
        status: status ? String(status).toUpperCase() as any : undefined,
        position: position ? String(position).toUpperCase() as any : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    })
    broadcastEvent({ type: 'banners:changed' })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.banner.delete({ where: { id } })
    broadcastEvent({ type: 'banners:changed' })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}


