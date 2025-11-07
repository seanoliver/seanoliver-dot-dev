'use client'

import { useEffect, useState } from 'react'
import Section from './Section'
import List, { ListItem } from './list'
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

export default function Goodreads({ limit, href }: { limit?: number; href?: string } = {}): JSX.Element | null {
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

  const displayBooks = limit ? books.slice(0, limit) : books

  const items: ListItem[] = displayBooks.map((book) => ({
    key: book.link || `${book.title}-${book.author}`,
    left: (
      <a
        href={book.link}
        target='_blank'
        rel='noopener noreferrer'
        className='hover:underline'
      >
        {book.title}
      </a>
    ),
    middle: <StarRating rating={book.rating} />,
    right: book.dateRead ? formatDateSpaced(book.dateRead) : undefined,
  }))

  return (
    <Section title='Read' href={href}>
      <List items={items} />
    </Section>
  )
}
