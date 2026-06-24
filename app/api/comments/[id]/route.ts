import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import Comment from '@/models/Comment'
import { z } from 'zod'
import mongoose from 'mongoose'

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
})

// PUT /api/comments/[id] - Update comment (auth + ownership check)
export async function PUT(
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
          message: 'Invalid comment ID',
        },
        { status: 400 }
      )
    }

    const comment = await Comment.findById(id)

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      )
    }

    // Check ownership
    if (comment.authorId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = updateCommentSchema.parse(body)

    comment.content = content
    comment.updatedAt = new Date()

    await comment.save()
    await comment.populate('authorId', 'username email')

    return NextResponse.json(
      {
        success: true,
        message: 'Comment updated successfully',
        data: {
          _id: comment._id.toString(),
          content: comment.content,
          author: {
            _id: comment.authorId._id.toString(),
            username: comment.authorId.username,
          },
          updatedAt: comment.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Update comment error:', error.message)

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
        message: 'Error updating comment',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete comment (auth + ownership check)
export async function DELETE(
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
          message: 'Invalid comment ID',
        },
        { status: 400 }
      )
    }

    const comment = await Comment.findById(id)

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      )
    }

    // Check ownership
    if (comment.authorId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 403 }
      )
    }

    await Comment.deleteOne({ _id: id })

    return NextResponse.json(
      {
        success: true,
        message: 'Comment deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Delete comment error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting comment',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
