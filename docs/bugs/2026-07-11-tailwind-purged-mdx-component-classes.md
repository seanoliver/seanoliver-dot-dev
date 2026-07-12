# Tailwind purged every utility class emitted by mdx-components.tsx

**Date:** 2026-07-11 **Branch:** feat/blog-platform-modernization **Caught by:**
Browser QA of the React 19 Vercel preview — not by the HTTP-level e2e suite,
which only asserts on HTML content and never inspects computed styles.

## Symptom

Every `/writing/*` article rendered as unstyled prose on the preview deployment:
paragraphs had no vertical margins, lists had no bullets or indentation,
headings had no sizing. The MDX element classNames
(`my-6 ml-6 list-disc [&>li]:mt-2` on `ul`,
`leading-7 [&:not(:first-child)]:mt-6` on `p`, `text-3xl` on `h1`, etc.) were
all present in the served DOM, but the compiled stylesheet contained no rules
for `.my-6`, `.ml-6`, `.list-disc`, `.mt-6`, or `.text-3xl`.

## Root cause

`mdx-components.tsx` — the component mapping `@next/mdx` requires at the repo
root, created in Task 7 (commit `b3d3370`) — sits outside every glob in
`tailwind.config.js`:

```js
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
],
```

None of those cover a file at the repo root, so Tailwind's content scan never
saw the classNames and purged them from the build.

The regression was **masked** while `src/components/mdx.tsx` (the pre-migration
Contentlayer renderer, with the same classNames) still existed inside `src/` —
its copy of the strings kept the utilities alive in Tailwind's scan. Task 8
deleted it (commit `3ebdfe0`), and the classes vanished from the compiled CSS.

## Repro steps

1. Check out `da0436b` (pre-fix HEAD of the branch).
2. `pnpm build`
3. `grep -c "list-disc" .next/static/css/*.css` → 0 matches in every emitted
   file. (Path as of the original webpack build; Turbopack builds now emit CSS
   to `.next/static/chunks/*.css`.)
4. Serve the build and open `/writing/nextjs-contentlayer`: `getComputedStyle`
   on an article `ul` reports `list-style-type: none` (Tailwind preflight reset,
   with no `.list-disc` rule to override it).

## Fix

Added the root-level file to the Tailwind content globs — kept tight to the
single file rather than globbing the repo root (which would pull in
`node_modules`):

```js
content: [
  // ...existing globs...
  './mdx-components.tsx',
],
```

## Verification

- New e2e guardrail (`tests/e2e/publishing.spec.ts`, "article-body Tailwind
  utilities survive the production CSS build") failed against the unfixed build
  for the right reason (`list-style-type` computed as `none`, non-first MDX `p`
  margin-top `0`), and passes after the fix.
- Belt-and-braces: `grep -l "list-disc" .next/static/chunks/*.css | wc -l` goes
  0 → 1 after the fix (Turbopack emits CSS to `.next/static/chunks/`, not
  `.next/static/css/`).
- Full gate:
  `pnpm check:format && pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:e2e`
  green.

## Recurrence guardrail

The new e2e test asserts **computed styles** (not DOM classNames) on a
production build: an article `ul` must compute `list-style-type: disc` and a
non-first-child MDX paragraph must have a nonzero `margin-top`. Class purging is
invisible to HTML-level assertions — the classNames are in the DOM either way —
so computed styles are the only honest signal. Any future change that moves MDX
component classNames outside Tailwind's content globs (or drops the glob entry)
fails this test in CI.
