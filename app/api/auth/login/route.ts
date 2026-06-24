import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'
import User from '@/models/User'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString())

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    )

    // Set auth cookie
    await setAuthCookie(token)

    return response
  } catch (error: any) {
    console.error('[v0] Login error:', error.message)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          error: error.issues[0]?.message || 'Invalid input',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error logging in',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
