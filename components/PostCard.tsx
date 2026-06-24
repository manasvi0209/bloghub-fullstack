import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
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

export function PostCard({ _id, title, slug, content, author, createdAt, viewCount }: PostCardProps) {
  return (
    <article className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <Link href={`/posts/${_id}`} className="hover:no-underline">
        <h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary">{title}</h3>
      </Link>

      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{content}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>By {author.username}</span>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
        <span>{viewCount} views</span>
      </div>
    </article>
  )
}
