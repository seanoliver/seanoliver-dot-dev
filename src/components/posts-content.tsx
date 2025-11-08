'use client'

import usePosts from '@/hooks/use-posts'
import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { UnderLink } from '@/components/under-link'
import { formatDateSpaced } from '@/lib/date-utils'

export default function PostsContent(props?: {
  limit?: number
  href?: string
}): JSX.Element {
  const { limit, href } = props ?? {}
  const posts = usePosts()
  const displayPosts = limit ? posts?.slice(0, limit) : posts
  const hasMore = limit != null && (posts?.length ?? 0) > limit

  const items: ListItem[] = (displayPosts ?? []).map((post) => ({
    key: post.url,
    left: <UnderLink href={post.url}>{post.title}</UnderLink>,
    right: formatDateSpaced(post.date),
  }))

  return (
    <Section title='Posts' href={href} hasMore={hasMore}>
      {items.length > 0 && <List items={items} />}
    </Section>
  )
}
