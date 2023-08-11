'use client'

import Goodreads from '@/components/goodreads';
import Section from '@/components/section';
import Socials from '@/components/socials';
import About from './about/page';
import Experience from './experience/page';
import Projects from './projects/page';
import Posts from './posts/page';

export default function Home(): JSX.Element {
  return (
    <>
      <Posts />
      <About />
      <Socials />
      <Projects />
      <Experience />
      <Goodreads />
    </>
  )
}
