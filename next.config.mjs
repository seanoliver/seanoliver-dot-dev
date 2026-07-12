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
        // /writing is the single canonical index; the old /posts duplicate
        // stream redirects permanently rather than serving a second copy.
        source: '/posts',
        destination: '/writing',
        permanent: true,
      },
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

// Typed via JSDoc so editors surface the option shape even though the plugin
// itself is referenced by string (types resolve without a runtime import).
// Note: `pnpm typecheck` does NOT cover this file (tsconfig include is
// *.ts/*.tsx only, checkJs off) — the e2e theme assertion in
// tests/e2e/publishing.spec.ts is the real guard against option typos.
/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: 'poimandres',
}

// Plugins are specified as strings (with JSON-serializable options) so the
// MDX pipeline works under Turbopack, the default bundler for `next dev` and
// `next build` since Next.js 16. Plugin functions cannot be passed to
// Turbopack's Rust side. See:
// https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    rehypePlugins: [['rehype-pretty-code', rehypePrettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
