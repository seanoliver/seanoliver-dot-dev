'use client'

import { format, parseISO } from 'date-fns'
import usePosts from '@/hooks/use-posts'
import Section from '@/components/section'
import { UnderLink } from '@/components/under-link';

export default function Posts({ limit }: { limit?: number }) {
  const posts = usePosts()

  return (
    <Section title="Writing">
      {posts && posts.length > 0 && (
        <div className="mx-auto max-w-xl">
          {posts.map((post, idx) => (
            <div key={idx} className="w-full flex items-center justify-between leading-7">
              <span className="font-medium">
                <UnderLink href={post.url}>{post.title}</UnderLink>
              </span>
              <span className="text-muted-foreground text-xs">
                {format(parseISO(post.date), 'MMMM dd, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}