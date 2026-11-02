import TravelGallery from '@/components/travel-gallery'
import { metadata as travelMetadata } from './metadata'

import type { JSX } from 'react'

export const metadata = travelMetadata

export default function TravelPage(): JSX.Element {
  return <TravelGallery />
}
