import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'sean oliver [ dot ] dev'

  const asset = (path: string) => new URL(path, request.url)

  const [avatarData, fontData] = await Promise.all([
    fetch(asset('/profile.jpeg')).then((res) => res.arrayBuffer()),
    fetch(asset('/fonts/jetbrains-mono/JetBrainsMono-Regular.ttf')).then(
      (res) => res.arrayBuffer()
    ),
  ])
  const imageSrc = `data:image/jpeg;base64,${Buffer.from(avatarData).toString('base64')}`
  const bgImage = asset('/patterns/shattered-island.png').toString()

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#2a2b33',
          color: '#1A202C',
          width: '100%',
          height: '100%',
          paddingLeft: '50px',
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'repeat',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            // backgroundColor: '#334155',
            color: '#F5F6F7',
            // borderRadius: '30px',
            // padding: '10px 20px',
            // boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '20px',
            color: '#F5F6F7',
            // backgroundColor: '#94A3B8',
            // borderRadius: '15px',
            // padding: '10px 20px',
            // boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
          <img
            alt=''
            src={imageSrc}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '20px',
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
