import { cn } from '@/lib/utils'

import type { JSX } from 'react'

// A standard starting grid; `.` is an empty cell.
const PUZZLE =
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
const SELECTED = 40

export default function SudokuBoard({
  className,
  compact = false,
}: {
  className?: string
  /** Thumbnail size: hides the digits, which are unreadable that small. */
  compact?: boolean
}): JSX.Element {
  const selectedRow = Math.floor(SELECTED / 9)
  const selectedCol = SELECTED % 9

  return (
    <div
      aria-hidden
      className={cn(
        'grid grid-cols-9 aspect-square overflow-hidden border-foreground bg-background font-sans',
        compact ? 'rounded-sm border-[1.5px]' : 'rounded-md border-2',
        className
      )}
    >
      {PUZZLE.split('').map((cell, i) => {
        const row = Math.floor(i / 9)
        const col = i % 9
        return (
          <span
            key={i}
            className={cn(
              'flex items-center justify-center text-[11px] border-border dark:border-foreground/25',
              col < 8 &&
                (col % 3 === 2
                  ? 'border-r-2 border-r-foreground dark:border-r-foreground'
                  : 'border-r'),
              row < 8 &&
                (row % 3 === 2
                  ? 'border-b-2 border-b-foreground dark:border-b-foreground'
                  : 'border-b'),
              i === SELECTED
                ? 'bg-blue-100 dark:bg-blue-950'
                : (row === selectedRow || col === selectedCol) && 'bg-muted'
            )}
          >
            {compact || cell === '.' ? '' : cell}
          </span>
        )
      })}
    </div>
  )
}
