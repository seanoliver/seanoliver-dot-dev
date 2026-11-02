import type { TravelRegion, TravelVideo } from '@/lib/types'

export type RegionFilter = TravelRegion | 'All'

export function regionsOf(videos: TravelVideo[]): TravelRegion[] {
  return Array.from(new Set(videos.map((video) => video.region)))
}

export function filterByRegion(
  videos: TravelVideo[],
  region: RegionFilter
): TravelVideo[] {
  return region === 'All'
    ? videos
    : videos.filter((video) => video.region === region)
}

export function playableVideos(videos: TravelVideo[]): TravelVideo[] {
  return videos.filter((video) => video.youtubeId != null)
}

export function findBySlug(
  videos: TravelVideo[],
  hash: string
): TravelVideo | undefined {
  const slug = hash.replace(/^#/, '')
  if (!slug) return undefined
  return playableVideos(videos).find((video) => video.slug === slug)
}

export function stepFrom(
  videos: TravelVideo[],
  slug: string,
  offset: number
): TravelVideo | undefined {
  const index = videos.findIndex((video) => video.slug === slug)
  if (index === -1 || videos.length === 0) return undefined
  const next =
    (((index + offset) % videos.length) + videos.length) % videos.length
  return videos[next]
}

export type ThumbnailSize = 'maxres' | 'hq'

/** maxres is 1280x720 but YouTube skips it for some uploads; hq always exists. */
export function youtubeThumbnailUrl(
  youtubeId: string,
  { size = 'maxres' }: { size?: ThumbnailSize } = {}
): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${size}default.jpg`
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}
