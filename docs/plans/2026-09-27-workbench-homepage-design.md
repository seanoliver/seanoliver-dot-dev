# Workbench Homepage Design

**Status:** Approved **Date:** 2026-09-27 **Baseline commit:** `4e4e78e`

## Goal

Make side projects the focus of the homepage, starting with Sudoku at
[sudoku.seanoliver.dev](https://sudoku.seanoliver.dev). The blog moves out of
the main path because new posts will be rare.

## Decisions

1. Keep the current visual system: JetBrains Mono, existing color tokens,
   section-label column, and single-column content width.
2. One project is featured at the top of the homepage in a "Now building" card.
   Sudoku is the first featured project.
3. Every project shows a status: `live`, `building`, `parked`, or `contributor`.
4. The featured card's changelog comes from the project's public GitHub commit
   history. Only `feat:` commits are shown. There is no hand-maintained
   changelog.
5. The `/writing` routes and URLs stay. Writing leaves the nav and the homepage
   body and appears as a footer link.

Two other directions were considered and rejected: a "studio shelf" of app
tiles, which looks empty with one app, and a dated build-log feed. Mockups for
all three were compared on 2026-09-27.

## Homepage layout

Top to bottom:

1. Nav: Projects, About, Read.
2. Intro: name, then one line: "Growth engineer at Supabase. After hours I build
   small apps."
3. **Now building** card for the featured project:
   - status label and domain
   - name and description
   - primary link "Play Sudoku →" to the project URL, secondary link "Source" to
     the GitHub repo
   - a static, server-rendered Sudoku board image
   - the latest 3 changelog lines
4. Projects list: name, summary, status label. The featured project is not
   repeated here.
5. Experience, limited to 3 entries (unchanged).
6. Currently reading and the last 3 Goodreads books (unchanged).
7. Footer: Writing, Newsletter, GitHub, X.

## Data model

`Project` in `src/lib/types.tsx` gains:

```ts
status: 'live' | 'building' | 'parked' | 'contributor'
featured?: boolean
```

The changelog repo is derived from the existing `github` URL
(`https://github.com/seanoliver/sudoku` → `seanoliver/sudoku`). No separate
`repo` field.

Sudoku is added to `PROJECTS` in `src/lib/constants.tsx` with `featured: true`.
Existing projects get a `status`.

## Changelog

- `src/lib/changelog.ts` holds pure functions, tested like
  `src/lib/goodreads.ts`:
  - parse a GitHub commits API response
  - keep commits whose first line matches `feat:` or `feat(scope):`
  - strip the `feat(scope):` prefix and the trailing `(#NN)`
  - return `{ date, text, url }`, where `url` points to the PR number when one
    is present, otherwise to the commit
  - take the latest 3
- The fetch calls `GET /repos/{owner}/{repo}/commits?per_page=50` with
  `next: { revalidate: 86400 }`. Unauthenticated requests are fine at one
  request per day.
- If the fetch fails or returns no `feat:` commits, the changelog block is
  hidden and the card still renders.
- Dates may repeat across lines. No grouping by day.

## Testing

- Vitest (`src/lib/changelog.test.ts`): feat filter, scoped and unscoped
  prefixes, `(#NN)` stripping and PR URL, commits without a PR number, limit of
  3, empty and malformed input.
- Playwright: the homepage renders the "Now building" card with a link to
  `https://sudoku.seanoliver.dev`.

## Out of scope

- Dark-mode-specific styling for the card. It uses existing tokens.
- A playable puzzle on the homepage.
- Tidying the project list (for example removing "TheraGPT (v1)" or
  "SeanOliver.dev").
- Hand-written changelog overrides.
