'use client'

import Link from 'next/link'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  OptimizedAvatar,
  OptimizedAvatarFallback,
  OptimizedAvatarImage,
} from '@/components/optimized-avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Nav(): JSX.Element {
  return (
    <div className='flex items-center'>
      <Link href='/'>
        <OptimizedAvatar className='mr-4'>
          <OptimizedAvatarImage
            src='/profile.jpeg'
            alt='Sean Oliver'
            priority
          />
          <OptimizedAvatarFallback>SO</OptimizedAvatarFallback>
        </OptimizedAvatar>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className='md:flex hidden'>
          {NAV_ITEMS.map((item, idx) => (
            <NavLink
              key={`${item.name}-${idx}`}
              name={item.name}
              url={item.pageLink}
              icon={item.icon}
            />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

function CommonElements({
  name,
  icon,
  url,
}: {
  name: string
  icon?: React.ReactNode
  url: string
}): JSX.Element {
  const pathname = usePathname()
  const isActive = pathname === url

  return (
    <Link
      href={url}
      className={cn(
        'flex md:py-2 md:px-3 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      {name}
      {icon && icon}
    </Link>
  )
}

export function NavLink({
  name,
  url,
  icon,
  dropdown,
}: {
  name: string
  url: string
  icon?: React.ReactNode
  dropdown?: boolean
}): JSX.Element {
  return dropdown ? (
    <DropdownMenuItem>
      <CommonElements name={name} icon={icon} url={url} />
    </DropdownMenuItem>
  ) : (
    <NavigationMenuItem>
      <CommonElements name={name} icon={icon} url={url} />
    </NavigationMenuItem>
  )
}
