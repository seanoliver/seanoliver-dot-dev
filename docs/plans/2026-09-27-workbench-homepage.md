# Workbench Homepage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan
> task-by-task.

**Goal:** Rebuild the homepage around a featured "Now building" project card
(Sudoku) with an automatic changelog from GitHub, per
`docs/plans/2026-09-27-workbench-homepage-design.md`.

**Architecture:** Pure commit-parsing functions live in `src/lib/changelog.ts`
with Vitest coverage, following the `src/lib/goodreads.ts` pattern. A server
component fetches the GitHub commits API with `next: { revalidate: 86400 }` and
renders the featured card. The homepage drops the Writing and Social sections.
Writing moves to the footer.

**Tech Stack:** Next.js 16.2 App Router (no Cache Components), React 19,
TypeScript, Tailwind 3, Vitest, Playwright.

**Branch:** `feat/workbench-homepage` (already created from `origin/main`,
design doc committed as `8820f5c`).

**Verified facts this plan relies on:**

- GitHub `GET /repos/{owner}/{repo}/commits` returns newest first, and each item
  has `html_url`, `commit.message`, and `commit.committer.date` (checked with
  `gh api` on 2026-09-27).
- `seanoliver/sudoku` is public and uses squash-merged conventional commits,
  e.g. `feat(home): install card on Home (#44)`.
- `fetch(url, { next: { revalidate: N } })` is supported in this project's Next
  version
  (`node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`).
- `tests/e2e/publishing.spec.ts` currently asserts that `/` lists both published
  posts. Task 6 changes that assertion because the homepage no longer lists
  posts.

---

### Task 1: Project status and the Sudoku entry

**Files:**

- Modify: `src/lib/types.tsx:3-11`
- Modify: `src/lib/constants.tsx` (`PROJECTS`)
- Create: `public/projects/sudoku.png`

**Step 1: Extend the `Project` type**

In `src/lib/types.tsx`, replace the `Project` type with:

```ts
export type ProjectStatus = 'live' | 'building' | 'parked' | 'contributor'

export type Project = {
  name: string
  url: string
  description: string
  summary: string
  image: string
  tags: string[]
  github: string
  status: ProjectStatus
  featured?: boolean
}
```

**Step 2: Run typecheck to see every project that now needs a status**

Run: `pnpm typecheck` Expected: FAIL, one error per `PROJECTS` entry: "Property
'status' is missing".

**Step 3: Add statuses and the Sudoku entry**

In `src/lib/constants.tsx`, add `status` to each existing entry:

| Project        | status          |
| -------------- | --------------- |
| TheraGPT       | `'live'`        |
| Audioflare     | `'parked'`      |
| Smol Menubar   | `'contributor'` |
| SeanOliver.dev | `'live'`        |
| TheraGPT (v1)  | `'parked'`      |

Insert this entry first in `PROJECTS`:

```ts
  {
    name: 'Sudoku',
    url: 'https://sudoku.seanoliver.dev',
    github: 'https://github.com/seanoliver/sudoku',
    description:
      'A calm, free Sudoku that teaches every technique one move at a time. Hints explain themselves step by step, and it installs to your home screen and works offline. No account, ads, or analytics.',
    summary: 'Calm Sudoku that teaches every technique',
    image: '/projects/sudoku.png',
    tags: ['Next.js', 'React', 'TypeScript', 'PWA'],
    status: 'live',
    featured: true,
  },
```

Copy and tags come from the sudoku repo's README and `package.json` (checked
2026-09-27).

**Step 4: Add the project image**

Download the sudoku repo's Open Graph image to `public/projects/sudoku.png`:

```bash
curl -sL https://raw.githubusercontent.com/seanoliver/sudoku/main/src/app/opengraph-image.png -o public/projects/sudoku.png
file public/projects/sudoku.png
```

Expected: `PNG image data`. The field is required by the type. The featured card
does not render it.

**Step 5: Verify**

Run: `pnpm typecheck` Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/types.tsx src/lib/constants.tsx public/projects/sudoku.png
git commit -m "feat(projects): add project status and Sudoku as featured project"
```

---

### Task 2: Changelog parsing (TDD)

**Files:**

- Create: `src/lib/changelog.ts`
- Test: `src/lib/changelog.test.ts`

**Step 1: Write the failing tests**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getChangelog, parseFeatCommits, repoFromGitHubUrl } from './changelog'

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
```

**Step 2: Run the tests to verify they fail**

Run: `pnpm vitest run src/lib/changelog.test.ts` Expected: FAIL, "Failed to
resolve import './changelog'".

**Step 3: Implement**

