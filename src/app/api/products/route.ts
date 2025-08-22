import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { broadcastEvent } from '@/app/api/updates/stream/route'

// GET - Public access to products (for customers)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const bestSeller = searchParams.get('bestSeller')

    let whereClause: any = {}

    // Filter by category
    if (category && category !== 'all') {
      whereClause.category = category
    }

    // Filter by search term
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by featured
    if (featured === 'true') {
      whereClause.featured = true
    }

    // Filter by best seller
    if (bestSeller === 'true') {
      whereClause.bestSeller = true
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Admin only - Create new product
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
    const { name, description, price, category, image, stock, featured, bestSeller } = body

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        stock: parseInt(stock) || 0,
        featured: featured || false,
        bestSeller: bestSeller || false
      }
    })
    broadcastEvent({ type: 'products:changed' })
    broadcastEvent({ type: 'stats:changed' })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

