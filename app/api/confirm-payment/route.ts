import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { EmailService } from "@/lib/email-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderData } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve the payment intent to verify it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Save the order to your database
    // 2. Update inventory
    // 3. Send confirmation emails
    // 4. Create order tracking

    const orderId = `ORD-${Date.now()}`

    // Mock order creation - replace with actual database logic
    const order = {
      id: orderId,
      paymentIntentId,
      status: "confirmed",
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      customerEmail: orderData?.customerInfo?.email || orderData?.customerEmail,
      items: orderData?.items || [],
      shippingAddress: orderData?.shippingAddress,
      createdAt: new Date().toISOString(),
    }

    // Send order confirmation email
    try {
      const emailService = EmailService.getInstance()
      await emailService.sendOrderConfirmation({
        orderId: order.id,
        customerName: orderData?.customerInfo?.name || "Customer",
        customerEmail: orderData?.customerInfo?.email || orderData?.customerEmail,
        items: orderData?.items || [],
        total: order.amount,
        shippingAddress: orderData?.shippingAddress || {},
        paymentMethod: "Credit Card",
        createdAt: order.createdAt,
      })
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      order,
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
