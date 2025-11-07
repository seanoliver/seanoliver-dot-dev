'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Separator } from './ui/separator'
import { useNavContext } from '@/hooks/use-nav-context'
import { NavRefsProps } from '@/lib/types'

export default function Section({
  className,
  title,
  children,
  href,
}: {
  className?: string
  title: string
  children: React.ReactNode
  href?: string
}): JSX.Element {
  const isHome = title === 'Home'
  const refs: NavRefsProps = useNavContext()
  const [isHovered, setIsHovered] = useState(false)
  const showPermalink = !!href

  return (
    <div
      ref={refs[title] || null}
      className={`text-sm w-full md:my-20 my-10 flex md:flex-row flex-col ${className}`}
    >
      {!isHome ? (
        <div className='text-muted-foreground w-1/4 md:mb-0 mb-4'>
          {showPermalink ? (
            <Link
              href={href}
              className='hover:text-foreground transition-colors'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {title}
              {isHovered && <span className='ml-1'>#</span>}
            </Link>
          ) : (
            title
          )}
        </div>
      ) : null}
      <Separator orientation='vertical' />
      <div className={isHome ? 'w-full' : 'md:w-3/4 w-full'}>{children}</div>
    </div>
  )
}
