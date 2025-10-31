'use client'

import usePosts from '@/hooks/use-posts'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { formatDate } from '@/lib/date-utils'

export default function Posts(): JSX.Element {
  let posts = usePosts()

  return (
    <Section title='Posts'>
      {posts && posts.length > 0 && (
        <div className='w-full max-w-xl'>
          {posts.map((post, idx) => (
            <div
              key={idx}
              className='w-full flex items-center justify-between leading-7'
            >
              <span className='font-medium'>
                <UnderLink href={post.url}>{post.title}</UnderLink>
              </span>
              <span className='text-muted-foreground text-xs hidden sm:inline'>
                {formatDate(post.date, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
