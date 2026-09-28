'use client'

import { usePathname } from 'next/navigation'
import { HamburgerMenu } from './hamburger-menu'
import { ModeToggle } from './mode-toggle'
import Nav from './navigation'
import Section from './Section'

import type { JSX } from 'react'

// Pages that show the name block under the nav. The homepage renders its own
// intro; individual posts have their own header.
const IDENTITY_PATHS = [
  '/writing',
  '/about',
  '/projects',
  '/experience',
  '/read',
]

export default function Header({
  className,
}: {
  className: string
}): JSX.Element {
  const path = usePathname()
  const showIdentity = IDENTITY_PATHS.includes(path)

  return (
    <>
      <div className={className}>
        <div className='flex justify-between text-sm min-w-max items-center'>
          <Nav />
          <div>
            <ModeToggle />
            <HamburgerMenu />
          </div>
        </div>
      </div>
      {showIdentity && (
        <Section title='Home'>
          <h4 className='font-medium'>Sean Oliver</h4>
          <p className='text-muted-foreground'>Growth Engineer</p>
        </Section>
      )}
    </>
  )
}
