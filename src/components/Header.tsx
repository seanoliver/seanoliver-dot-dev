'use client'

import { usePathname } from 'next/navigation'
import { HamburgerMenu } from './hamburger-menu'
import { ModeToggle } from './mode-toggle'
import Nav from './navigation'
import Section from './Section'
import { NAV_ITEMS } from '@/lib/constants'

export default function Header({
  className,
}: {
  className: string
}): JSX.Element {
  const path = usePathname()
  const navPaths = NAV_ITEMS.map((item) => item.pageLink)
  navPaths.push('/')

  const notBlogPost = navPaths.includes(path)

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
      {notBlogPost && (
        <Section title='Home'>
          <h4 className='font-medium'>Sean Oliver</h4>
          <p className='text-muted-foreground'>Software Engineer</p>
        </Section>
      )}
    </>
  )
}
