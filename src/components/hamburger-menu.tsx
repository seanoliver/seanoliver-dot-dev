'use client'

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NAV_ITEMS } from '@/lib/constants';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { NavLink } from './navigation';

export const HamburgerMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden ml-1">
            <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {NAV_ITEMS.map((item, idx) => (
            <DropdownMenuItem key={`${item.name}-${idx}`}>
              <NavLink
                key={`${item.name}-${idx}`}
                name={item.name}
                url={item.url}
                icon={item.icon}
                dropdown={true}
                scroll={item.icon ? false : true}
                separator={idx === NAV_ITEMS.length - 2}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }