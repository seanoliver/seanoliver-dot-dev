import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'

export default function AboutContent(): JSX.Element {
  return (
    <Section title='About'>
      <div className='About'>
        <p className='leading-7'>
          Growth Engineer at{' '}
          <UnderLink href='https://supabase.com/'>Supabase</UnderLink>. Building{' '}
          <UnderLink href='https://theragpt.ai/'>TheraGPT</UnderLink> to improve
          mental health through better reflection and reframing. Previously led
          growth and marketing at{' '}
          <UnderLink href='https://www.microsoft.com/'>Microsoft</UnderLink>,{' '}
          <UnderLink href='https://www.linkedin.com/'>LinkedIn</UnderLink>,{' '}
          <UnderLink href='https://www.lyft.com/'>Lyft</UnderLink>,{' '}
          <UnderLink href='https://www.block.xyz/'>Block</UnderLink>, and{' '}
          <UnderLink href='https://gamma.app/'>Gamma</UnderLink>.
        </p>
        <br />
        <p className='leading-7'>
          I also write a{' '}
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
