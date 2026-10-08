# Homepage and most pages had no link-preview image or description

**Date:** 2026-10-07 **Branch:** fix/site-og-defaults **Caught by:** user report
(a meta-tag inspector showed seanoliver.dev with only a title)

## Symptom

Sharing `https://seanoliver.dev` produced a bare text card. The homepage sent
`og:title` and `twitter:title` only: no `description`, no `og:description`, no
`og:image`, and `twitter:card` was `summary`. `/writing`, `/projects`,
`/experience` and `/read` had descriptions but no `og:image`. `/uses` had no
metadata of its own and inherited the homepage's.

## Root cause

The root layout's `metadata` held only a title, so any page without its own
metadata got nothing else. The pages that did define metadata set `openGraph`
and `twitter` without `images`. Next.js merges metadata shallowly per top-level
key, so a page's `openGraph` replaces the layout's entire `openGraph` object.
Adding an image to the layout alone would not reach those pages.

`/uses` was marked `'use client'` with no client-only code. A client component
can't export `metadata`, so it fell through to the layout.

## Repro steps

1. Check out `main` at `934fee4`.
2. `curl -s https://www.seanoliver.dev/ | grep -oE '<meta[^>]*og:[^>]*>'` prints
   `og:title` only.

## Fix

- The layout now sets a description, `og:url`, `og:image` and a
  `summary_large_image` X card. The description is the homepage hero line.
- `ogImageUrl()` moved from `writing/[slug]/page.tsx` to `src/lib/site.ts`.
  Every page that overrides `openGraph` now passes it a page title for both
  `openGraph.images` and `twitter.images`.
- `/uses` is now a server component with its own metadata.

## Verification

`pnpm test:e2e` passes 26/26, including the new `tests/e2e/metadata.spec.ts`.
`pnpm lint`, `pnpm typecheck` and `pnpm test:unit` (94) also pass.

## Recurrence guardrail

`tests/e2e/metadata.spec.ts` visits every route and requires `description`, the
`og:*` and `twitter:*` title, description and image tags, and a
`summary_large_image` card. It also requires `og:url` to match the route and
`og:image` to return an image. A new route must be added to its `ROUTES` list.
