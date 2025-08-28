import { Resend } from 'resend'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export class EmailService {
  private static instance: EmailService
  private resend: Resend
  private fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev"

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const emailProvider = process.env.EMAIL_PROVIDER || 'resend'
    
    try {
      console.log(`📧 Sending email via ${emailProvider}`)
      console.log(`📧 To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)

      if (emailProvider === 'resend') {
        // Use Resend to send real emails
        const result = await this.resend.emails.send({
          from: `Farato Fashion <${options.from || this.fromEmail}>`,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
        })

        if (result.error) {
          console.error('❌ Resend error:', result.error)
          return {
            success: false,
            error: result.error.message || 'Failed to send email'
          }
        }

        console.log('✅ Email sent successfully via Resend')
        console.log(`📧 Message ID: ${result.data?.id}`)

        return {
          success: true,
          messageId: result.data?.id,
        }
      }

      // Fallback to console mode if not using Resend
      console.log(`\n📧 ======== EMAIL CONTENT ========`)
      console.log(`📧 From: "Farato Fashion" <${options.from || this.fromEmail}>`)
      console.log(`📧 To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)
      
      // Extract reset link from HTML
      const resetLinkMatch = options.html.match(/href="([^"]*reset-password[^"]*)"/)
      const resetLink = resetLinkMatch ? resetLinkMatch[1] : 'No reset link found'
      
      console.log(`\n🔗 RESET LINK: ${resetLink}`)
      console.log(`\n📧 ================================\n`)

      return {
        success: true,
        messageId: `console_${Date.now()}`,
        error: `Reset link: ${resetLink}`
      }

    } catch (error) {
      console.error("❌ Email service error:", error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async sendOrderConfirmation(orderData: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { renderOrderConfirmationEmail } = await import("./email-templates")

    try {
      const html = await renderOrderConfirmationEmail(orderData)

      const result = await this.sendEmail({
        to: orderData.customerEmail,
        subject: `Order Confirmation - ${orderData.orderId}`,
        html,
      })

      return result
    } catch (error) {
      console.error("Failed to send order confirmation:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  async sendShippingUpdate(orderData: any, trackingInfo: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { renderShippingUpdateEmail } = await import("./email-templates")

    try {
      const html = await renderShippingUpdateEmail(orderData, trackingInfo)

      const result = await this.sendEmail({
        to: orderData.customerEmail,
        subject: `Your Order Has Shipped - ${orderData.orderId}`,
        html,
      })

      return result
    } catch (error) {
      console.error("Failed to send shipping update:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  async sendPromotionalEmail(recipients: string[], emailData: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { renderPromotionalEmail } = await import("./email-templates")

    try {
      const html = await renderPromotionalEmail(emailData)

      const result = await this.sendEmail({
        to: recipients,
        subject: emailData.subject,
        html,
      })

      return result
    } catch (error) {
      console.error("Failed to send promotional email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  async sendPasswordReset(email: string, resetToken: string, resetUrl: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { renderPasswordResetEmail } = await import("./email-templates")

    try {
      const html = await renderPasswordResetEmail({ email, resetToken, resetUrl })

      const result = await this.sendEmail({
        to: email,
        subject: "Reset Your Password - Farato Fashion",
        html,
      })

      return result
    } catch (error) {
      console.error("Failed to send password reset email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }
}
