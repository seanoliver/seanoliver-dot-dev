/**
 * JSON-LD Structured Data Components
 * Provides rich semantic information for search engines
 */

export interface PersonSchema {
  name: string
  jobTitle: string
  url: string
  sameAs: string[]
  image?: string
  description?: string
}

export function PersonJsonLd({ person }: { person: PersonSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    sameAs: person.sameAs,
    ...(person.image && { image: person.image }),
    ...(person.description && { description: person.description }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export interface BlogPostingSchema {
  headline: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url: string
  }
  image?: string
  description?: string
  url: string
}

export function BlogPostingJsonLd({ post }: { post: BlogPostingSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.headline,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    ...(post.image && { image: post.image }),
    ...(post.description && { description: post.description }),
    url: post.url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export interface WebsiteSchema {
  name: string
  url: string
  description: string
  author: {
    name: string
    url: string
  }
}

export function WebsiteJsonLd({ website }: { website: WebsiteSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: website.name,
    url: website.url,
    description: website.description,
    author: {
      '@type': 'Person',
      name: website.author.name,
      url: website.author.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
