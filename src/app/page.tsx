import CurrentlyReading from '@/components/currently-reading'
import Goodreads from '@/components/goodreads'
import PortfolioIntro from '@/components/portfolio-intro'
import FeaturedProject from '@/components/featured-project'
import ExperienceContent from '@/components/experience-content'
import ProjectsContent from '@/components/projects-content'
import WritingIndex from '@/components/writing-index'
import { getVisibleEntries } from '@/content'

import type { JSX } from 'react'

export default async function Home(): Promise<JSX.Element> {
  const entries = await getVisibleEntries()

  return (
    <>
      <PortfolioIntro />
      <FeaturedProject />
      <WritingIndex
        entries={entries}
        title='Writing'
        limit={3}
        href='/writing'
      />
      <ProjectsContent limit={3} href='/projects' />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
