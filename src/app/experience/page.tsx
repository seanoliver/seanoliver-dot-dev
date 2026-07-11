import ExperienceContent from '@/components/experience-content'
import { metadata as experienceMetadata } from './metadata'

import type { JSX } from 'react'

export const metadata = experienceMetadata

export default function ExperiencePage(): JSX.Element {
  return <ExperienceContent />
}
