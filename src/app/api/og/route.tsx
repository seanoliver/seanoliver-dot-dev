import { ImageResponse } from 'next/og'

import { parseOgParams } from '@/lib/og'

const INK = '#0f172a'
const MUTED = '#64748b'

const ASSETS = [
  '/profile.jpeg',
  '/fonts/jetbrains-mono/JetBrainsMono-Regular.ttf',
  '/fonts/jetbrains-mono/JetBrainsMono-Medium.ttf',
  '/fonts/jetbrains-mono/JetBrainsMono-SemiBold.ttf',
]

function titleSize(title: string): number {
  if (title.length > 60) return 52
  if (title.length > 28) return 60
  return 84
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { title, description, path } = parseOgParams(searchParams)

  const [avatar, regular, medium, semibold] = await Promise.all(
    ASSETS.map(async (path) => {
      const res = await fetch(new URL(path, request.url))
      if (!res.ok) throw new Error(`OG asset ${path} returned ${res.status}`)
      return res.arrayBuffer()
    })
  )
  const avatarSrc = `data:image/jpeg;base64,${Buffer.from(avatar).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#ffffff',
          padding: '88px 96px 80px',
          borderTop: `14px solid ${INK}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: titleSize(title),
              fontWeight: 600,
              color: INK,
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 32,
                color: MUTED,
                marginTop: 28,
                lineHeight: 1.4,
                maxWidth: 900,
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
          <img
            alt=''
            src={avatarSrc}
            width={64}
            height={64}
            style={{ borderRadius: 64 }}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}
          >
            <span style={{ fontSize: 26, fontWeight: 500, color: INK }}>
              Sean Oliver
            </span>
            <span style={{ fontSize: 24, color: MUTED, marginTop: 4 }}>
              {`seanoliver.dev${path}`}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: medium, weight: 500, style: 'normal' },
        {
          name: 'JetBrains Mono',
          data: semibold,
          weight: 600,
          style: 'normal',
        },
      ],
    }
  )
}
