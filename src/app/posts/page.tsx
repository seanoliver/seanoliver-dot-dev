'use client'

import { format, parseISO } from 'date-fns'
import usePosts from '@/hooks/use-posts'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { useRouter } from 'next/navigation'

export default function Posts({ limit = 10 }: { limit?: number }): JSX.Element {
  let posts = usePosts()

  const router = useRouter()
  if (!posts) router.push('/')

  // @ts-ignore - if posts is undefined, router will push to home
  posts = posts.slice(0, limit)

  return (
    <Section title="Writing">
      {posts && posts.length > 0 && (
        <div className="mx-auto max-w-xl">
          {posts.map((post, idx) => (
            <div key={idx} className="w-full flex items-center justify-between leading-7">
              <span className="font-medium">
                <UnderLink href={post.url}>{post.title}</UnderLink>
              </span>
              <span className="text-muted-foreground text-xs hidden sm:inline">
                {format(parseISO(post.date), 'MMMM dd, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
