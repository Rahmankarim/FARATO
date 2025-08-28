import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Product } from '@/lib/models'

// GET /api/products/[id] - Get a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const product = await Product.findById(params.id).lean()

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData: any = {}
    
    if (name) updateData.name = name
    if (description) updateData.description = description
    if (price) updateData.price = parseFloat(price)
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null
    if (category) updateData.category = category
    if (brand !== undefined) updateData.brand = brand
    if (images) updateData.images = images
    if (sizes) updateData.sizes = sizes
    if (colors) updateData.colors = colors
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (featured !== undefined) updateData.featured = featured
    if (tags) updateData.tags = tags

    updateData.updatedAt = new Date()

    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
