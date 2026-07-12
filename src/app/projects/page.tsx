import ProjectsContent from '@/components/projects-content'
import { metadata as projectsMetadata } from './metadata'

import type { JSX } from 'react'

export const metadata = projectsMetadata

export default function ProjectsPage(): JSX.Element {
  return <ProjectsContent />
}
