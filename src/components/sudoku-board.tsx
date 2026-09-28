import { cn } from '@/lib/utils'

import type { JSX } from 'react'

// A standard starting grid; `.` is an empty cell.
const PUZZLE =
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
const SELECTED = 40

export default function SudokuBoard({
  className,
}: {
  className?: string
}): JSX.Element {
  const selectedRow = Math.floor(SELECTED / 9)
  const selectedCol = SELECTED % 9

  return (
    <div
      aria-hidden
      className={cn(
        'grid grid-cols-9 aspect-square overflow-hidden rounded-md border-2 border-foreground bg-background font-sans',
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
              'flex items-center justify-center text-[11px] border-border',
              col < 8 &&
                (col % 3 === 2 ? 'border-r-2 border-r-foreground' : 'border-r'),
              row < 8 &&
                (row % 3 === 2 ? 'border-b-2 border-b-foreground' : 'border-b'),
              i === SELECTED
                ? 'bg-blue-100 dark:bg-blue-950'
                : (row === selectedRow || col === selectedCol) && 'bg-muted'
            )}
          >
            {cell === '.' ? '' : cell}
          </span>
        )
      })}
    </div>
  )
}
