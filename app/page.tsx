'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { PostCard } from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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

interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPosts(page)
  }, [page])

  const fetchPosts = async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=${pageNum}`)

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.data)
      setPagination(data.pagination)
    } catch (error: any) {
      toast.error(error.message || 'Error fetching posts')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Welcome to BlogHub
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              A modern platform for sharing ideas, writing stories, and engaging with a community of thinkers and creators.
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard/create">
                <Button className="px-6 py-3">Create Your First Post</Button>
              </Link>
            ) : (
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/auth/signup">
                  <Button className="px-6 py-3">Get Started</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="px-6 py-3">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Latest Posts</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No posts yet. {isAuthenticated ? 'Create the first one!' : 'Sign up to get started.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <PostCard key={post._id} {...post} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || isLoading}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages || isLoading}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
