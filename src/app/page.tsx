'use client'

import Goodreads from '@/components/goodreads';
import Socials from '@/components/socials';
import About from './about/page';
import Experience from './experience/page';
import Posts from './posts/page';
import Projects from './projects/page';
import { useNavContext } from './layout';
import { NavRefsProps } from '@/lib/types';

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
