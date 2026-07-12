import Goodreads from '@/components/goodreads'
import { metadata as readMetadata } from './metadata'

import type { JSX } from 'react'

export const metadata = readMetadata

export default function ReadPage(): JSX.Element {
  return <Goodreads />
}
