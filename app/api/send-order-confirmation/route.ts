import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    if (!orderData.customerEmail || !orderData.orderId) {
      return NextResponse.json({ error: "Missing required order data" }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const result = await emailService.sendOrderConfirmation(orderData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Order confirmation sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
