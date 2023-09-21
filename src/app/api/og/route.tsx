import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'sean oliver [ dot ] dev'

  const response = await fetch('http://localhost:3000/profile.jpeg')
  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const imageSrc = `data:image/jpeg;base64,${base64}`

  const fontData = await fetch('http://localhost:3000/fonts/JetBrainsMono-Regular.ttf').then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#f5f6f7',
          color: '#1A202C',
          width: '100%',
          height: '100%',
          fontFamily: 'Typewriter',
          paddingLeft: '50px'
        }}
      >
        <h1 style={{ fontSize: '52px', fontWeight: '600' }}>
          {title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={imageSrc}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
          />
          <span
            style={{
              fontSize: '1.2em',
              fontWeight: '400',
            }}
          >
            seanoliver.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
