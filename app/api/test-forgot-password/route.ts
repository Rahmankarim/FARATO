import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { User } from '@/lib/models'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account with this email exists, instructions have been sent.',
        resetLink: null
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    // For testing: return the reset link directly
    console.log(`📧 Password reset for ${email}`)
    console.log(`📧 Reset Link: ${resetUrl}`)

    return NextResponse.json({
      message: 'Password reset instructions sent!',
      resetLink: resetUrl,
      emailContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: white; padding: 20px; text-align: center;">
            <h1>FARATO</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div style="padding: 20px;">
            <h3>Hello!</h3>
            <p>You requested a password reset for your Farato Fashion account (${email}).</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p>This link expires in 1 hour for security.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p>Contact us: <a href="mailto:infobyfarato@gmail.com">infobyfarato@gmail.com</a></p>
            <p>© 2025 FARATO Fashion. All rights reserved.</p>
          </div>
        </div>
      `
    })

  } catch (error) {
    console.error('Test forgot password error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
