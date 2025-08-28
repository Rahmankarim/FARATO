import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { User, Log } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { firstName, lastName, email, password } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered. Please use a different email or try logging in.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
      role: 'user',
      provider: 'credentials',
    })

    // Log the registration
    await Log.create({
      userId: user._id,
      action: 'USER_REGISTERED',
      details: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