```ts
import 'server-only'

export interface ChangelogEntry {
  date: string
  text: string
  url: string
}

interface GitHubCommit {
  html_url: string
  commit: { message: string; committer: { date: string } }
}

// Conventional-commit feature subject: `feat:`, `feat(scope):`, `feat(scope)!:`.
const FEAT_SUBJECT = /^feat(?:\([^)]*\))?!?:\s*(.+)$/
// Squash merges append the PR number: `... (#44)`.
const PR_SUFFIX = /\s*\(#(\d+)\)$/

function isGitHubCommit(value: unknown): value is GitHubCommit {
  if (typeof value !== 'object' || value === null) return false
  const { html_url, commit } = value as Partial<GitHubCommit>
  return (
    typeof html_url === 'string' &&
    typeof commit?.message === 'string' &&
    typeof commit?.committer?.date === 'string'
  )
}

/**
 * Turns a GitHub commits API response into changelog entries. Keeps only
 * `feat` commits so fixes, docs, and chores stay out of the public changelog.
 */
export function parseFeatCommits(
  input: unknown,
  { repo, limit = 3 }: { repo: string; limit?: number }
): ChangelogEntry[] {
  if (!Array.isArray(input)) return []

  const entries: ChangelogEntry[] = []
  for (const item of input) {
    if (!isGitHubCommit(item)) continue

    const subject = item.commit.message.split('\n')[0].trim()
    const match = FEAT_SUBJECT.exec(subject)
    if (!match) continue

    const pr = PR_SUFFIX.exec(match[1])
    entries.push({
      date: item.commit.committer.date,
      text: match[1].replace(PR_SUFFIX, ''),
      url: pr ? `https://github.com/${repo}/pull/${pr[1]}` : item.html_url,
    })
    if (entries.length === limit) break
  }
  return entries
}

export function repoFromGitHubUrl(url: string): string | null {
  const match = /^https:\/\/github\.com\/([^/]+\/[^/]+?)\/?$/.exec(url)
  return match?.[1] ?? null
}

/**
 * Latest feature commits for a public repo. Revalidates daily, which keeps
 * unauthenticated GitHub API usage far under its 60 requests/hour limit.
 * Returns [] on any failure so the caller can hide the changelog.
 */
export async function getChangelog(repo: string): Promise<ChangelogEntry[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=50`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 86400 },
      }
    )
    if (!response.ok) return []
    return parseFeatCommits(await response.json(), { repo })
  } catch {
    return []
  }
}
```

**Step 4: Run the tests to verify they pass**

Run: `pnpm vitest run src/lib/changelog.test.ts` Expected: PASS, all tests.

**Step 5: Commit**

```bash
git add src/lib/changelog.ts src/lib/changelog.test.ts
git commit -m "feat(projects): parse feature commits from GitHub into a changelog"
```

---

### Task 3: Sudoku board and featured project card

**Files:**

- Create: `src/components/sudoku-board.tsx`
- Create: `src/components/featured-project.tsx`

**Step 1: Static board**

`src/components/sudoku-board.tsx`. Server component, decorative only.

```tsx
import { cn } from '@/lib/utils'

import type { JSX } from 'react'

// A standard starting grid; `.` is an empty cell.
const PUZZLE =
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
const SELECTED = 40

export default function SudokuBoard({
  className,
}: {
  className?: string
}): JSX.Element {
  const selectedRow = Math.floor(SELECTED / 9)
  const selectedCol = SELECTED % 9

  return (
    <div
      aria-hidden
      className={cn(
        'grid grid-cols-9 aspect-square overflow-hidden rounded-md border-2 border-foreground bg-background font-sans',
        className
      )}
    >
      {[...PUZZLE].map((cell, i) => {
        const row = Math.floor(i / 9)
        const col = i % 9
        return (
          <span
            key={i}
            className={cn(
              'flex items-center justify-center text-[11px] border-border',
              col < 8 &&
                (col % 3 === 2 ? 'border-r-2 border-r-foreground' : 'border-r'),
              row < 8 &&
                (row % 3 === 2 ? 'border-b-2 border-b-foreground' : 'border-b'),
              i === SELECTED
                ? 'bg-blue-100 dark:bg-blue-950'
                : (row === selectedRow || col === selectedCol) && 'bg-muted'
            )}
          >
            {cell === '.' ? '' : cell}
          </span>
        )
      })}
    </div>
  )
}
```

**Step 2: Status label**

Add to `src/components/featured-project.tsx` (exported, reused in Task 4):

```tsx
import type { ProjectStatus } from '@/lib/types'

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  live: {
    label: '● Live',
    className:
      'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  },
  building: {
    label: 'Building',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  parked: { label: 'Parked', className: 'bg-muted text-muted-foreground' },
  contributor: {
    label: 'Contributor',
    className:
      'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  },
}

export function StatusLabel({
  status,
}: {
  status: ProjectStatus
}): JSX.Element {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[11px] font-medium',
        className
      )}
    >
      {label}
    </span>
  )
}
```

**Step 3: Featured card**

Same file. Async server component.

```tsx
import Link from 'next/link'
import Section from '@/components/Section'
import SudokuBoard from '@/components/sudoku-board'
import { getChangelog, repoFromGitHubUrl } from '@/lib/changelog'
import { formatDateSpaced } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/lib/types'

import type { JSX } from 'react'

export default async function FeaturedProject({
  project,
}: {
  project: Project
}): Promise<JSX.Element> {
  const repo = repoFromGitHubUrl(project.github)
  const changelog = repo ? await getChangelog(repo) : []
  const domain = new URL(project.url).host

  return (
    <Section title='Now building'>
      <article className='grid overflow-hidden rounded-xl border sm:grid-cols-[1fr_220px]'>
        <div className='flex flex-col gap-4 p-6'>
          <div className='flex items-center gap-3'>
            <StatusLabel status={project.status} />
            <span className='text-muted-foreground text-xs'>{domain}</span>
          </div>
          <h2 className='text-xl font-semibold'>{project.name}</h2>
          <p className='leading-7'>{project.description}</p>
          <div className='flex gap-3'>
            <Link
              href={project.url}
              target='_blank'
              className='rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground hover:opacity-90'
            >
              Play {project.name} →
            </Link>
            <Link
              href={project.github}
              target='_blank'
              className='rounded-md border px-3 py-2 text-xs hover:bg-muted'
            >
              Source
            </Link>
          </div>
          {changelog.length > 0 && (
            <ul
              className='border-t border-dashed pt-4 text-xs'
              aria-label='Recent changes'
            >
              {changelog.map((entry) => (
                <li key={entry.url} className='flex gap-4 leading-6'>
                  <span className='text-muted-foreground shrink-0'>
                    {formatDateSpaced(entry.date)}
                  </span>
                  <a
                    href={entry.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline underline-offset-4'
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='hidden items-center justify-center border-l bg-muted/50 p-6 sm:flex'>
          <SudokuBoard className='w-44 -rotate-3 shadow-lg' />
        </div>
      </article>
    </Section>
  )
}
```

"Play {name}" is Sudoku-specific wording and `SudokuBoard` is Sudoku-specific
art. That is intended: there is one featured project. Generalize when a second
project is featured, not before.

**Step 4: Verify**

Run: `pnpm typecheck && pnpm lint` Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/sudoku-board.tsx src/components/featured-project.tsx
git commit -m "feat(home): featured project card with GitHub changelog"
```

---

### Task 4: Status labels in the projects list

**Files:**

- Modify: `src/components/projects-content.tsx`

**Step 1: Add `excludeFeatured` and the status label**

Change the props to an object with defaults and filter before slicing:

```tsx
export default function ProjectsContent({
  limit,
  href,
  excludeFeatured = false,
}: {
  limit?: number
  href?: string
  excludeFeatured?: boolean
} = {}): JSX.Element {
  const projects = excludeFeatured
    ? PROJECTS.filter((project) => !project.featured)
    : PROJECTS
  const displayProjects = limit ? projects.slice(0, limit) : projects
  const hasMore = limit != null && projects.length > limit
```

Set `middle` to the summary and `right` to the status label plus the existing
GitHub icon:

```tsx
    right: (
      <span className='flex items-center gap-3'>
        <StatusLabel status={project.status} />
        <a ...existing GitHub icon link... />
      </span>
    ),
```

Import `StatusLabel` from `@/components/featured-project`.

**Step 2: Verify**

Run: `pnpm typecheck` Expected: PASS. `/projects` calls `<ProjectsContent />`
with no props and still type-checks because of the `= {}` default.

**Step 3: Commit**

```bash
git add src/components/projects-content.tsx
git commit -m "feat(projects): show project status in the projects list"
```

---

### Task 5: Homepage, nav, header, footer

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/lib/constants.tsx` (`NAV_ITEMS`)
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Step 1: Homepage**

Replace `src/app/page.tsx`:

```tsx
import CurrentlyReading from '@/components/currently-reading'
import ExperienceContent from '@/components/experience-content'
import FeaturedProject from '@/components/featured-project'
import Goodreads from '@/components/goodreads'
import ProjectsContent from '@/components/projects-content'
import Section from '@/components/Section'
import { PROJECTS } from '@/lib/constants'

import type { JSX } from 'react'

export default function Home(): JSX.Element {
  const featured = PROJECTS.find((project) => project.featured)

  return (
    <>
      <Section title='Home'>
        <h1 className='font-medium'>Sean Oliver</h1>
        <p className='text-muted-foreground'>
          Growth engineer at Supabase. After hours I build small apps.
        </p>
      </Section>
      {featured && <FeaturedProject project={featured} />}
      <ProjectsContent limit={4} href='/projects' excludeFeatured />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
```

This removes the `About`, `Socials`, and `WritingIndex` sections and the
`getVisibleEntries` call from the homepage. The `/about` page is unchanged.

**Step 2: Nav**

In `NAV_ITEMS`, keep only Projects, About, and Read, in that order. Remove
Writing, Experience, and Newsletter.

**Step 3: Header identity block**

`Header.tsx` shows the "Sean Oliver / Software Engineer" block on every nav path
and `/`. The homepage now renders its own intro, and removing nav items would
hide the block on `/writing` and `/experience`. Replace the `navPaths` logic
with an explicit list:

```tsx
// Pages that show the name block under the nav. The homepage renders its own
// intro; individual posts have their own header.
const IDENTITY_PATHS = [
  '/writing',
  '/about',
  '/projects',
  '/experience',
  '/read',
]
```

```tsx
const path = usePathname()
const showIdentity = IDENTITY_PATHS.includes(path)
```

Remove the `NAV_ITEMS` import from `Header.tsx`.

**Step 4: Footer links**

In `Footer.tsx`, add links before the RSS link, using the same classes:

- `Writing` → `/writing` (Next `Link`)
- `Newsletter ↗` → `NEWSLETTER_URL` from `@/lib/site`
- `GitHub ↗` → `https://github.com/SeanOliver`
- `X ↗` → `https://x.com/SeanOliver`

External links get `target='_blank' rel='noopener noreferrer'`. Read the GitHub
and X URLs from `SOCIAL_LINKS` by name, not new literals.

**Step 5: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit` Expected: PASS.

**Step 6: Commit**

```bash
git add src/app/page.tsx src/lib/constants.tsx src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat(home): lead with the featured project and move writing to the footer"
```

---

### Task 6: E2E contracts

**Files:**

- Modify: `tests/e2e/publishing.spec.ts`
- Create: `tests/e2e/home.spec.ts`

**Step 1: Stop requiring posts on the homepage**

In `publishing.spec.ts`, change `for (const path of ['/', '/writing'])` to
`for (const path of ['/writing'])`. Posts are still reachable: `/writing` lists
them and the footer links to `/writing`.

**Step 2: Homepage contract**

`tests/e2e/home.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('homepage leads with the featured Sudoku card', async ({ page }) => {
  await page.goto('/')

  const card = page.locator('article').filter({ hasText: 'Sudoku' })
  await expect(card).toBeVisible()
  await expect(
    card.getByRole('link', { name: 'Play Sudoku →' })
  ).toHaveAttribute('href', 'https://sudoku.seanoliver.dev')
})

test('footer links to the writing index', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Writing' }).last().click()
  await expect(page).toHaveURL(/\/writing$/)
})
```

Do not assert changelog content. It depends on GitHub at build time.

**Step 3: Run**

Run: `pnpm build && pnpm test:e2e` Expected: PASS, all specs.

**Step 4: Commit**

```bash
git add tests/e2e/publishing.spec.ts tests/e2e/home.spec.ts
git commit -m "test(e2e): cover the featured project and footer writing link"
```

---

### Task 7: Full verification

1. Run `pnpm test:unit`, `pnpm lint`, `pnpm typecheck`, `pnpm check:format`. All
   must pass. Fix formatting with `pnpm exec prettier --write` on changed files
   only.
2. Run `pnpm build`. In the build output, `/` must still be static (○) or ISR,
   not dynamic (ƒ).
3. Run `pnpm start --port 3100` and use Playwright to screenshot `/` at 1280px
   and 390px wide, in light and dark themes. Check:
   - the card shows 3 real changelog lines linking to sudoku PRs
   - the board is hidden on mobile and the card doesn't overflow
   - status labels are legible in dark mode
   - nav shows Projects, About, Read, and `/writing` still shows the name block
4. Temporarily point `getChangelog` at `seanoliver/does-not-exist`, rebuild, and
   confirm the card renders without the changelog. Revert.
5. Run the PR pre-push checklist from `~/.claude-personal/CLAUDE.md` before
   pushing.
