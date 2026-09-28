import CurrentlyReading from '@/components/currently-reading'
import ExperienceContent from '@/components/experience-content'
import FeaturedProject from '@/components/featured-project'
import Goodreads from '@/components/goodreads'
import { PersonJsonLd, SITE_OWNER } from '@/components/json-ld'
import ProjectsContent from '@/components/projects-content'
import Section from '@/components/Section'
import { PROJECTS } from '@/lib/constants'

import type { JSX } from 'react'

export default function Home(): JSX.Element {
  const featured = PROJECTS.find((project) => project.featured)

  return (
    <>
      <PersonJsonLd person={SITE_OWNER} />
      <Section title='Home'>
        <h1 className='font-medium'>Sean Oliver</h1>
        <p className='text-muted-foreground'>
          Growth engineer at Supabase. After hours I build small apps.
        </p>
      </Section>
      {featured && <FeaturedProject project={featured} />}
      <ProjectsContent limit={4} href='/projects' excludeFeatured />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
