import { describe, expect, it } from 'vitest'

import type { TravelVideo } from '@/lib/types'
import {
  filterByRegion,
  findBySlug,
  playableVideos,
  regionsOf,
  stepFrom,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from './travel'

const video = (overrides: Partial<TravelVideo>): TravelVideo => ({
  slug: 'x',
  title: 'X',
  region: 'Oceania',
  year: 2019,
  youtubeId: 'abcdefghijk',
  stops: [],
  ...overrides,
})

const VIDEOS = [
  video({ slug: 'thai', region: 'Southeast Asia' }),
  video({ slug: 'anz', region: 'Oceania' }),
  video({ slug: 'cuba', region: 'Americas', youtubeId: null }),
  video({ slug: 'bali', region: 'Southeast Asia' }),
]

describe('regionsOf', () => {
  it('lists each region once, in first-seen order', () => {
    expect(regionsOf(VIDEOS)).toEqual(['Southeast Asia', 'Oceania', 'Americas'])
  })
})

describe('filterByRegion', () => {
  it('returns everything for All', () => {
    expect(filterByRegion(VIDEOS, 'All')).toHaveLength(4)
  })

  it('keeps only the chosen region', () => {
    expect(filterByRegion(VIDEOS, 'Southeast Asia').map((v) => v.slug)).toEqual(
      ['thai', 'bali']
    )
  })
})

describe('findBySlug', () => {
  it('accepts a hash with or without #', () => {
    expect(findBySlug(VIDEOS, '#anz')?.slug).toBe('anz')
    expect(findBySlug(VIDEOS, 'anz')?.slug).toBe('anz')
  })

  it('ignores an empty hash and videos without a YouTube id', () => {
    expect(findBySlug(VIDEOS, '')).toBeUndefined()
    expect(findBySlug(VIDEOS, '#cuba')).toBeUndefined()
  })
})

describe('stepFrom', () => {
  const playable = playableVideos(VIDEOS)

  it('moves forward and back', () => {
    expect(stepFrom(playable, 'anz', 1)?.slug).toBe('bali')
    expect(stepFrom(playable, 'anz', -1)?.slug).toBe('thai')
  })

  it('wraps at both ends', () => {
    expect(stepFrom(playable, 'bali', 1)?.slug).toBe('thai')
    expect(stepFrom(playable, 'thai', -1)?.slug).toBe('bali')
  })

  it('returns undefined for an unknown slug', () => {
    expect(stepFrom(playable, 'nope', 1)).toBeUndefined()
  })
})

describe('youtubeThumbnailUrl', () => {
  it('defaults to maxres and falls back to hq on request', () => {
    expect(youtubeThumbnailUrl('abc')).toBe(
      'https://i.ytimg.com/vi/abc/maxresdefault.jpg'
    )
    expect(youtubeThumbnailUrl('abc', { size: 'hq' })).toBe(
      'https://i.ytimg.com/vi/abc/hqdefault.jpg'
    )
  })
})

describe('YouTube player links', () => {
  it('embeds from the privacy-enhanced domain and autoplays', () => {
    expect(youtubeEmbedUrl('abc')).toBe(
      'https://www.youtube-nocookie.com/embed/abc?autoplay=1&rel=0&modestbranding=1'
    )
  })

  it('links out to the watch page', () => {
    expect(youtubeWatchUrl('abc')).toBe('https://www.youtube.com/watch?v=abc')
  })
})
