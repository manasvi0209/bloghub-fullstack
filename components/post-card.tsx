import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  id: string
  title: string
  content: string
  authorName: string
  authorEmail: string
  createdAt: Date | string
}

export function PostCard({
  id,
  title,
  content,
  authorName,
  authorEmail,
  createdAt,
}: PostCardProps) {
  const date =
    typeof createdAt === 'string' ? new Date(createdAt) : createdAt

  return (
    <Link href={`/posts/${id}`}>
      <article className="border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground line-clamp-2">
            {title}
          </h2>

          <p className="text-muted-foreground line-clamp-3">{content}</p>

          <div className="flex justify-between items-center text-sm text-muted-foreground pt-3 border-t border-border">
            <span>{authorName}</span>
            <time dateTime={date.toISOString()}>
              {formatDistanceToNow(date, { addSuffix: true })}
            </time>
          </div>
        </div>
      </article>
    </Link>
  )
}
