import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Product } from '@/lib/models'

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const onSale = searchParams.get('onSale')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter object
    const filter: any = {}
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' }
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (featured === 'true') {
      filter.featured = true
    }
    
    if (onSale === 'true') {
      filter.salePrice = { $exists: true, $ne: null }
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get products with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const {
      name,
      description,
      price,
      salePrice,
      category,
      brand,
      images,
      sizes,
      colors,
      stock,
      featured,
      tags
    } = body

    // Validate required fields
    if (!name || !description || !price || !category || !images || !images.length) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category, and at least one image' },
        { status: 400 }
      )
    }

    // Create product
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      category,
      brand: brand || '',
      images,
      sizes: sizes || [],
      colors: colors || [],
      stock: parseInt(stock) || 0,
      featured: featured || false,
      tags: tags || []
    })

    await product.save()

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
