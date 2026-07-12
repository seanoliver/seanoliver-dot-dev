import { NextResponse } from 'next/server'

import { parseCurrentlyReadingShelf, parseReadShelf } from '@/lib/goodreads'

// Use Node.js runtime for better XML parsing performance
export const runtime = 'nodejs'
export const revalidate = 3600

export async function GET(): Promise<Response> {
  try {
    const userId = process.env.GOODREADS_USER_ID

    if (!userId) {
      return NextResponse.json(
        { error: 'GOODREADS_USER_ID environment variable not set' },
        { status: 500 }
      )
    }

    // Fetch both read and currently-reading shelves
    const [readResponse, currentlyReadingResponse] = await Promise.all([
      fetch(`https://www.goodreads.com/review/list_rss/${userId}?shelf=read`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }),
      fetch(
        `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }
      ),
    ])

    if (!readResponse.ok) {
      throw new Error(`Goodreads read shelf returned ${readResponse.status}`)
    }

    if (!currentlyReadingResponse.ok) {
      throw new Error(
        `Goodreads currently-reading shelf returned ${currentlyReadingResponse.status}`
      )
    }

    const readXml = await readResponse.text()
    const currentlyReadingXml = await currentlyReadingResponse.text()

    const books = parseReadShelf(readXml)
    const currentlyReading = parseCurrentlyReadingShelf(currentlyReadingXml)

    return NextResponse.json({ books, currentlyReading })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[goodreads] API fetch failed:', error)
    }
    return NextResponse.json(
      { error: 'Failed to fetch reading list' },
      { status: 500 }
    )
  }
}
