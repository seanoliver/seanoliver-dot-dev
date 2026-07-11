import CurrentlyReading from '@/components/currently-reading'
import Goodreads from '@/components/goodreads'
import Socials from '@/components/socials'
import About from './about/page'
import ExperienceContent from '@/components/experience-content'
import ProjectsContent from '@/components/projects-content'
import WritingIndex from '@/components/writing-index'
import { getVisibleEntries } from '@/content'

export default async function Home(): Promise<JSX.Element> {
  const entries = await getVisibleEntries()

  return (
    <>
      <About />
      <Socials />
      <WritingIndex entries={entries} title='Posts' limit={3} href='/posts' />
      <ProjectsContent limit={3} href='/projects' />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
