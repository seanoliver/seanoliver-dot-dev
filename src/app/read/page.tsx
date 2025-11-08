import Goodreads from '@/components/goodreads'
import { metadata as readMetadata } from './metadata'

export const metadata = readMetadata

export default function ReadPage(): JSX.Element {
  return <Goodreads />
}
