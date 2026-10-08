import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { parseOgParams } from './og'
import { ogImageUrl } from './site'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) && !entry.name.includes('.test.')
      ? [path]
      : []
  })
}

// Every literal `path` passed to ogImageUrl() anywhere in src/.
const callerPaths = sourceFiles(join(process.cwd(), 'src')).flatMap((file) =>
  Array.from(
    readFileSync(file, 'utf8').matchAll(/ogImageUrl\(\{[^}]*\}\)/g)
  ).flatMap(([call]) =>
    Array.from(call.matchAll(/path: '([^']*)'/g)).map(([, p]) => p)
  )
)

describe('ogImageUrl and parseOgParams', () => {
  it('finds the site callers', () => {
    expect(callerPaths.length).toBeGreaterThanOrEqual(5)
  })

  it.each(Array.from(new Set(callerPaths)))(
    'keeps the footer path %s that a caller passes',
    (path) => {
      const url = new URL(ogImageUrl({ title: 'Test', path }))
      expect(parseOgParams(url.searchParams).path).toBe(path)
    }
  )
})
