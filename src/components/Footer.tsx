import React from 'react'
import Link from 'next/link'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { SOCIAL_LINKS } from '@/lib/constants'
import { NEWSLETTER_URL } from '@/lib/site'

const FOOTER_LINK_CLASS =
  'Footer-item text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1'

function socialUrl(name: string): string | undefined {
  return SOCIAL_LINKS.find((link) => link.name === name)?.url
}

const EXTERNAL_LINKS = [
  { name: 'Newsletter', url: NEWSLETTER_URL },
  { name: 'GitHub', url: socialUrl('GitHub') },
  { name: 'X', url: socialUrl('X') },
]

/**
 * Simple RSS icon SVG component
 * @param className - Optional CSS classes
 */
const RssIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
    role='img'
    aria-label='RSS feed icon'
  >
    <path d='M4 11a9 9 0 0 1 9 9' />
    <path d='M4 4a16 16 0 0 1 16 16' />
    <circle cx='5' cy='19' r='1' />
  </svg>
)

/**
 * This component returns the footer.
 * @returns The footer
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className='Footer flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full min-h-16 py-4'>
      <div className='Footer-item text-sm text-muted-foreground'>
        Sean Oliver &copy; {year}
      </div>
      <Link href='/writing' className={FOOTER_LINK_CLASS}>
        Writing
      </Link>
      {EXTERNAL_LINKS.map(
        ({ name, url }) =>
          url && (
            <a
              key={name}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className={FOOTER_LINK_CLASS}
            >
              {name}
              <ArrowTopRightIcon className='w-4 h-4' aria-hidden='true' />
            </a>
          )
      )}
      <Link
        href='/feed.xml'
        className={FOOTER_LINK_CLASS}
        aria-label='Subscribe to RSS feed'
      >
        <RssIcon className='w-4 h-4' />
        RSS
      </Link>
    </div>
  )
}
