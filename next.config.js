/** @type {import('next').NextConfig} */
// TODO: Remove placehold.co from remotePatterns once profile image is available
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      protocol: 'https',
      hostname: 'placehold.co'
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com'
    }]
  }
}

module.exports = nextConfig
