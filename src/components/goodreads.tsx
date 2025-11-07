'use client'

import { useEffect, useState } from 'react'
import Section from './Section'
import ExternalLink from './external-link'
import { formatDateSpaced } from '@/lib/date-utils'

interface Book {
  title: string
  author: string
  dateRead: string
  link: string
  rating: number
}

const MAX_RATING = 5

function StarRating({ rating }: { rating: number }) {
  if (rating === 0) {
    return <span className='text-muted-foreground text-sm'>—</span>
  }

  return (
    <div
      className='flex items-center gap-0.5'
      role='img'
      aria-label={`Rating: ${rating} out of ${MAX_RATING} stars`}
    >
      {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((star) => (
        <span key={star} className='text-muted-foreground text-sm' aria-hidden='true'>
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default function Goodreads(): JSX.Element | null {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/goodreads')

        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }

        const data = await response.json()
        if (mounted) {
          setBooks(data.books || [])
          setLoading(false)
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch Goodreads data:', err)
        }
        if (mounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchBooks()

    return () => {
      mounted = false
    }
  }, [])

  if (loading || error || books.length === 0) {
    return null
  }

  return (
    <Section title='Read'>
      <div className='w-full max-w-xl'>
        <div className='space-y-1'>
          {books.map((book) => (
            <div
              key={book.link || `${book.title}-${book.author}`}
              className='w-full flex items-center justify-between leading-7 gap-4'
            >
              <a
                href={book.link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm hover:underline flex-1 min-w-0 truncate'
              >
                {book.title}
              </a>
              <div className='whitespace-nowrap hidden sm:flex'>
                <StarRating rating={book.rating} />
              </div>
              {book.dateRead && (
                <span className='text-muted-foreground text-xs whitespace-nowrap'>
                  {formatDateSpaced(book.dateRead)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className='mt-10'>
          <ExternalLink
            href='https://www.goodreads.com/user/show/26616336'
            className='text-xs'
          >
            View my full reading list on Goodreads
          </ExternalLink>
        </div>
      </div>
    </Section>
  )
}
