'use client'

import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_ITEMS } from '@/lib/constants'
import { NavLink } from './navigation'

export function HamburgerMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='md:hidden ml-1'>
          <HamburgerMenuIcon className='h-[1.2rem] w-[1.2rem]' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {NAV_ITEMS.map((item, idx) => (
          <DropdownMenuItem key={`${item.name}-${idx}`}>
            <NavLink
              name={item.name}
              url={item.pageLink}
              icon={item.icon}
              dropdown
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
