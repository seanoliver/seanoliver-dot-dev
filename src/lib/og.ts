export const OG_TITLE_MAX = 100
export const OG_DESCRIPTION_MAX = 200
export const OG_PATH_MAX = 100

// The path renders directly after "seanoliver.dev", so anything other than a
// plain site path could make the card display a different domain.
const SITE_PATH = /^(\/[a-z0-9-]+)+$/i

export type OgCardParams = {
  title: string
  description: string | null
  path: string
}

// Counts code points, so a cut never splits an emoji or other surrogate pair.
function truncate(text: string, max: number): string {
  const chars = Array.from(text)
  if (chars.length <= max) return text
  return `${chars
    .slice(0, max - 1)
    .join('')
    .trimEnd()}…`
}

export function parseOgParams(searchParams: URLSearchParams): OgCardParams {
  const title = searchParams.get('title')?.trim()
  const description = searchParams.get('description')?.trim()
  const path = searchParams.get('path') ?? ''

  return {
    title: title ? truncate(title, OG_TITLE_MAX) : 'Sean Oliver',
    description: description ? truncate(description, OG_DESCRIPTION_MAX) : null,
    path: path.length <= OG_PATH_MAX && SITE_PATH.test(path) ? path : '',
  }
}
