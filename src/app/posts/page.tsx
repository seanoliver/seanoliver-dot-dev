import WritingIndex from '@/components/writing-index'
import { getVisibleEntries } from '@/content'
import { metadata as postsMetadata } from './metadata'

export const metadata = postsMetadata

export default async function PostsPage(): Promise<JSX.Element> {
  const entries = await getVisibleEntries()
  return <WritingIndex entries={entries} title='Posts' />
}
