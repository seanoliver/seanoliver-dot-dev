import PostsContent from '@/components/posts-content'
import { metadata as postsMetadata } from './metadata'

export const metadata = postsMetadata

export default function PostsPage(): JSX.Element {
  return <PostsContent />
}
