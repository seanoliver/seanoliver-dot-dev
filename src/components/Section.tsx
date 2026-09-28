'use client'

import { useState, type JSX } from 'react'
import Link from 'next/link'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

export default function Section({
  className,
  title,
  children,
  href,
  hasMore = false,
  fullWidth = false,
}: {
  className?: string
  title: string
  children: React.ReactNode
  href?: string
  hasMore?: boolean
  /** Stack the label above the content at every breakpoint so the content can use the full width. */
  fullWidth?: boolean
}): JSX.Element {
  const isHome = title === 'Home'
  const [isHovered, setIsHovered] = useState(false)
  const showPermalink = !!href

  return (
    <div
      className={cn(
        'text-sm w-full md:my-20 my-10 flex flex-col',
        !fullWidth && 'md:flex-row',
        className
      )}
    >
      {!isHome ? (
        <div
          className={cn(
            'text-muted-foreground w-full mb-4',
            !fullWidth && 'md:w-1/4 md:mb-0'
          )}
        >
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
      <div className={isHome || fullWidth ? 'w-full' : 'md:w-3/4 w-full'}>
        {children}
        {hasMore && href && (
          <Link
            href={href}
            className='text-muted-foreground text-xs mt-2 hover:text-foreground transition-colors inline-block'
          >
            → View all
          </Link>
        )}
      </div>
    </div>
  )
}
