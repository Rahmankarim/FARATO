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
    const apiKey = process.env.RESEND_API_KEY
    console.log('🔧 EmailService initialized')
    console.log('📧 API Key present:', apiKey ? 'YES' : 'NO')
    console.log('📧 API Key length:', apiKey ? apiKey.length : 0)
    console.log('📧 From email:', this.fromEmail)
    
    this.resend = new Resend(apiKey)
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
      console.log(`📧 Email Service Debug:`)
      console.log(`📧 Provider: ${emailProvider}`)
      console.log(`📧 Original To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)
      console.log(`📧 From: ${options.from || this.fromEmail}`)

      if (emailProvider === 'resend') {
        console.log('📧 Attempting to send via Resend...')
        
        // For Resend free accounts, override recipient email for testing
        const testEmailOverride = process.env.TEST_EMAIL_OVERRIDE
        const actualTo = testEmailOverride || options.to
        
        if (testEmailOverride) {
          console.log(`📧 Using test email override: ${testEmailOverride}`)
          console.log(`📧 (Original recipient was: ${options.to})`)
        }
        
        const emailData = {
          from: `Farato Fashion <${options.from || this.fromEmail}>`,
          to: Array.isArray(actualTo) ? actualTo : [actualTo],
          subject: options.subject,
          html: options.html,
        }
        
        console.log('📧 Email data prepared:', JSON.stringify(emailData, null, 2))
        
        const result = await this.resend.emails.send(emailData)
        
        console.log('📧 Resend API Response:', JSON.stringify(result, null, 2))

        if (result.error) {
          console.error('❌ Resend error details:', result.error)
          return {
            success: false,
            error: `Resend Error: ${result.error.message || JSON.stringify(result.error)}`
          }
        }

        if (result.data) {
          console.log('✅ Email sent successfully via Resend')
          console.log(`📧 Message ID: ${result.data.id}`)
          
          return {
            success: true,
            messageId: result.data.id,
          }
        } else {
          console.error('❌ No data returned from Resend')
          return {
            success: false,
            error: 'No data returned from Resend API'
          }
        }
      }

      // Fallback to console mode
      console.log(`\n📧 ======== EMAIL FALLBACK ========`)
      console.log(`📧 From: "Farato Fashion" <${options.from || this.fromEmail}>`)
      console.log(`📧 To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)
      
      const resetLinkMatch = options.html.match(/href="([^"]*reset-password[^"]*)"/)
      const resetLink = resetLinkMatch ? resetLinkMatch[1] : 'No reset link found'
      
      console.log(`\n🔗 RESET LINK: ${resetLink}`)
      console.log(`\n📧 ================================\n`)

      return {
        success: true,
        messageId: `fallback_${Date.now()}`,
        error: `Fallback mode - Reset link: ${resetLink}`
      }

    } catch (error) {
      console.error("❌ Email service error:", error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async sendPasswordReset(email: string, resetToken: string, resetUrl: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('🔐 Password reset email requested')
      console.log('📧 Target email:', email)
      console.log('🔗 Reset URL:', resetUrl)
      
      const { renderPasswordResetEmail } = await import("./email-templates")
      const html = await renderPasswordResetEmail({ email, resetToken, resetUrl })

      console.log('📧 Email template rendered successfully')
      console.log('📧 HTML length:', html.length)

      const result = await this.sendEmail({
        to: email,
        subject: "Reset Your Password - Farato Fashion",
        html,
      })

      console.log('📧 Send email result:', result)
      return result
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  async sendOrderConfirmation(orderData: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { renderOrderConfirmationEmail } = await import("./email-templates")

    try {
      const html = await renderOrderConfirmationEmail(orderData)
      return await this.sendEmail({
        to: orderData.customerEmail,
        subject: `Order Confirmation - ${orderData.orderId}`,
        html,
      })
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
      return await this.sendEmail({
        to: orderData.customerEmail,
        subject: `Your Order Has Shipped - ${orderData.orderId}`,
        html,
      })
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
      return await this.sendEmail({
        to: recipients,
        subject: emailData.subject,
        html,
      })
    } catch (error) {
      console.error("Failed to send promotional email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }
}
