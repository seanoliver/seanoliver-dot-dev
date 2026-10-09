import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getChangelog,
  mergeChangelogs,
  parseFeatCommits,
  repoFromGitHubUrl,
} from './changelog'

const REPO = 'seanoliver/sudoku'

const commit = (
  message: string,
  date = '2026-09-28T06:00:30Z',
  sha = 'abc'
) => ({
  sha,
  html_url: `https://github.com/${REPO}/commit/${sha}`,
  commit: { message, committer: { date } },
})

describe('parseFeatCommits', () => {
  it('keeps feat commits and drops every other type', () => {
    const entries = parseFeatCommits(
      [
        commit('fix(home): count earlier Expert solves (#46)'),
        commit('feat(nav): back button returns to Home (#45)'),
        commit('docs: bring README up to date (#49)'),
      ],
      { repo: REPO }
    )
    expect(entries.map((e) => e.text)).toEqual(['back button returns to Home'])
  })

  it('accepts unscoped and breaking-change feat prefixes', () => {
    const entries = parseFeatCommits(
      [commit('feat: unscoped change'), commit('feat(api)!: breaking change')],
      { repo: REPO }
    )
    expect(entries.map((e) => e.text)).toEqual([
      'unscoped change',
      'breaking change',
    ])
  })

  it('links to the PR when the subject ends with (#NN)', () => {
    const [entry] = parseFeatCommits(
      [commit('feat(home): install card on Home (#44)')],
      { repo: REPO }
    )
    expect(entry).toEqual({
      date: '2026-09-28T06:00:30Z',
      text: 'install card on Home',
      url: `https://github.com/${REPO}/pull/44`,
    })
  })

  it('links to the commit when there is no PR number', () => {
    const [entry] = parseFeatCommits(
      [commit('feat: direct push', undefined, 'def')],
      {
        repo: REPO,
      }
    )
    expect(entry.url).toBe(`https://github.com/${REPO}/commit/def`)
  })

  it('uses only the first line of the message', () => {
    const [entry] = parseFeatCommits(
      [commit('feat(learn): Learn page (#40)\n\nfeat: not a subject')],
      { repo: REPO }
    )
    expect(entry.text).toBe('Learn page')
  })

  it('returns at most `limit` entries, newest first as given', () => {
    const commits = ['a', 'b', 'c', 'd'].map((t) => commit(`feat: ${t}`))
    expect(
      parseFeatCommits(commits, { repo: REPO }).map((e) => e.text)
    ).toEqual(['a', 'b', 'c'])
    expect(
      parseFeatCommits(commits, { repo: REPO, limit: 1 }).map((e) => e.text)
    ).toEqual(['a'])
  })

  it('skips subjects that are only a PR number', () => {
    const entries = parseFeatCommits(
      [commit('feat: (#5)'), commit('feat: real change (#6)')],
      { repo: REPO }
    )
    expect(entries.map((e) => e.text)).toEqual(['real change'])
  })

  it('returns [] for non-array or malformed input', () => {
    expect(
      parseFeatCommits({ message: 'rate limited' }, { repo: REPO })
    ).toEqual([])
    expect(
      parseFeatCommits([null, { commit: {} }, 42], { repo: REPO })
    ).toEqual([])
  })
})

describe('repoFromGitHubUrl', () => {
  it('extracts owner/name', () => {
    expect(repoFromGitHubUrl('https://github.com/seanoliver/sudoku')).toBe(REPO)
    expect(repoFromGitHubUrl('https://github.com/seanoliver/sudoku/')).toBe(
      REPO
    )
  })

  it('returns null for non-repo URLs', () => {
    expect(repoFromGitHubUrl('https://sudoku.seanoliver.dev')).toBeNull()
    expect(repoFromGitHubUrl('https://github.com/seanoliver')).toBeNull()
  })
})

describe('getChangelog', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed entries on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify([commit('feat: shipped (#1)')]))
        )
    )
    const entries = await getChangelog(REPO)
    expect(entries.map((e) => e.text)).toEqual(['shipped'])
  })

  it('passes limit through, so one repo can fill the merged list', async () => {
    const commits = ['a', 'b', 'c', 'd', 'e'].map((t) => commit(`feat: ${t}`))
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(commits)))
    )
    expect(await getChangelog(REPO, { limit: 5 })).toHaveLength(5)
  })

  it('returns [] on a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 403 }))
    )
    expect(await getChangelog(REPO)).toEqual([])
  })

  it('returns [] when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await getChangelog(REPO)).toEqual([])
  })
})

describe('mergeChangelogs', () => {
  const entry = (date: string, text: string) => ({
    date,
    text,
    url: `https://github.com/${REPO}/pull/${text}`,
  })

  it('tags each entry with its project and sorts newest first', () => {
    expect(
      mergeChangelogs(
        [
          { project: 'Sudoku', entries: [entry('2026-10-01T00:00:00Z', 'a')] },
          {
            project: 'Solstice',
            entries: [entry('2026-10-03T00:00:00Z', 'b')],
          },
        ],
        5
      ).map((e) => [e.project, e.text])
    ).toEqual([
      ['Solstice', 'b'],
      ['Sudoku', 'a'],
    ])
  })

  it('keeps at most `limit` entries across all projects', () => {
    const merged = mergeChangelogs(
      [
        {
          project: 'Sudoku',
          entries: [
            entry('2026-10-05T00:00:00Z', 'a'),
            entry('2026-10-01T00:00:00Z', 'b'),
          ],
        },
        {
          project: 'Bay Ballot',
          entries: [
            entry('2026-10-04T00:00:00Z', 'c'),
            entry('2026-10-02T00:00:00Z', 'd'),
          ],
        },
      ],
      3
    )
    expect(merged.map((e) => e.text)).toEqual(['a', 'c', 'd'])
  })

  it('returns [] when no project has entries', () => {
    expect(mergeChangelogs([{ project: 'Sudoku', entries: [] }], 5)).toEqual([])
  })
})
