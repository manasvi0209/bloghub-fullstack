import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getCurrentUser()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      )
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Me route error:', error.message)

    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching user',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
