import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'

export default function AboutContent() {
  return (
    <Section title='About'>
      <div className='space-y-6 leading-7'>
        <p>
          I’m a software engineer with a background in growth and product
          marketing. I work as a Growth Engineer at{' '}
          <UnderLink href='https://supabase.com/'>Supabase</UnderLink> and build{' '}
          <UnderLink href='https://theragpt.ai/'>TheraGPT</UnderLink>, an AI
          journal for reflection and reframing.
        </p>
        <p>
          My work spans choosing a problem, building the software, and helping
          people find and use it. Before engineering, I worked in growth and
          marketing at Microsoft, LinkedIn, Lyft, and Block. I later built
          software at Smol AI and Gamma.
        </p>
        <p>
          I write a{' '}
          <UnderLink href='https://newsletter.seanoliver.dev/'>
            newsletter
          </UnderLink>{' '}
          about indie hacking and productivity. I live in San Francisco with my
          wife, two kids, and our 5 lbs poodle{' '}
          <UnderLink href='https://instagram.com/pixelthemaltipoo'>
            Pixel
          </UnderLink>
          .
        </p>
      </div>
    </Section>
  )
}
