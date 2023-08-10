'use client'

import usePosts from '@/hooks/use-posts'
import Section from '@/components/Section'
import PostList from '@/components/post-list'
import { redirect } from 'next/navigation';

export default function Writing() {
  const posts = usePosts()

  if (!posts?.length) redirect('/')

  return (
    <Section title="Writing">
      <PostList posts={posts} limit={3} />
    </Section>
  )
}
