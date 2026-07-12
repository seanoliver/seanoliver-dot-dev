# Writing runbook

How to author, preview, publish, and maintain writing on seanoliver.dev. For
project setup (Node/pnpm versions, install, scripts, CI/deploy boundary) see the
[README](../README.md).

## Where content lives

Every entry is one MDX file in `content/writing/`:

```
content/writing/<slug>.mdx
```

- The directory is **flat**. Nested files (e.g. `content/writing/2026/foo.mdx`)
  fail validation with an actionable error — the entry route imports bodies by
  `content/writing/<slug>.mdx`, so a nested file could never be routed.
- The **slug is the filename** (without `.mdx`) and must be lowercase kebab-case
  (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). It is interpolated verbatim into the URL, RSS
  GUID, and sitemap, so choose it carefully — changing it later breaks inbound
  links unless you add a redirect in `next.config.mjs`.
- Frontmatter is validated by the Zod schema in `src/content/schema.ts` at every
  `pnpm dev` request and every `pnpm build`. Invalid content cannot build.

## Creating an article

Articles are full blog posts. Create `content/writing/my-new-post.mdx`:

````mdx
---
kind: article
status: draft
title: My New Post
summary:
  One or two sentences — feeds the meta description, Open Graph, and the RSS
  item description.
tags:
  - nextjs
  - typescript
---

Body starts here. GitHub-flavored Markdown plus MDX. Fenced code blocks are
highlighted by rehype-pretty-code (poimandres theme):

```ts
const answer = 42
```
````

`summary` is **required** for articles.

## Creating a note

Notes are short-form entries — same file location, `kind: note`:

```mdx
---
kind: note
status: draft
title: A quick thought
---

Short body. No summary needed.
```

`summary` is **optional** for notes (a mandatory one would just duplicate the
body). When omitted, the page metadata has no description and the RSS item
description is empty. Notes get a small "Note" marker on the `/writing` index
and emit `SocialMediaPosting` JSON-LD instead of `BlogPosting`.

## Metadata field reference

Schema: `src/content/schema.ts` (`z.strictObject` — an unrecognized key, e.g.
the typo `publishedat:`, fails validation instead of silently dropping data).

