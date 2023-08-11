'use client'

import Section from '@/components/section'
import About from './about/page'
import Projects from './projects/page'
import Experience from './experience/page'
import Socials from '@/components/socials'
import Goodreads from '@/components/goodreads'

import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'
import usePosts from '@/hooks/use-posts'
import PostList from '@/components/post-list'

export default function Home(): JSX.Element {
  const posts = usePosts()

  return (
    <>
      <Section title="Home">
        <h4 className="font-medium">Sean Oliver</h4>
        <p className="text-muted-foreground">Software Engineer</p>
      </Section>
      {posts && posts.length > 0 && (
        <Section title="Recent">
          <PostList posts={posts} limit={3} />
        </Section>
      )}
      <Section title="About">
        <About />
      </Section>
      <Section title="Social">
        <Socials />
      </Section>
      <Section title="Projects">
        <Projects />
      </Section>
      <Section title="Experience">
        <Experience />
      </Section>
      <Section title="Reading">
        <Goodreads />
      </Section>
    </>
  )
}
