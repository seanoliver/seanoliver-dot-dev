import { allPosts } from 'contentlayer/generated'
import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { UnderLink } from '@/components/under-link'
import { compareDateDesc, formatDateSpaced } from '@/lib/date-utils'

interface PostListItem {
  title: string
  date: string
  url: string
}

// Server-side selection: published posts only in production, drafts included
// in development. Only title/date/url reach the rendered list — compiled MDX
// bodies never leave the server.
function getVisiblePosts(): PostListItem[] {
  const visiblePosts =
    process.env.NODE_ENV === 'development'
      ? allPosts
      : allPosts.filter((post) => post.isPublished)

  return visiblePosts
    .slice()
    .sort((a, b) => compareDateDesc(new Date(a.date), new Date(b.date)))
    .map((post) => ({ title: post.title, date: post.date, url: post.url }))
}

export default function PostsContent(props?: {
  limit?: number
  href?: string
}): JSX.Element {
  const { limit, href } = props ?? {}
  const posts = getVisiblePosts()
  const displayPosts = limit ? posts.slice(0, limit) : posts
  const hasMore = limit != null && posts.length > limit

  const items: ListItem[] = displayPosts.map((post) => ({
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
