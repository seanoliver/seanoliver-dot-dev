import CurrentlyReading from '@/components/currently-reading'
import Goodreads from '@/components/goodreads'
import Socials from '@/components/socials'
import About from './about/page'
import ExperienceContent from '@/components/experience-content'
import PostsContent from '@/components/posts-content'
import ProjectsContent from '@/components/projects-content'

export default function Home(): JSX.Element {
  return (
    <>
      <About />
      <Socials />
      <PostsContent limit={3} href='/posts' />
      <ProjectsContent limit={3} href='/projects' />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
