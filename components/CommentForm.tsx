'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface CommentFormProps {
  postId: string
  onCommentAdded: () => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment')
      }

      setContent('')
      toast.success('Comment posted successfully')
      onCommentAdded()
    } catch (error: any) {
      toast.error(error.message || 'Error posting comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        rows={4}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}
