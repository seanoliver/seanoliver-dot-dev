import createMDX from '@next/mdx'
import { withContentlayer } from 'next-contentlayer'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
// Alias of remark-gfm@4 for the MDX v3 (unified 11) pipeline only.
// Contentlayer keeps compiling posts/ with remark-gfm@3 (unified 10) until it
// is removed; the two generations cannot share one plugin instance.
import remarkGfm from 'remark-gfm-mdx3'

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  // Mirrors contentlayer.config.ts so both pipelines highlight identically.
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
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
})

export default withContentlayer(withMDX(nextConfig))
