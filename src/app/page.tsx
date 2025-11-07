import CurrentlyReading from '@/components/currently-reading'
import Goodreads from '@/components/goodreads'
import Socials from '@/components/socials'
import About from './about/page'
import Experience from './experience/page'
import Posts from './posts/page'
import Projects from './projects/page'

export default function Home(): JSX.Element {
  return (
    <>
      <About />
      <Socials />
      <Posts limit={3} href='/posts' />
      <Projects limit={3} href='/projects' />
      <Experience limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
