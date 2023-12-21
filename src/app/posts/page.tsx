'use client'

import { format, parseISO } from 'date-fns'
import usePosts from '@/hooks/use-posts'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'

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
                {format(parseISO(post.date), 'yyyy MM dd')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
