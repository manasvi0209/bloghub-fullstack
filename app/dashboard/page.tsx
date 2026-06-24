'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  author: {
    _id: string
    username: string
  }
  createdAt: string
  viewCount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPosts()
    }
  }, [isAuthenticated, user])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      // Filter to only show current user's posts
      const userPosts = data.data.filter((post: Post) => post.author._id === user?._id)
      setPosts(userPosts)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      setDeletingId(postId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      toast.success('Post deleted successfully')
      setPosts(posts.filter((p) => p._id !== postId))
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Posts</h1>
            <Link href="/dashboard/create">
              <Button>Create New Post</Button>
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">You haven&apos;t created any posts yet.</p>
              <Link href="/dashboard/create">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="border border-border rounded-lg p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} • {post.viewCount} views
                    </p>
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/posts/${post._id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/edit/${post._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      variant="destructive"
                      size="sm"
                    >
                      {deletingId === post._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
