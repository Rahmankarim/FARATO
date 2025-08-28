import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { orderData, trackingInfo } = await request.json()

    if (!orderData.customerEmail || !orderData.orderId || !trackingInfo.trackingNumber) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const result = await emailService.sendShippingUpdate(orderData, trackingInfo)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Shipping update sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending shipping update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
