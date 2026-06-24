'use client'

import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useState } from 'react'

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

interface CommentListProps {
  comments: Comment[]
  postId: string
  onCommentDeleted: () => void
}

export function CommentList({ comments, postId, onCommentDeleted }: CommentListProps) {
  const { user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      setDeletingId(commentId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      toast.success('Comment deleted')
      onCommentDeleted()
    } catch (error: any) {
      toast.error(error.message || 'Error deleting comment')
    } finally {
      setDeletingId(null)
    }
  }

  if (comments.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-sm">{comment.author.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
            {user?._id === comment.author._id && (
              <Button
                onClick={() => handleDelete(comment._id)}
                disabled={deletingId === comment._id}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                {deletingId === comment._id ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
          <p className="text-sm text-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
