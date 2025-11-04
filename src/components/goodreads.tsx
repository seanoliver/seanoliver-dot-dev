'use client'

import { useEffect, useState } from 'react'
import Section from './Section'
import ExternalLink from './external-link'
import { formatDate } from '@/lib/date-utils'

interface Book {
  title: string
  author: string
  dateRead: string
  link: string
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

  // Don't render the section until loading is complete
  if (loading) {
    return null
  }

  return (
    <Section title='Read'>
      <div className='w-full max-w-xl'>
        {error && (
          <div className='text-sm text-muted-foreground'>
            Unable to load reading list.{' '}
            <ExternalLink
              href='https://www.goodreads.com/user/show/26616336'
              className='text-sm'
            >
              View on Goodreads
            </ExternalLink>
          </div>
        )}

        {!error && books.length > 0 && (
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
                <span className='text-muted-foreground text-sm whitespace-nowrap'>
                  {book.author}
                </span>
                {book.dateRead && (
                  <span className='text-muted-foreground text-xs whitespace-nowrap'>
                    {formatDate(book.dateRead, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {!error && books.length > 0 && (
          <div className='mt-10'>
            <ExternalLink
              href='https://www.goodreads.com/user/show/26616336'
              className='text-xs'
            >
              View my full reading list on Goodreads
            </ExternalLink>
          </div>
        )}
      </div>
    </Section>
  )
}
