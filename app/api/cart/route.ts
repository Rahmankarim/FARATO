import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Cart } from '@/lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/cart - Get user's cart
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

    const cart = await Cart.findOne({ userEmail: session.user.email })
      .populate('items.productId')
      .lean()

    if (!cart) {
      return NextResponse.json({
        items: [],
        totalItems: 0,
        totalPrice: 0
      })
    }

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.items.reduce((sum, item) => {
      const product = item.productId as any
      const price = product.salePrice || product.price
      return sum + (price * item.quantity)
    }, 0)

    return NextResponse.json({
      items: cart.items,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100
    })

  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
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
    const { productId, quantity = 1, size, color } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Find or create cart
    let cart = await Cart.findOne({ userEmail: session.user.email })
    
    if (!cart) {
      cart = new Cart({
        userId: session.user.id,
        userEmail: session.user.email,
        items: []
      })
    }

    // Check if item already exists with same attributes
    const existingItemIndex = cart.items.findIndex(
      item => 
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += parseInt(quantity)
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
        size: size || '',
        color: color || '',
        addedAt: new Date()
      })
    }

    await cart.save()

    return NextResponse.json(
      { message: 'Item added to cart successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update item quantity in cart
export async function PUT(request: NextRequest) {
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
    const { productId, quantity, size, color } = body

    if (!productId || quantity < 0) {
      return NextResponse.json(
        { error: 'Product ID and valid quantity are required' },
        { status: 400 }
      )
    }

    const cart = await Cart.findOne({ userEmail: session.user.email })
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    // Find the item to update
    const itemIndex = cart.items.findIndex(
      item => 
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = parseInt(quantity)
    }

    await cart.save()

    return NextResponse.json({
      message: 'Cart updated successfully'
    })

  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
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
    const size = searchParams.get('size')
    const color = searchParams.get('color')
    const clearAll = searchParams.get('clearAll')

    const cart = await Cart.findOne({ userEmail: session.user.email })
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    if (clearAll === 'true') {
      // Clear entire cart
      cart.items = []
    } else if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        item => !(
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
        )
      )
    } else {
      return NextResponse.json(
        { error: 'Product ID or clearAll parameter is required' },
        { status: 400 }
      )
    }

    await cart.save()

    return NextResponse.json({
      message: 'Cart updated successfully'
    })

  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
