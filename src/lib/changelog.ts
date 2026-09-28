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

    const text = match[1].replace(PR_SUFFIX, '')
    if (!text) continue

    const pr = PR_SUFFIX.exec(match[1])
    entries.push({
      date: item.commit.committer.date,
      text,
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
