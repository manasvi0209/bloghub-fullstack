import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import Post from '@/models/Post'
import { z } from 'zod'
import mongoose from 'mongoose'

const updatePostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200).optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
})

// GET /api/posts/[id] - Get single post
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

    const post = await Post.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).populate(
      'authorId',
      'username email'
    )

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          content: post.content,
          author: {
            _id: post.authorId._id.toString(),
            username: post.authorId.username,
            email: post.authorId.email,
          },
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          viewCount: post.viewCount,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Get post error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching post',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update post (auth + ownership check)
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

    // Check ownership
    if (post.authorId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content } = updatePostSchema.parse(body)

    if (title) post.title = title
    if (content) post.content = content
    post.updatedAt = new Date()

    await post.save()
    await post.populate('authorId', 'username email')

    return NextResponse.json(
      {
        success: true,
        message: 'Post updated successfully',
        data: {
          _id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          content: post.content,
          author: {
            _id: post.authorId._id.toString(),
            username: post.authorId.username,
          },
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Update post error:', error.message)

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
        message: 'Error updating post',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete post (auth + ownership check)
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

    // Check ownership
    if (post.authorId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 403 }
      )
    }

    await Post.deleteOne({ _id: id })

    // Also delete all comments on this post
    const Comment = (await import('@/models/Comment')).default
    await Comment.deleteMany({ postId: id })

    return NextResponse.json(
      {
        success: true,
        message: 'Post deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Delete post error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting post',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
