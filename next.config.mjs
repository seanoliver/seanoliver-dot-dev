import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'poimandres',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    // The two post URLs that were public at the site root before the
    // /writing move. Permanent (308). The draft ai-function-calling was never
    // published, gets no redirect, and 404s naturally.
    return [
      {
        source: '/nextjs-contentlayer',
        destination: '/writing/nextjs-contentlayer',
        permanent: true,
      },
      {
        source: '/scroll-links',
        destination: '/writing/scroll-links',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
