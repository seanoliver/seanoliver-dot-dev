'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type JSX } from 'react'

import Section from '@/components/Section'
import { TRAVEL_VIDEOS } from '@/lib/constants'
import {
  filterByRegion,
  findBySlug,
  playableVideos,
  regionsOf,
  stepFrom,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
  type RegionFilter,
  type ThumbnailSize,
} from '@/lib/travel'
import type { TravelVideo } from '@/lib/types'
import { cn } from '@/lib/utils'

const SWIPE_THRESHOLD_PX = 50

export default function TravelGallery({
  videos = TRAVEL_VIDEOS,
}: {
  videos?: TravelVideo[]
} = {}): JSX.Element {
  const [region, setRegion] = useState<RegionFilter>('All')
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  const visible = filterByRegion(videos, region)
  const playable = playableVideos(visible)
  const open = openSlug ? playable.find((v) => v.slug === openSlug) : undefined
  const regions = regionsOf(videos)

  useEffect(() => {
    const syncFromHash = (): void => {
      setOpenSlug(findBySlug(videos, window.location.hash)?.slug ?? null)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [videos])

  const openVideo = useCallback((slug: string | null) => {
    setOpenSlug(slug)
    const url = slug
      ? `#${slug}`
      : window.location.pathname + window.location.search
    window.history.replaceState(null, '', url)
  }, [])

  return (
    <Section title='Travel' fullWidth>
      <p className='text-muted-foreground mb-6 max-w-xl'>
        Videos from trips, edited from old footage. Newest first.
      </p>

      {regions.length > 1 && (
        <div
          role='group'
          aria-label='Filter by region'
          className='flex flex-wrap gap-2 mb-6'
        >
          {(['All', ...regions] as RegionFilter[]).map((option) => {
            const isActive = region === option
            const count = filterByRegion(videos, option).length
            return (
              <button
                key={option}
                type='button'
                aria-pressed={isActive}
                onClick={() => setRegion(option)}
                className={cn(
                  'rounded-full border px-3 py-0.5 text-xs transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option === 'All' ? `All · ${count}` : option}
              </button>
            )
          })}
        </div>
      )}

      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6'>
        {visible.map((video) => (
          <li key={video.slug}>
            <VideoCard video={video} onOpen={() => openVideo(video.slug)} />
          </li>
        ))}
        {visible.length % 2 === 1 && (
          <li aria-hidden className='hidden sm:block'>
            <ComingSoonTile />
          </li>
        )}
      </ul>

      <Lightbox
        video={open}
        position={open ? playable.indexOf(open) + 1 : 0}
        total={playable.length}
        previous={open ? stepFrom(playable, open.slug, -1) : undefined}
        next={open ? stepFrom(playable, open.slug, 1) : undefined}
        onNavigate={openVideo}
      />
    </Section>
  )
}

function meta(video: TravelVideo): string {
  return [video.region, video.year].filter((part) => part != null).join(' · ')
}

function VideoCard({
  video,
  onOpen,
}: {
  video: TravelVideo
  onOpen: () => void
}): JSX.Element {
  const { youtubeId } = video
  const [thumbnailSize, setThumbnailSize] = useState<ThumbnailSize>('maxres')

  const caption = (
    <span className='flex flex-col gap-0.5 mt-2 text-left'>
      <span className='font-medium'>{video.title}</span>
      <span className='text-muted-foreground text-xs'>{meta(video)}</span>
    </span>
  )

  if (youtubeId == null) {
    return (
      <div>
        <div className='relative aspect-video rounded-md border border-dashed bg-[repeating-linear-gradient(135deg,hsl(var(--muted))_0_8px,transparent_8px_16px)]'>
          <span className='absolute left-3 bottom-2 text-xs text-muted-foreground'>
            Video link coming
          </span>
        </div>
        {caption}
      </div>
    )
  }

  return (
    <button
      type='button'
      onClick={onOpen}
      aria-label={`Play ${video.title}`}
      className='group block w-full rounded-md'
    >
      <span className='relative block aspect-video overflow-hidden rounded-md bg-muted'>
        <Image
          src={youtubeThumbnailUrl(youtubeId, { size: thumbnailSize })}
          onError={() => setThumbnailSize('hq')}
          alt=''
          fill
          sizes='(min-width: 640px) 425px, 100vw'
          className='object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]'
        />
        <span className='absolute inset-0 m-auto grid h-9 w-12 place-items-center rounded-lg bg-background/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
          <span className='ml-1 border-y-[7px] border-l-[12px] border-y-transparent border-l-foreground' />
        </span>
      </span>
      {caption}
    </button>
  )
}

function ComingSoonTile(): JSX.Element {
  return (
    <div>
      <div className='relative aspect-video rounded-md border border-dashed bg-[repeating-linear-gradient(135deg,hsl(var(--muted))_0_8px,transparent_8px_16px)]'>
        <span className='absolute left-3 bottom-2 text-xs text-muted-foreground'>
          In the edit
        </span>
      </div>
      <span className='flex flex-col gap-0.5 mt-2'>
        <span className='font-medium text-muted-foreground'>
          More from the archive
        </span>
        <span className='text-muted-foreground text-xs'>
          Coming over the next few months
        </span>
      </span>
    </div>
  )
}

function Lightbox({
  video,
  position,
  total,
  previous,
  next,
  onNavigate,
}: {
  video: TravelVideo | undefined
  position: number
  total: number
  previous: TravelVideo | undefined
  next: TravelVideo | undefined
  onNavigate: (slug: string | null) => void
}): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStartX = useRef<number | null>(null)
  const isOpen = video != null

  // showModal(), not the `open` attribute: only showModal() traps focus.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()

    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  const showMultiple = total > 1

  return (
    <dialog
      ref={dialogRef}
      aria-label={video ? `${video.title} video` : 'Video player'}
      // Without preventDefault, Esc closes natively and leaves the #slug hash.
      onCancel={(event) => {
        event.preventDefault()
        onNavigate(null)
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onNavigate(null)
      }}
      onKeyDown={(event) => {
        if (!showMultiple) return
        if (event.key === 'ArrowLeft' && previous) onNavigate(previous.slug)
        if (event.key === 'ArrowRight' && next) onNavigate(next.slug)
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current
        const end = event.changedTouches[0]?.clientX
        touchStartX.current = null
        if (start == null || end == null || !showMultiple) return
        const delta = end - start
        if (delta > SWIPE_THRESHOLD_PX && previous) onNavigate(previous.slug)
        if (delta < -SWIPE_THRESHOLD_PX && next) onNavigate(next.slug)
      }}
      className='m-auto w-full max-w-4xl bg-transparent p-4 text-white backdrop:bg-black/85 open:flex open:flex-col'
    >
      {video?.youtubeId != null && (
        <div className='flex flex-col gap-3'>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => onNavigate(null)}
              aria-label='Close video'
              className='px-2 text-lg text-white/80 hover:text-white'
            >
              ✕
            </button>
          </div>
          <div className='relative aspect-video w-full overflow-hidden rounded-md bg-black'>
            <iframe
              key={video.slug}
              src={youtubeEmbedUrl(video.youtubeId)}
              title={video.title}
              allow='autoplay; encrypted-media; picture-in-picture; fullscreen'
              className='absolute inset-0 h-full w-full'
            />
          </div>
          <div className='flex flex-wrap items-baseline justify-between gap-2 text-sm'>
            <span className='font-medium'>{video.title}</span>
            {showMultiple && (
              <span className='text-xs text-white/60'>
                {position} / {total}
              </span>
            )}
          </div>
          {video.stops.length > 0 && (
            <p className='text-xs text-white/70'>{video.stops.join(' → ')}</p>
          )}
          <div className='flex flex-wrap items-center justify-between gap-3 text-xs text-white/75'>
            {showMultiple && previous && previous.slug !== next?.slug ? (
              <button
                type='button'
                onClick={() => onNavigate(previous.slug)}
                className='hover:text-white'
              >
                ← {previous.title}
              </button>
            ) : (
              <span />
            )}
            <a
              href={youtubeWatchUrl(video.youtubeId)}
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-4 hover:no-underline'
            >
              Watch on YouTube ↗
            </a>
            {showMultiple && next ? (
              <button
                type='button'
                onClick={() => onNavigate(next.slug)}
                className='hover:text-white'
              >
                {next.title} →
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
