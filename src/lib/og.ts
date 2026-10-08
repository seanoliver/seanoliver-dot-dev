export const OG_TITLE_MAX = 100
export const OG_DESCRIPTION_MAX = 200

// The path renders directly after "seanoliver.dev", so anything other than a
// plain site path could make the card display a different domain.
const SITE_PATH = /^(\/[a-z0-9-]+)+$/i

export type OgCardParams = {
  title: string
  description: string | null
  path: string
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

export function parseOgParams(searchParams: URLSearchParams): OgCardParams {
  const title = searchParams.get('title')?.trim()
  const description = searchParams.get('description')?.trim()
  const path = searchParams.get('path') ?? ''

  return {
    title: title ? truncate(title, OG_TITLE_MAX) : 'Sean Oliver',
    description: description ? truncate(description, OG_DESCRIPTION_MAX) : null,
    path: SITE_PATH.test(path) ? path : '',
  }
}
