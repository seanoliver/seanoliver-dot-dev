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

    // Fetch the read shelf and the currently-reading shelf. The read
    // shelf spans two RSS pages (100 items each) because a 2026-03-02
    // bulk import of undated entries fills most of page 1 — dated reads
    // live mostly on page 2.
    const [readPage1Response, readPage2Response, currentlyReadingResponse] =
      await Promise.all([
        fetch(
          `https://www.goodreads.com/review/list_rss/${userId}?shelf=read&page=1`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        ),
        fetch(
          `https://www.goodreads.com/review/list_rss/${userId}?shelf=read&page=2`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        ),
        fetch(
          `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        ),
      ])

    for (const response of [readPage1Response, readPage2Response]) {
      if (!response.ok) {
        throw new Error(`Goodreads read shelf returned ${response.status}`)
      }
    }

    if (!currentlyReadingResponse.ok) {
      throw new Error(
        `Goodreads currently-reading shelf returned ${currentlyReadingResponse.status}`
      )
    }

    const [readPage1Xml, readPage2Xml, currentlyReadingXml] = await Promise.all(
      [
        readPage1Response.text(),
        readPage2Response.text(),
        currentlyReadingResponse.text(),
      ]
    )

    const books = parseReadShelf(readPage1Xml, readPage2Xml)
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
