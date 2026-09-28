import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

import type { JSX } from 'react'

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  live: {
    label: 'Live',
    className:
      'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  },
  building: {
    label: 'Building',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  parked: { label: 'Parked', className: 'bg-muted text-muted-foreground' },
  contributor: {
    label: 'Contributor',
    className:
      'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  },
}

export function StatusLabel({
  status,
}: {
  status: ProjectStatus
}): JSX.Element {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[11px] font-medium leading-5',
        className
      )}
    >
      {status === 'live' && <span aria-hidden='true'>● </span>}
      {label}
    </span>
  )
}
