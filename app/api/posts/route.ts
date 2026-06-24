import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getAllPosts, getTotalPostCount } from '@/lib/db-helpers'
import { getCurrentUser } from '@/lib/auth'
import Post from '@/models/Post'
import { z } from 'zod'

const ITEMS_PER_PAGE = 10

// GET /api/posts - List all posts (paginated)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const skip = (page - 1) * ITEMS_PER_PAGE
    const posts = await getAllPosts(ITEMS_PER_PAGE, skip)
    const totalItems = await getTotalPostCount()
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    return NextResponse.json(
      {
        success: true,
        data: posts.map((post: any) => ({
          _id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          content: post.content.substring(0, 200),
          author: {
            _id: post.authorId._id.toString(),
            username: post.authorId.username,
          },
          createdAt: post.createdAt,
          viewCount: post.viewCount,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Get posts error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching posts',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

// POST /api/posts - Create new post (auth required)
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, content } = createPostSchema.parse(body)

    // Generate slug
    const { getUniqueSlug } = await import('@/lib/db-helpers')
    const slug = await getUniqueSlug(title)

    const post = new Post({
      title,
      slug,
      content,
      authorId: userId,
    })

    await post.save()
    await post.populate('authorId', 'username email')

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
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
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Create post error:', error.message)

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
        message: 'Error creating post',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
