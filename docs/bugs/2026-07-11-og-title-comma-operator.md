# Every OG image URL carried title "+" — a comma-operator typo

**Date:** 2026-07-11 (bug shipped 2023) **Branch:**
feat/blog-platform-modernization **Caught by:** The pre-migration audit (Task
1/3 of the blog platform modernization); documented as "Open Graph image URLs
currently resolve with an empty title" in
`docs/investigations/2026-07-10-blog-pipeline-and-substack.md`.

## Symptom

Every post's `og:image` URL was `https://seanoliver.dev/api/og?title=+` — the
literal string `+` instead of the post title. URL-decoded, `+` is a single
space, so the OG image route rendered every social card with a blank title.

## Root cause

The Contentlayer computed `image` field in `contentlayer.config.ts` (pre-fix):

```ts
resolve: (doc) =>
  `https://seanoliver.dev/api/og?title=${
    (doc.title.split(' '), join('+'))
  }`,
```

The intent was `doc.title.split(' ').join('+')`. The typo'd `,` turned it into a
**comma-operator expression**: `doc.title.split(' ')` is evaluated and
discarded, then `join('+')` is evaluated as a bare function call. That did not
throw, because the file happened to import `join` from `node:path`
(`import { join } from 'path'`) — and `path.join('+')` returns `'+'`. So the
whole expression always evaluated to `'+'`, regardless of the title.

Nothing flagged it: `path.join(...paths: string[])` type-checks with one string
argument, the comma operator is legal TypeScript, and there were no tests.

## Repro steps

1. Check out any commit before `3465176` (e.g. its parent).
2. Build and view source on any post page, or evaluate the expression directly:
   `(("A Title".split(' ')), require('path').join('+'))` → `'+'`.
3. `og:image` meta tag reads `.../api/og?title=+`.

## Fix

Commit `3465176` (Task 3, `fix: enforce blog publishing contracts`) replaced the
expression with `encodeURIComponent(doc.title)` — the correct encoding for a
query-string value (the split/join-with-`+` approach was a hand-rolled
approximation of it). After the Contentlayer removal (Task 8), the builder lives
in `ogImageUrl()` in `src/app/writing/[slug]/page.tsx`, still
`encodeURIComponent`.

## Verification

The e2e OG contract ("entry OG image URL carries a non-empty title parameter" in
`tests/e2e/publishing.spec.ts`) parses the `og:image` URL and asserts the
decoded `title` param is non-blank after `trim()` **and** equals the post's
actual title. It fails against the pre-fix behavior (decoded value is a single
space) and passes after.

## Recurrence guardrail

That same e2e test runs in the required `Browser contracts` CI job on every PR:
any regression that blanks or garbles the OG title parameter — encoding bugs
included, thanks to the `trim()` — blocks the merge.
