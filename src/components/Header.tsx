'use client'

import { HamburgerMenu } from './hamburger-menu';
import { ModeToggle } from './mode-toggle';
import Nav from './navigation';

export default function Header({ className }: { className: string }): JSX.Element {
  return (
    <div className={className}>
      <div className="flex justify-between text-sm min-w-max items-center">
        <Nav />
        <div>
          <ModeToggle />
          <HamburgerMenu />
        </div>
      </div>
    </div>
  )
}
