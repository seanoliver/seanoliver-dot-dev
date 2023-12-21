'use client'

import GoodreadsBookshelf from 'react-goodreads-shelf'
import Section from './Section'

export default function Goodreads(): JSX.Element {
  return (
    <Section title='Reading'>
      <div className=''>
        <p className='leading-7'>
          I love reading, but not with my eyes. I&apos;ve been addicted to
          audiobooks since 2019 on a trip to China when I gulped down{' '}
          <i>Bad Blood</i>, <i>Educated</i>, and a few other totally kickass
          books. I aim to &quot;read&quot; about 30 books per year, and usually
          hit it.
        </p>
        <br />
        <p>Here are the 30 I&apos;ve read most recently:</p>
        <br />
        <GoodreadsBookshelf
          userId='26616336'
          limit={30}
          width={30}
          displayOptions={{
            hideBackgroundImages: undefined,
            hideDetails: {
              author: true,
              rating: true,
              subtitle: true,
              title: true,
            },
          }}
        />
      </div>
    </Section>
  )
}
