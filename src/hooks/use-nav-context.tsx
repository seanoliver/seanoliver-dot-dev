import { NavRefsProps } from '@/lib/types'
import { createRef, useContext } from 'react'
import { createContext } from 'react'

/** Create nav context provider for smooth scrolling */
export const NavContext = createContext<NavRefsProps>({
  Posts: createRef(),
  About: createRef(),
  Projects: createRef(),
  Experience: createRef(),
})

export const useNavContext = () => useContext(NavContext)
