import createMDX from '@next/mdx'

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

// Plugins are specified as strings (with JSON-serializable options) so the
// MDX pipeline works under Turbopack, the default bundler for `next dev` and
// `next build` since Next.js 16. Plugin functions cannot be passed to
// Turbopack's Rust side. See:
// https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    rehypePlugins: [['rehype-pretty-code', { theme: 'poimandres' }]],
  },
})

export default withMDX(nextConfig)
