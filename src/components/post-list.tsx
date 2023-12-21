import { format, parseISO } from 'date-fns'
import { Post } from 'contentlayer/generated'
import { UnderLink } from '@/components/under-link'

export default function PostList({
  posts,
  limit,
}: {
  posts: Post[]
  limit?: number
}) {
  if (limit) {
    posts = posts.slice(0, limit)
  }

  return (
    <div className='mx-auto max-w-xl'>
      {posts.map((post, idx) => (
        <div
          key={idx}
          className='w-full flex items-center justify-between leading-7'
        >
          <span className='font-medium'>
            <UnderLink href={post.url}>{post.title}</UnderLink>
          </span>
          <span className='text-muted-foreground text-xs'>
            {format(parseISO(post.date), 'MMMM dd, yyyy')}
          </span>
        </div>
      ))}
    </div>
  )
}
