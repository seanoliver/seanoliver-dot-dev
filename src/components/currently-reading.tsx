'use client'

import { useEffect, useState } from 'react'
import Section from './Section'
import ExternalLink from './external-link'
import { formatDate } from '@/lib/date-utils'

interface CurrentlyReadingBook {
  title: string
  author: string
  dateStarted: string
  link: string
}

export default function CurrentlyReading(): JSX.Element | null {
  const [book, setBook] = useState<CurrentlyReadingBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch('/api/goodreads')

        if (!response.ok) {
          throw new Error('Failed to fetch currently reading')
        }

        const data = await response.json()
        setBook(data.currentlyReading || null)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch currently reading data:', err)
        setError(true)
        setLoading(false)
      }
    }

    fetchBook()
  }, [])

  // Don't render the section at all if there's no book
  if (!loading && !book) {
    return null
  }

  return (
    <Section title='Reading'>
      <div className='w-full max-w-xl'>
        {loading && (
          <div className='text-sm text-muted-foreground'>Loading...</div>
        )}

        {error && (
          <div className='text-sm text-muted-foreground'>
            Unable to load currently reading.{' '}
            <ExternalLink
              href='https://www.goodreads.com/user/show/26616336'
              className='text-sm'
            >
              View on Goodreads
            </ExternalLink>
          </div>
        )}

        {!loading && !error && book && (
          <div className='w-full flex items-center justify-between leading-7 gap-4'>
            <a
              href={book.link}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm hover:underline flex-1 min-w-0 truncate'
            >
              {book.title}
            </a>
            <span className='text-muted-foreground text-sm whitespace-nowrap'>
              {book.author}
            </span>
            {book.dateStarted && (
              <span className='text-muted-foreground text-xs whitespace-nowrap'>
                {formatDate(book.dateStarted, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
