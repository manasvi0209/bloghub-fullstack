'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { CommentForm } from '@/components/CommentForm'
import { CommentList } from '@/components/CommentList'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  author: {
    _id: string
    username: string
    email: string
  }
  createdAt: string
  updatedAt: string
  viewCount: number
}

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    username: string
  }
  createdAt: string
  updatedAt: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PostPage({ params }: PageProps) {
  // Unwrap the params promise using React's use() hook
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const { user } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshComments, setRefreshComments] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  useEffect(() => {
    if (post) {
      fetchComments()
    }
  }, [post, refreshComments])

  const fetchPost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`)
      if (!response.ok) throw new Error('Post not found')
      const data = await response.json()
      setPost(data.data)
    } catch (error: any) {
      toast.error(error.message)
      setPost(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.data)
    } catch (error: any) {
      console.error('[v0] Error fetching comments:', error)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      toast.success('Post deleted successfully')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-muted-foreground">Post not found</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </>
    )
  }

  const isOwner = user?._id === post.author._id

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <article className="max-w-2xl mx-auto px-4 py-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-4">
                <span>By {post.author.username}</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
              <span>{post.viewCount} views</span>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link href={`/dashboard/edit/${post._id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button onClick={handleDeletePost} variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            )}
          </header>

          <div className="prose prose-invert max-w-none mb-12 text-foreground whitespace-pre-wrap">{post.content}</div>

          {user ? (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Leave a Comment</h2>
              <CommentForm postId={id} onCommentAdded={() => setRefreshComments(!refreshComments)} />
            </section>
          ) : (
            <div className="bg-muted p-4 rounded-lg mb-12 text-center">
              <p className="text-sm text-muted-foreground">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
                {' to leave a comment'}
              </p>
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h2>
            <CommentList comments={comments} postId={id} onCommentDeleted={() => setRefreshComments(!refreshComments)} />
          </section>
        </article>
      </main>
    </>
  )
}