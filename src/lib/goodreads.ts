export interface Book {
  title: string
  author: string
  dateRead: string
  link: string
  rating: number
}

export interface CurrentlyReadingBook {
  title: string
  author: string
  dateStarted: string
  link: string
}

/**
 * Goodreads RSS is inconsistent about CDATA: fields with characters that
 * need escaping arrive as `<title><![CDATA[...]]></title>`, plain ones as
 * `<title>...</title>`. Both forms must parse or ~40% of shelf items get
 * silently dropped.
 */
const extractTag = (item: string, tag: string): string => {
  const match = item.match(
    new RegExp(
      `<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`
    )
  )
  if (!match) return ''
  if (match[1] !== undefined) return match[1]
  return decodeEntities(match[2] ?? '')
}

const decodeEntities = (text: string): string =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')

const cleanTitle = (title: string): string => {
  let cleaned = title.split(':')[0]
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/, '')
  return cleaned.trim()
}

const ITEM_REGEX = /<item>[\s\S]*?<\/item>/g
const MAX_READ_ITEMS = 30

export function parseReadShelf(...xmlPages: string[]): Book[] {
  const items = xmlPages.flatMap((xml) => xml.match(ITEM_REGEX) || [])
  const books: Book[] = []

  for (const item of items) {
    const title = extractTag(item, 'title')
    const author = extractTag(item, 'author_name')
    // A missing read date means the entry is shelf noise (bulk imports
    // land without dates or ratings), not a finished book — skip it.
    const dateRead = extractTag(item, 'user_read_at')
    if (!title || !author || !dateRead) continue

    const rating = parseInt(extractTag(item, 'user_rating'), 10)
    books.push({
      title: cleanTitle(title),
      author: author.trim(),
      dateRead,
      link: extractTag(item, 'link'),
      rating: Number.isNaN(rating) ? 0 : rating,
    })
  }

  books.sort(
    (a, b) => new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime()
  )

  // Cap after filtering and sorting so shelf noise doesn't eat into the
  // display budget.
  return books.slice(0, MAX_READ_ITEMS)
}

export function parseCurrentlyReadingShelf(
  xml: string
): CurrentlyReadingBook | null {
  const [firstItem] = xml.match(ITEM_REGEX) || []
  if (!firstItem) return null

  const title = extractTag(firstItem, 'title')
  const author = extractTag(firstItem, 'author_name')
  if (!title || !author) return null

  return {
    title: cleanTitle(title),
    author: author.trim(),
    dateStarted: extractTag(firstItem, 'user_date_added'),
    link: extractTag(firstItem, 'link'),
  }
}
