import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import Comment from '@/models/Comment'
import Post from '@/models/Post'
import { z } from 'zod'
import mongoose from 'mongoose'

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  parentCommentId: z.string().optional(),
})

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid post ID',
        },
        { status: 400 }
      )
    }

    const post = await Post.findById(id)

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      )
    }

    const comments = await Comment.find({ postId: id })
      .populate('authorId', 'username email')
      .populate('parentCommentId')
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        data: comments.map((comment: any) => ({
          _id: comment._id.toString(),
          content: comment.content,
          author: {
            _id: comment.authorId._id.toString(),
            username: comment.authorId.username,
          },
          parentCommentId: comment.parentCommentId?._id?.toString() || null,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Get comments error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching comments',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/posts/[id]/comments - Create comment (auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const userId = await getCurrentUser()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid post ID',
        },
        { status: 400 }
      )
    }

    const post = await Post.findById(id)

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { content, parentCommentId } = createCommentSchema.parse(body)

    const comment = new Comment({
      content,
      authorId: userId,
      postId: id,
      parentCommentId: parentCommentId || null,
    })

    await comment.save()
    await comment.populate('authorId', 'username email')

    return NextResponse.json(
      {
        success: true,
        message: 'Comment created successfully',
        data: {
          _id: comment._id.toString(),
          content: comment.content,
          author: {
            _id: comment.authorId._id.toString(),
            username: comment.authorId.username,
          },
          parentCommentId: comment.parentCommentId?.toString() || null,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Create comment error:', error.message)

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
        message: 'Error creating comment',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
