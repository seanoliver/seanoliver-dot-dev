import React from 'react'

/**
 * This component returns the footer.
 * @returns The footer
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className='Footer flex flex-row items-center justify-center w-full h-16'>
      <div className='Footer-item text-sm text-muted-foreground'>
        Sean Oliver
      </div>
      <div className='Footer-item text-sm text-muted-foreground'>
        &nbsp;&copy; {year}
      </div>
    </div>
  )
}
