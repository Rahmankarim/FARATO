import nodemailer from "nodemailer"

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
  private transporter: nodemailer.Transporter | null = null

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  private async createTestTransporter() {
    try {
      // Create test account if needed
      const testAccount = await nodemailer.createTestAccount()
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })
    } catch (error) {
      console.error('Failed to create test transporter:', error)
      return null
    }
  }

  private getSmtpTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        logger: true,
        debug: true
      })
    }
    return this.transporter
  }

  private getGmailTransporter() {
    if (!this.transporter) {
      const authPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD
      
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || process.env.COMPANY_EMAIL,
          pass: authPassword
        },
        secure: true,
        port: 465,
        logger: true,
        debug: true
      })
    }
    return this.transporter
  }
}

export class EmailService {
  private static instance: EmailService
  private fromEmail = process.env.FROM_EMAIL || process.env.COMPANY_EMAIL || "infobyfarato@gmail.com"
  private transporter: nodemailer.Transporter | null = null

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  private async createTestTransporter() {
    try {
      // Create test account if needed
      const testAccount = await nodemailer.createTestAccount()
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })
    } catch (error) {
      console.error('Failed to create test transporter:', error)
      return null
    }
  }

  private getGmailTransporter() {
    if (!this.transporter) {
      // Support both App Password and regular password
      const authPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD
      
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || process.env.COMPANY_EMAIL,
          pass: authPassword
        },
        // Additional options for Gmail
        secure: true,
        port: 465,
        logger: true,
        debug: true
      })
    }
    return this.transporter
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const emailProvider = process.env.EMAIL_PROVIDER || 'test'
    
    try {
      console.log(`📧 Attempting to send email via ${emailProvider}`)
      console.log(`📧 To: ${options.to}`)
      console.log(`📧 Subject: ${options.subject}`)

      if (emailProvider === 'gmail' && (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD)) {
        // Use Gmail SMTP
        console.log(`📧 Sending email via Gmail SMTP...`)
        const transporter = this.getGmailTransporter()
        
        if (transporter) {
          const result = await transporter.sendMail({
            from: `"Farato Fashion" <${options.from || this.fromEmail}>`,
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            html: options.html,
          })

          console.log(`✅ Gmail email sent successfully to ${options.to}`)
          console.log(`📧 Message ID: ${result.messageId}`)
          return {
            success: true,
            messageId: result.messageId,
          }
        } else {
          throw new Error('Failed to initialize Gmail transporter')
        }
      } else {
        // For development: Show email content directly
        console.log(`📧 ======== EMAIL CONTENT ========`)
        console.log(`📧 From: "Farato Fashion" <${options.from || this.fromEmail}>`)
        console.log(`📧 To: ${options.to}`)
        console.log(`📧 Subject: ${options.subject}`)
        console.log(`📧 ================================`)
        console.log(options.html)
        console.log(`📧 ======== END EMAIL ========`)

        // Try to create test email with preview URL
        try {
          const transporter = await this.createTestTransporter()
          
          if (transporter) {
            const result = await transporter.sendMail({
              from: `"Farato Fashion" <${options.from || this.fromEmail}>`,
              to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
              subject: options.subject,
              html: options.html,
            })

            const previewUrl = nodemailer.getTestMessageUrl(result)
            
            console.log(`📧 EMAIL PREVIEW URL: ${previewUrl}`)

            return {
              success: true,
              messageId: result.messageId,
              error: `Email preview available at: ${previewUrl}`
            }
          }
        } catch (testError) {
          console.log('📧 Test email service unavailable, showing content only')
        }

        // Fallback: Always return success with email content
        return {
          success: true,
          messageId: `dev_${Date.now()}`,
          error: "Email content displayed in console - check server logs for reset link"
        }
      }
    } catch (error) {
      console.error("❌ Email sending failed:", error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async sendOrderConfirmation(orderData: any): Promise<{ success: boolean; error?: string }> {
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

  async sendShippingUpdate(orderData: any, trackingInfo: any): Promise<{ success: boolean; error?: string }> {
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

  async sendPromotionalEmail(recipients: string[], emailData: any): Promise<{ success: boolean; error?: string }> {
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

  async sendPasswordReset(email: string, resetToken: string, resetUrl: string): Promise<{ success: boolean; error?: string }> {
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
