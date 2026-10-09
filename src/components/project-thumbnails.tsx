import Image from 'next/image'
import SudokuBoard from '@/components/sudoku-board'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

import type { JSX } from 'react'

const FRAME =
  'aspect-square w-full overflow-hidden rounded-sm border border-border bg-background dark:border-foreground/25'

const BALLOT_ROWS = [94, 92, 72, 55]

function BallotThumbnail(): JSX.Element {
  return (
    <div
      aria-hidden
      className={cn(FRAME, 'flex flex-col justify-center gap-[7px] p-2')}
    >
      <div className='flex h-1 gap-[2px]'>
        <span className='flex-[62] bg-foreground' />
        <span className='flex-[24] bg-foreground/55' />
        <span className='flex-[14] bg-foreground/25' />
      </div>
      {BALLOT_ROWS.map((share) => (
        <div key={share} className='flex h-1 gap-[2px]'>
          <span
            className='rounded-[1px] bg-foreground'
            style={{ flex: share }}
          />
          <span
            className='rounded-[1px] bg-foreground/20'
            style={{ flex: 100 - share }}
          />
        </div>
      ))}
    </div>
  )
}

// Night spans, as % of a 24-hour day, for three time zones.
const SOLSTICE_NIGHTS = [
  [
    [0, 29],
    [79, 100],
  ],
  [
    [0, 17],
    [67, 100],
  ],
  [[46, 96]],
]

function SolsticeThumbnail(): JSX.Element {
  return (
    <div
      aria-hidden
      className={cn(FRAME, 'relative flex flex-col justify-center gap-2 p-2')}
    >
      {SOLSTICE_NIGHTS.map((nights, row) => (
        <div
          key={row}
          className='relative h-3 overflow-hidden rounded-[2px] bg-amber-100 dark:bg-amber-200/80'
        >
          {nights.map(([start, end]) => (
            <span
              key={start}
              className='absolute inset-y-0 bg-slate-700 dark:bg-slate-600'
              style={{ left: `${start}%`, width: `${end - start}%` }}
            />
          ))}
        </div>
      ))}
      <span className='absolute inset-y-1.5 left-[40%] w-px bg-blue-500' />
    </div>
  )
}

const THUMBNAILS: Record<string, () => JSX.Element> = {
  'https://github.com/seanoliver/bay-ballot': BallotThumbnail,
  'https://github.com/seanoliver/sudoku': () => (
    <SudokuBoard compact className='w-full' />
  ),
  'https://github.com/seanoliver/solstice': SolsticeThumbnail,
}

export default function ProjectThumbnail({
  project,
}: {
  project: Project
}): JSX.Element {
  const Thumbnail = THUMBNAILS[project.github]
  if (Thumbnail) return <Thumbnail />
  return (
    <Image
      src={project.image}
      alt=''
      width={152}
      height={152}
      className={cn(FRAME, 'object-cover')}
    />
  )
}
