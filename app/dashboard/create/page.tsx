'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CreatePostPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post')
      }

      toast.success('Post created successfully!')
      router.push(`/posts/${data.data._id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
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
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Create New Post</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your post title..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-96 font-mono text-sm"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">You can use plain text or markdown formatting</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
