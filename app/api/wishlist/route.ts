import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Wishlist } from '@/lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const wishlist = await Wishlist.findOne({ userEmail: session.user.email })
      .populate('items.productId')
      .lean()

    if (!wishlist) {
      return NextResponse.json({
        items: [],
        totalItems: 0
      })
    }

    return NextResponse.json({
      items: wishlist.items,
      totalItems: wishlist.items.length
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
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
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userEmail: session.user.email })
    
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: session.user.id,
        userEmail: session.user.email,
        items: []
      })
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId
    )

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Add item to wishlist
    wishlist.items.push({
      productId,
      addedAt: new Date()
    })

    await wishlist.save()

    return NextResponse.json(
      { message: 'Item added to wishlist successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const wishlist = await Wishlist.findOne({ userEmail: session.user.email })
    
    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      )
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== productId
    )

    await wishlist.save()

    return NextResponse.json({
      message: 'Item removed from wishlist successfully'
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}
