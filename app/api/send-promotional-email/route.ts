import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { recipients, emailData } = await request.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients list is required" }, { status: 400 })
    }

    if (!emailData.title || !emailData.content || !emailData.ctaText || !emailData.ctaUrl) {
      return NextResponse.json({ error: "Missing required email data" }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const result = await emailService.sendPromotionalEmail(recipients, emailData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Promotional email sent to ${recipients.length} recipients`,
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending promotional email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
