import React from 'react'
import Link from 'next/link'

/**
 * Simple RSS icon SVG
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
    <div className='Footer flex flex-row items-center justify-center gap-4 w-full h-16'>
      <div className='Footer-item text-sm text-muted-foreground'>
        Sean Oliver &copy; {year}
      </div>
      <Link
        href='/feed.xml'
        className='Footer-item text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1'
        aria-label='Subscribe to RSS feed'
      >
        <RssIcon className='w-4 h-4' />
        RSS
      </Link>
    </div>
  )
}
