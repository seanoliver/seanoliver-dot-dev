'use client'

import { Separator } from './ui/separator'
import { useNavContext } from '@/hooks/use-nav-context'
import { NavRefsProps } from '@/lib/types'

export default function Section({
  className,
  title,
  children,
}: {
  className?: string
  title: string
  children: React.ReactNode
}): JSX.Element {
  const isHome = title === 'Home'
  const refs: NavRefsProps = useNavContext()

  return (
    <div
      ref={refs[title] || null}
      className={`text-sm w-full md:my-20 my-10 flex md:flex-row flex-col ${className}`}
    >
      {!isHome ? (
        <div className='text-muted-foreground w-1/4 md:mb-0 mb-4'>{title}</div>
      ) : null}
      <Separator orientation='vertical' />
      <div className={isHome ? 'w-full' : 'md:w-3/4 w-full'}>{children}</div>
    </div>
  )
}
