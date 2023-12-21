import { MetadataRoute } from 'next'
import { allPosts } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/posts', '/experience', '/projects', '/about'].map(
    (route) => ({
      url: `https://seanoliver.dev${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  )

  const posts =
    allPosts
      .filter((post) => post.isPublished)
      .map((post) => ({
        url: `https://seanoliver.dev/posts/${post.slug}`,
        lastModified: post.date,
      })) ?? []

  return [...routes, ...posts]
}
