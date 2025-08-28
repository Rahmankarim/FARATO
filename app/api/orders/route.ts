import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Order, Cart, Product } from '@/lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/orders - Get user's orders
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get orders with pagination
    const orders = await Order.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.productId')
      .lean()

    // Get total count for pagination
    const total = await Order.countDocuments({ userEmail: session.user.email })

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
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
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentDetails,
      shippingMethod
    } = body

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Items, shipping address, and payment method are required' },
        { status: 400 }
      )
    }

    // Calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const price = product.salePrice || product.price
      const itemTotal = price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: item.productId,
        name: product.name,
        price,
        quantity: item.quantity,
        size: item.size || '',
        color: item.color || '',
        image: product.images[0] || ''
      })
    }

    // Calculate shipping and tax (you can customize these)
    const shipping = subtotal > 100 ? 0 : 9.99
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create order
    const order = new Order({
      orderNumber,
      userId: session.user.id,
      userEmail: session.user.email,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      paymentDetails: paymentDetails || {},
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod: shippingMethod || 'standard',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    })

    await order.save()

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userEmail: session.user.email },
      { items: [] }
    )

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
