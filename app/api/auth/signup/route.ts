import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import User from '@/models/User'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, username, password } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: existingUser.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken',
        },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      username,
      passwordHash,
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id.toString())

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    )

    // Set auth cookie
    await setAuthCookie(token)

    return response
  } catch (error: any) {
    console.error('[v0] Signup error:', error.message)

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
        message: 'Error creating account',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
