import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { User, Log } from '@/lib/models'
import crypto from 'crypto'
import { EmailService } from '@/lib/email-service-debug'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with this email exists, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    })

    // Log the password reset request
    await Log.create({
      userId: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      details: {
        email: user.email,
        resetToken: resetToken.substring(0, 8) + '...' // Log partial token for security
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    // Send password reset email using Simple EmailService
    const emailService = EmailService.getInstance()
    
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    const emailResult = await emailService.sendPasswordReset(
      user.email,
      resetToken,
      resetUrl
    )
    
    if (emailResult.success) {
      console.log(`Password reset email sent successfully to: ${email}`)
      if (emailResult.messageId) {
        console.log(`Email message ID: ${emailResult.messageId}`)
      }
      
      // Update log with email success
      await Log.findOneAndUpdate(
        { userId: user._id, action: 'PASSWORD_RESET_REQUESTED' },
        { 
          $set: { 
            'details.emailSent': true,
            'details.messageId': emailResult.messageId || 'console_preview'
          }
        },
        { sort: { createdAt: -1 } }
      )
      
      const response: any = { 
        message: process.env.TEST_EMAIL_OVERRIDE 
          ? `Password reset email sent to ${process.env.TEST_EMAIL_OVERRIDE} (test mode). Please check that inbox for the reset link.`
          : 'We\'ve sent password reset instructions to your email address. Please check your email (including spam folder) and click the reset link.'
      }
      
      // In development, include reset link and preview URL
      if (process.env.NODE_ENV === 'development') {
        response.resetLink = resetUrl
        response.devNote = process.env.TEST_EMAIL_OVERRIDE 
          ? `Test mode: Email sent to ${process.env.TEST_EMAIL_OVERRIDE} instead of ${user.email}`
          : 'Reset link included for development testing'
        
        // Include any error info that contains useful preview links
        if (emailResult.error) {
          response.emailInfo = emailResult.error
        }
      }
      
      return NextResponse.json(response, { status: 200 })
    } else {
      console.error(`Failed to send password reset email to ${email}:`, emailResult.error)
      
      // Log email failure
      await Log.create({
        userId: user._id,
        action: 'PASSWORD_RESET_EMAIL_FAILED',
        details: {
          email: user.email,
          error: emailResult.error
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      })
      
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
