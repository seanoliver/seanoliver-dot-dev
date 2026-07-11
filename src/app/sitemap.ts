import { MetadataRoute } from 'next'

import { getSitemapEntries } from '@/content'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/posts',
    '/writing',
    '/experience',
    '/projects',
    '/about',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  // Published entries with canonical /writing URLs, straight from the
  // content API — the same URL builder that feeds metadata, RSS, and JSON-LD.
  return [...routes, ...(await getSitemapEntries())]
}