| Field         | Required                              | Values / format              | Notes                                                                                                                                     |
| ------------- | ------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`        | yes                                   | `article` \| `note`          | Articles: full posts, summary required, `BlogPosting` JSON-LD. Notes: short-form, summary optional, `SocialMediaPosting` JSON-LD.         |
| `status`      | yes                                   | `draft` \| `published`       | Drafts are dev-preview only (see below).                                                                                                  |
| `title`       | yes                                   | non-empty string             | Page `<h1>`, `<title>`, OG/Twitter card, RSS item title, OG image text.                                                                   |
| `summary`     | articles: yes; notes: no              | non-empty string             | Meta description, OG/Twitter description, RSS item description, JSON-LD description.                                                      |
| `publishedAt` | when `status: published`              | `YYYY-MM-DD` (quoted or not) | Sort key for the index and feed; `datePublished` in JSON-LD; OG `publishedTime`.                                                          |
| `updatedAt`   | no                                    | `YYYY-MM-DD`                 | `dateModified` in JSON-LD and sitemap `lastModified` (falls back to `publishedAt`). Bump it when meaningfully revising evergreen content. |
| `tags`        | no (defaults to `[]`)                 | list of strings              | Stored on the entry; not currently rendered anywhere.                                                                                     |
| `email`       | no (defaults to `never`)              | `never` \| `selected`        | Marks the entry as manually distributed via Substack. See the Substack section.                                                           |
| `substackUrl` | no; only valid with `email: selected` | full URL                     | Link to the sent Substack edition; renders the "Also sent as an email edition" footer link.                                               |
| `emailedAt`   | no; only valid with `email: selected` | `YYYY-MM-DD`                 | When the email edition was sent. Record-keeping only.                                                                                     |

Optional keys may be left present-but-empty (`substackUrl:`) — YAML parses that
as null and the schema treats it as absent.

## Drafts and preview

`status: draft` entries are visible **only** in `pnpm dev`:

- They appear on `/writing` with a muted `Draft` marker (plus the date if one is
  set) and their entry page renders with a red **Unpublished** label.
- In production they are excluded from **every** surface: no static params
  (direct URL → 404, enforced by `dynamicParams = false`), not on the index, not
  in `/feed.xml`, not in `/sitemap.xml`.

The draft policy lives in exactly one place: `includeDrafts()` in
`src/content/index.ts` (`NODE_ENV === 'development'`).

To preview:

```bash
pnpm dev
# open http://localhost:3000/writing — drafts listed with Draft markers
```

There is no module-level cache — every request re-reads `content/writing/`, so
frontmatter and body edits show up on refresh.

## Publishing

1. Set `status: published` and add `publishedAt: YYYY-MM-DD`.
2. Run the full local gate (see README) — `pnpm build` alone catches all
   validation problems.
3. Commit on a branch, open a PR, let CI go green, check the Vercel Preview,
   merge. Vercel deploys `main` to production; no manual deploy step.

Publication effects, all derived from the one canonical URL builder
(`canonicalEntryUrl` in `src/content/files.ts` — feeds metadata, RSS, sitemap,
and JSON-LD, so they can never disagree):

- `/writing` lists the entry (newest first by `publishedAt`).
- `/writing/<slug>` serves it with canonical URL, OG/Twitter metadata, an OG
  image at `/api/og?title=<encoded title>`, and `BlogPosting` /
  `SocialMediaPosting` JSON-LD.
- `/feed.xml` gains an item whose `<link>` and `<guid>` are the canonical URL.
- `/sitemap.xml` gains the URL with `lastModified` from
  `updatedAt ?? publishedAt`.

## Validation failures — what they look like

Errors aggregate across all files (fix everything in one pass) and each line
carries the source path and failing field. Real output from `pnpm build`:

A typo'd key (`publishedat:`), a missing article summary, and a nested file:

```
Error [ContentValidationError]: .../content/writing/nested/buried.mdx: location: entries must live directly in .../content/writing — routes import bodies by slug (<content root>/<slug>.mdx), so a nested file can never be routed; move it up to the content root
.../content/writing/my-broken-post.mdx: summary: Invalid input: expected string, received undefined
.../content/writing/my-broken-post.mdx: (root): Unrecognized key: "publishedat"
```

Cross-field rules surface once the fields themselves parse — publishing without
a date, or recording a Substack URL on an entry not marked `email: selected`:

```
.../content/writing/my-broken-post.mdx: publishedAt: publishedAt is required when status is "published"
.../content/writing/my-broken-post.mdx: substackUrl: substackUrl is only allowed when email is "selected"; this entry is not marked for email distribution
```

Also rejected with the same path-prefixed format: malformed YAML
(`frontmatter:`), unreadable files (`read:`), non-kebab-case filenames
(`slug:`), and duplicate slugs.

## URLs and redirects

- `/writing` — the single canonical index.
- `/writing/<slug>` — every entry.
- Permanent (308) redirects, defined in `next.config.mjs`:
  - `/posts` → `/writing`
  - `/nextjs-contentlayer` → `/writing/nextjs-contentlayer`
  - `/scroll-links` → `/writing/scroll-links`

The two entry redirects exist because those posts were public at the site root
before the `/writing` move. New entries never need redirects; if you ever rename
a published slug, add one here and keep it forever.

## Substack: selected email distribution

The site is canonical; Substack is a **manual distribution channel** for
selected pieces. There is no Substack API, embed, or credential anywhere in this
repo — the only Substack surfaces are the newsletter home URL (`NEWSLETTER_URL`
in `src/lib/site.ts`, rendered as the "Subscribe to the newsletter" link) and
per-entry frontmatter.

To send an entry as an email edition:

1. Publish it on the site first (section above).
2. In Substack, manually write and send the email edition. Link back to the
   canonical `/writing/<slug>` URL — the site copy is the evergreen source of
   truth.
3. Record the sent edition in frontmatter:

   ```yaml
   email: selected
   substackUrl: https://newsletter.seanoliver.dev/p/my-new-post
   emailedAt: 2026-07-11
   ```

4. Commit and merge. The entry page footer now shows "Also sent as an email
   edition" linking to the Substack copy (projection logic: `emailEditionLink`
   in `src/components/writing-presentation.ts` — pure frontmatter, never a live
   Substack lookup).

## Updating evergreen content without re-emailing

Just edit the MDX body — that is the whole workflow. Optionally bump
`updatedAt`. Leave `email` / `substackUrl` / `emailedAt` untouched: they are a
record of a past send, not a trigger, and nothing in the site or CI can send
email. The Substack copy will drift from the canonical page; that is expected
and why email editions link back to the site.

## Debugging: where each layer lives

| Layer                            | Location                                                              | Owns                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Schema + validation              | `src/content/schema.ts`                                               | Frontmatter shape, cross-field rules, error formatting.                                                         |
| Filesystem + projections         | `src/content/files.ts`                                                | Discovery, flat-root rule, slug rules, ordering, feed/sitemap/route projections.                                |
| Public content API (server-only) | `src/content/index.ts`                                                | Binds content root + site URL + draft policy; the only module routes/feeds import.                              |
| MDX element rendering            | `mdx-components.tsx` (repo root)                                      | Element → component/className mapping. **Must stay in `tailwind.config.js` content globs** — see below.         |
| MDX plugins + redirects          | `next.config.mjs`                                                     | remark/rehype plugins as **strings** (Turbopack requirement), code theme, permanent redirects.                  |
| Presentation policy              | `src/components/writing-presentation.ts`, `writing-index.tsx`         | Note/draft markers, JSON-LD type choice, newsletter CTA, email-edition link.                                    |
| Routes                           | `src/app/writing/page.tsx`, `src/app/writing/[slug]/page.tsx`         | Index and entry pages, metadata, JSON-LD emission, MDX body import.                                             |
| Feeds                            | `src/app/feed.xml/route.ts` + `src/lib/feed.ts`, `src/app/sitemap.ts` | RSS and sitemap, fed by the content API projections.                                                            |
| Site identity                    | `src/lib/site.ts`                                                     | `SITE_URL`, author, `NEWSLETTER_URL`, RSS discovery alternate.                                                  |
| Production contracts             | `tests/e2e/publishing.spec.ts`                                        | 16 e2e tests: draft 404s, redirects, canonical/OG/JSON-LD, feed/sitemap URLs, CSS purge guard, newsletter link. |

Useful commands (all verified):

```bash
pnpm dev                    # drafts visible, content re-read per request
pnpm build                  # full content validation + production build
pnpm test:unit              # 72 unit tests incl. schema/files/presentation
pnpm build && pnpm test:e2e # 16 production contracts against a real server on port 3100
grep -l "list-disc" .next/static/chunks/*.css | wc -l   # 1 after a healthy build; 0 = Tailwind purged the MDX classes
```

Known traps:

- `mdx-components.tsx` sits at the repo root, outside `src/`, and Tailwind will
  silently purge every utility class it emits if it falls out of the `content`
  globs in `tailwind.config.js`. Guarded by an e2e computed-style test. Full
  story: `docs/bugs/2026-07-11-tailwind-purged-mdx-component-classes.md`.
- MDX plugins in `next.config.mjs` must stay strings (with JSON-serializable
  options) — plugin functions cannot cross into Turbopack. The file is not
  typechecked; the e2e theme assertion is the real guard on the
  rehype-pretty-code options.
- e2e tests always run against a production build on port 3100 (never a dev
  server), so draft-exclusion contracts are tested for real. Run `pnpm build`
  first or the suite starts a stale server.
