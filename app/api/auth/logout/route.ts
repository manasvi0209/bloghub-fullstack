import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearAuthCookie()

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Logout error:', error.message)

    return NextResponse.json(
      {
        success: false,
        message: 'Error logging out',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
