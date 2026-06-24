'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Edit2, X, Check } from 'lucide-react'

interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: Date | string
}

interface CommentListProps {
  comments: Comment[]
  currentUserId?: string
  postId: string
  onCommentDeleted?: (commentId: string) => void
}

export function CommentList({
  comments,
  currentUserId,
  postId,
  onCommentDeleted,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })

      if (res.ok) {
        setEditingId(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('[v0] Edit comment error:', error)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      setIsDeleting(commentId)
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onCommentDeleted?.(commentId)
        window.location.reload()
      }
    } catch (error) {
      console.error('[v0] Delete comment error:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No comments yet. Be the first!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const date =
          typeof comment.createdAt === 'string'
            ? new Date(comment.createdAt)
            : comment.createdAt
        const isOwner = currentUserId === comment.authorId

        return (
          <div
            key={comment.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition"
          >
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <p className="font-semibold text-sm">{comment.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(date, { addSuffix: true })}
                </p>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  {editingId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="p-1 rounded hover:bg-primary/10 transition"
                        title="Save"
                      >
                        <Check size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded hover:bg-destructive/10 transition"
                        title="Cancel"
                      >
                        <X size={16} className="text-destructive" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(comment)}
                        className="p-1 rounded hover:bg-primary/10 transition"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting === comment.id}
                        className="p-1 rounded hover:bg-destructive/10 transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {editingId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 rounded border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            ) : (
              <p className="text-foreground whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
