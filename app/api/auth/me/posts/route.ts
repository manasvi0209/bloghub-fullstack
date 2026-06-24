import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()

    const posts = await db
      .collection('posts')
      .find({ authorId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      {
        posts: posts.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          content: p.content,
          authorName: p.authorName,
          authorEmail: p.authorEmail,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Get user posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
