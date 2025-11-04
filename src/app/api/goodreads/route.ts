import { NextResponse } from 'next/server'

// Use Node.js runtime for better XML parsing performance
export const runtime = 'nodejs'
export const revalidate = 3600

interface Book {
  title: string
  author: string
  dateRead: string
  link: string
}

interface CurrentlyReadingBook {
  title: string
  author: string
  dateStarted: string
  link: string
}

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

    // Helper function to clean title
    const cleanTitle = (title: string): string => {
      let cleaned = title.split(':')[0]
      cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/, '')
      return cleaned.trim()
    }

    // Helper function to parse read book from XML item
    const parseBook = (item: string): Book | null => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)
      const dateReadMatch = item.match(
        /<user_read_at><!\[CDATA\[(.*?)\]\]><\/user_read_at>/
      )
      const authorMatch = item.match(/<author_name>(.*?)<\/author_name>/)

      if (!titleMatch || !authorMatch) return null

      return {
        title: cleanTitle(titleMatch[1]),
        author: authorMatch[1].trim(),
        dateRead: dateReadMatch ? dateReadMatch[1] : '',
        link: linkMatch ? linkMatch[1] : '',
      }
    }

    // Helper function to parse currently reading book from XML item
    const parseCurrentlyReadingBook = (
      item: string
    ): CurrentlyReadingBook | null => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)
      const dateStartedMatch = item.match(
        /<user_date_added><!\[CDATA\[(.*?)\]\]><\/user_date_added>/
      )
      const authorMatch = item.match(/<author_name>(.*?)<\/author_name>/)

      if (!titleMatch || !authorMatch) return null

      return {
        title: cleanTitle(titleMatch[1]),
        author: authorMatch[1].trim(),
        dateStarted: dateStartedMatch ? dateStartedMatch[1] : '',
        link: linkMatch ? linkMatch[1] : '',
      }
    }

    // Parse currently reading book
    const itemRegex = /<item>[\s\S]*?<\/item>/g
    const currentlyReadingItems = currentlyReadingXml.match(itemRegex) || []
    const currentlyReading =
      currentlyReadingItems.length > 0
        ? parseCurrentlyReadingBook(currentlyReadingItems[0])
        : null

    // Parse read books
    const books: Book[] = []
    const readItems = readXml.match(itemRegex) || []

    for (let i = 0; i < Math.min(readItems.length, 30); i++) {
      const book = parseBook(readItems[i])
      if (book) {
        books.push(book)
      }
    }

    books.sort((a, b) => {
      if (!a.dateRead || !b.dateRead) return 0
      return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime()
    })

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
