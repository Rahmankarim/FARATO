import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Review, Product } from '@/lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/reviews - Get reviews with optional product filter
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter object
    const filter: any = {}
    if (productId) {
      filter.productId = productId
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get reviews with pagination and populate user info
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName')
      .lean()

    // Get total count for pagination
    const total = await Review.countDocuments(filter)

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    // Validate required fields
    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Product ID and valid rating (1-5) are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userEmail: session.user.email
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create review
    const review = new Review({
      productId,
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || 'Anonymous',
      rating: parseInt(rating),
      comment: comment || '',
      helpful: 0
    })

    await review.save()

    // Update product rating average
    const reviews = await Review.find({ productId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    })

    return NextResponse.json(
      { message: 'Review created successfully', review },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
