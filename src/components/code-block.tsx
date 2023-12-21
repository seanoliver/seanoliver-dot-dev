'use client'

import { ReactNode } from 'react'

export default function CodeBlock({
  code,
  language,
  ...props
}: {
  code: ReactNode
  language: string
  [key: string]: any
}) {
  return (
    <div className='relative my-10 lg:w-[calc(100% + 32px)] lg:-mx-10'>
      <div className='text-xs text-neutral-200 dark:text-neutral-500 hover:text-neutral-300 font-semibold uppercase cursor-default bg-neutral-600 dark:bg-neutral-900 hover:bg-neutral-700 p-1 px-2 rounded-tr-md rounded-bl-md right-0 top-0 absolute'>
        {language}
      </div>
      <pre
        {...props}
        className='bg-neutral-100 my-4 text-sm rounded-md p-4 overflow-auto'
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
