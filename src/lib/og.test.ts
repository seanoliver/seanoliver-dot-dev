import { describe, expect, it } from 'vitest'

import { OG_DESCRIPTION_MAX, OG_TITLE_MAX, parseOgParams } from './og'

const parse = (query: string) => parseOgParams(new URLSearchParams(query))

describe('parseOgParams', () => {
  it('defaults the title and leaves description and path empty', () => {
    expect(parse('')).toEqual({
      title: 'Sean Oliver',
      description: null,
      path: '',
    })
  })

  it('keeps plain site paths', () => {
    expect(parse('path=/writing').path).toBe('/writing')
    expect(parse('path=/writing/nextjs-contentlayer').path).toBe(
      '/writing/nextjs-contentlayer'
    )
  })

  it.each([
    '.evil.com/login',
    '@evil.com',
    '/writing/../admin',
    '/writing?x=1',
    '//evil.com',
    '/',
    'writing',
    '/a b',
  ])('drops a path that is not a plain site path: %s', (path) => {
    expect(parse(`path=${encodeURIComponent(path)}`).path).toBe('')
  })

  it('shortens a long title and description', () => {
    const { title, description } = parse(
      `title=${'t'.repeat(500)}&description=${'d'.repeat(500)}`
    )
    expect(title).toHaveLength(OG_TITLE_MAX)
    expect(title.endsWith('…')).toBe(true)
    expect(description).toHaveLength(OG_DESCRIPTION_MAX)
  })

  it('treats a blank title as missing', () => {
    expect(parse('title=%20%20').title).toBe('Sean Oliver')
  })
})
