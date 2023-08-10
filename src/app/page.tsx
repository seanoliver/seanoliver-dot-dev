'use client'

import Section from '@/components/Section';
import Goodreads from '@/components/goodreads';
import Socials from '@/components/socials';
import About from './about/page';
import Experience from './experience/page';
import Projects from './projects/page';
import Writing from './writing/page';

export default function Home(): JSX.Element {

  return (
    <>
      <Section title="Home">
        <h4 className="font-medium">Sean Oliver</h4>
        <p className="text-muted-foreground">Software Engineer</p>
      </Section>
      {/* TODO: Add temporary line here to surface new posts when they're < 14 days old */}

      {/* Main Sections*/}

      <About />
      <Writing />
      <Projects />
      <Experience />

      {/* Widgets */}

      <Section title="Reading">
        <Goodreads />
      </Section>
      <Section title="Social">
        <Socials />
      </Section>
    </>
  )
}
