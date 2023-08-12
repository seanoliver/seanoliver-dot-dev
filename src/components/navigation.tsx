'use client'

import Link from 'next/link'
import { Link as ScrollLink } from 'react-scroll'
import * as React from 'react'
import { MoonIcon, SunIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { Separator } from './ui/separator'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { NAV_ITEMS } from '@/lib/constants'

export default function Nav(): JSX.Element {
  const path = usePathname()
  return (
    <div className="flex items-center">
      <Link href="/">
        <Avatar className="mr-4">
          <AvatarImage src="./profile.jpeg" />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="md:flex hidden">
          {NAV_ITEMS.map((item, idx) => (
            <NavLink
              key={`${item.name}-${idx}`}
              name={item.name}
              url={path !== '/' ? item.pageLink : item.url}
              icon={item.icon}
              scroll={!(item.icon || path !== '/')}
              separator={idx < NAV_ITEMS.length - 1}
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
  scroll,
  url,
  separator,
}: {
  name: string
  icon?: React.ReactNode
  scroll: boolean
  url: string
  separator: boolean
}): JSX.Element {
  return (
    <>
      {scroll ? (
        <ScrollLink
          to={name.toLowerCase()}
          spy
          smooth="easeInOutQuint"
          duration={1000}
          offset={-100}
          className="flex md:py-2 md:px-3 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          {name}
          {icon && icon}
        </ScrollLink>
      ) : (
        <Link
          href={url}
          className="flex md:py-2 md:px-3 rounded-lg hover:bg-accent hover:text-accent-foregroun cursor-pointer"
        >
          {name}
          {icon && icon}
        </Link>
      )}
      {separator && <Separator className="mx-2" orientation="vertical" />}
    </>
  )
}

// menu logic:
// - if on / scroll to section; otherwise go to url
// - if external link, open in new tab
// - if link has icon, show icon
// - if link is last, don't show separator

export function NavLink({
  name,
  url,
  icon,
  scroll,
  separator,
  dropdown,
}: {
  name: string
  url: string
  icon?: React.ReactNode
  scroll: boolean
  separator: boolean
  dropdown?: boolean
}): JSX.Element {
  return dropdown ? (
    <DropdownMenuItem>
      <CommonElements name={name} icon={icon} scroll={scroll} url={url} separator={separator} />
    </DropdownMenuItem>
  ) : (
    <NavigationMenuItem>
      <CommonElements name={name} icon={icon} scroll={scroll} url={url} separator={separator} />
    </NavigationMenuItem>
  )
}

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HamburgerMenu() {
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
              dropdown
              scroll={!item.icon}
              separator={idx === NAV_ITEMS.length - 2}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
