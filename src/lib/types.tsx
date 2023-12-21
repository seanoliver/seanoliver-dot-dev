import React from 'react'

export type Project = {
  name: string
  url: string
  description: string
  image: string
  tags: string[]
  github: string
}

/**
 * This type defines props for the main menu. It includes passed-in state and a
 * state setter, as well as the menu content.
 */
export type MenuProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
}

/**
 * This type defines props for the nav item.
 */
export type NavItemProps = {
  item: {
    name: string
    url: string
  }
  isMounted: boolean
  index: number
}

export interface CardWrapperProps {
  children: React.ReactNode
}

export interface NavRefsProps {
  Posts: React.RefObject<HTMLDivElement>
  About: React.RefObject<HTMLDivElement>
  Projects: React.RefObject<HTMLDivElement>
  Experience: React.RefObject<HTMLDivElement>
  [key: string]: React.RefObject<HTMLDivElement>
}
