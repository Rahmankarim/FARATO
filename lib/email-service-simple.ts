import nodemailer from "nodemailer"

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export class EmailService {
  private static instance: EmailService
  private fromEmail = process.env.FROM_EMAIL || process.env.COMPANY_EMAIL || "infobyfarato@gmail.com"

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const emailProvider = process.env.EMAIL_PROVIDER || 'console'
    
    try {
      console.log(`📧 Sending password reset email`)
      console.log(`📧 To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)

      if (emailProvider === 'console') {
        // For immediate testing: display email content in console
        console.log(`\n📧 ======== PASSWORD RESET EMAIL ========`)
        console.log(`📧 From: "Farato Fashion" <${options.from || this.fromEmail}>`)
        console.log(`📧 To: ${options.to}`)
        console.log(`📧 Subject: ${options.subject}`)
        console.log(`📧 =========================================`)
        
        // Extract reset link from HTML
        const resetLinkMatch = options.html.match(/href="([^"]*reset-password[^"]*)"/)
        const resetLink = resetLinkMatch ? resetLinkMatch[1] : 'No reset link found'
        
        console.log(`\n🔗 RESET LINK: ${resetLink}`)
        console.log(`\n📝 CLICK HERE TO RESET PASSWORD: ${resetLink}`)
        console.log(`\n📧 ======== END EMAIL ========\n`)

        return {
          success: true,
          messageId: `console_${Date.now()}`,
          error: `Reset link: ${resetLink}`
        }
      }

      // If not console mode, try to send real email
      console.log('📧 Real email sending not configured - showing link in console instead')
      return {
        success: true,
        messageId: `fallback_${Date.now()}`,
        error: "Email displayed in console - check server logs"
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
