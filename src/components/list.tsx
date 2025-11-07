'use client'

import { ReactNode } from 'react'

export interface ListItem {
  key: string | number
  left: ReactNode
  middle?: ReactNode
  right?: ReactNode
}

export default function List({ items }: { items: ListItem[] }): JSX.Element {
  return (
    <div className='w-full max-w-xl'>
      {items.map((item) => (
        <div
          key={item.key}
          className='w-full flex items-center justify-between leading-7 gap-4'
        >
          <span className='font-medium flex-1 min-w-0'>{item.left}</span>
          {item.middle && (
            <span className='text-muted-foreground text-sm whitespace-nowrap hidden sm:inline'>
              {item.middle}
            </span>
          )}
          {item.right && (
            <span className='text-muted-foreground text-xs whitespace-nowrap'>
              {item.right}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
