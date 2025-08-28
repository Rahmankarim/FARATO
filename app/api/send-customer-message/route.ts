import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, orderId, subject, content } = await request.json()

    if (!customerEmail || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    
    // Create a custom email message
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Message from Farato</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FARATO</h1>
              <h2>Message from Our Team</h2>
            </div>

            <div class="content">
              <h3>Hello ${customerName || 'Valued Customer'},</h3>
              
              ${orderId ? `<p><strong>Regarding Order:</strong> ${orderId}</p>` : ''}
              
              <div style="white-space: pre-line; padding: 20px; background: white; border-left: 4px solid #000; margin: 20px 0;">
                ${content}
              </div>

              <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:support@farato.com" class="button">Contact Support</a>
              </div>
            </div>

            <div class="footer">
              <p>Best regards,<br/>The Farato Team</p>
              <p>Questions? Contact us at support@farato.com</p>
              <p>© 2024 Farato. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await emailService.sendEmail({
      to: customerEmail,
      subject: `Farato: ${subject}`,
      html: htmlContent,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send message" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending customer message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
