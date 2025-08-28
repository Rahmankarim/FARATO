import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Order } from '@/lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/orders/[id] - Get a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const order = await Order.findOne({
      _id: params.id,
      userEmail: session.user.email
    }).populate('items.productId').lean()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (admin only for now)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, paymentStatus, trackingNumber } = body

    const updateData: any = {}
    
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (trackingNumber) updateData.trackingNumber = trackingNumber

    updateData.updatedAt = new Date()

    // For now, users can only cancel their own orders
    const allowedUserStatuses = ['cancelled']
    if (status && !allowedUserStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'You can only cancel orders' },
        { status: 403 }
      )
    }

    const order = await Order.findOneAndUpdate(
      { _id: params.id, userEmail: session.user.email },
      updateData,
      { new: true, runValidators: true }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
