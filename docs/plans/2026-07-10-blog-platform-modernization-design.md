# Blog Platform Modernization Design

**Status:** Approved **Date:** 2026-07-10 **Baseline commit:** `c240a49`

## Goal

Turn the existing bolt-on blog into a reliable, developer-first publishing
system that supports articles and short notes, remains easy to debug, and can be
upgraded without depending on another all-encompassing content framework.

## Decisions

1. Git and local MDX remain the source of truth.
2. The project will own a small server-only content domain module built from
   Node filesystem primitives, first-party Next.js MDX support, Zod validation,
   and a narrowly scoped frontmatter parser.
3. Contentlayer and `next-contentlayer` will be removed completely.
4. No browser CMS will be introduced.
5. Content consumers will depend on the project's content API, never directly on
   a compiler's generated output.
6. Vitest will cover content-domain contracts; Playwright will cover a small set
   of deterministic browser and publishing contracts.
7. GitHub Actions will validate pull requests and `main`. Vercel retains Preview
   and Production deployment ownership through its existing GitHub integration.
8. Dependency modernization and content migration will be separate, gated
   changes so failures remain attributable.
9. The personal site is canonical. Substack remains an explicit distribution
   channel for selected pieces, not a second source of truth.

## Non-goals

- A hosted or browser-based CMS.
- Multiple authors, role-based publishing, or editorial approvals.
- Runtime content editing or a content database.
- Automated Substack publishing through private or undocumented endpoints.
- High percentage-based test coverage.
- Updating every dependency in a single pull request.

## Target architecture

```text
content/writing/*.mdx
        |
        v
frontmatter parser -> Zod schema -> MDX compiler
        |                 |
        +--------+--------+
                 v
        src/content (server only)
                 |
      +----------+-----------+-----------+------------+
      |          |           |           |            |
      v          v           v           v            v
   routes      indexes     metadata      RSS        sitemap
```

The content module owns all publication policy and exports narrow operations:

- `getPublishedEntries()`
- `getEntryBySlug(slug)`
- `getEntryRouteParams()`
- `getFeedEntries()`
- `getSitemapEntries()`

No client component receives compiled MDX bodies unless it is rendering that
specific entry. Indexes receive a small serializable projection.

## Content model

One discriminated collection supports both formats:

```yaml
kind: article # article | note
status: published # draft | published
title: A stable title
summary: A short description
publishedAt: 2026-07-10
updatedAt: 2026-07-10
tags: []
email: never # never | selected
substackUrl:
emailedAt:
```

`summary` may become optional for notes if the first implementation proves that
requiring it creates authoring friction. That is a schema decision, not a
rendering special case.

Validation must fail the build with the source path and field name when:

- required metadata is missing or invalid;
- two files resolve to the same slug;
- an email timestamp or Substack URL is present for an entry that is not marked
  for email distribution;
- a published entry lacks a publication date;
- a route attempts to resolve a draft.

## URL and publication policy

- New content lives at `/writing/[slug]`.
- `/writing` is a unified reverse-chronological index with distinguishable
  article and note treatments.
- Existing public post URLs receive permanent redirects.
- `dynamicParams = false` limits production routes to published static params.
- One canonical URL builder feeds metadata, RSS, sitemap, and JSON-LD.
- Drafts never appear in generated params, indexes, feeds, sitemaps, or direct
  route resolution.

## Testing strategy

### Vitest

Tests focus on policy and deterministic transforms:

- valid article and note parsing;
- actionable invalid-frontmatter errors;
- duplicate slugs;
- draft exclusion across every projection;
- stable ordering and URLs;
- RSS escaping and canonical links;
- sitemap output;
- distribution metadata invariants.

Tests should use small fixture directories and avoid mocking `fs` internals. The
loader accepts a content root so tests can point it at fixtures.

### Playwright

The browser suite stays intentionally small:

- `/writing` contains published entries in server-rendered HTML;
- published entries render successfully;
- draft and unknown slugs return 404;
- legacy URLs redirect permanently;
- RSS and sitemap expose canonical, reachable URLs;
- title, description, canonical, Open Graph, and RSS discovery metadata exist;
- article and note layouts retain their intended distinctions.

External services such as Goodreads are out of the deterministic suite unless
their network calls are explicitly intercepted.

### Quality gates

Every modernization checkpoint must pass:

1. formatting check;
2. ESLint;
3. TypeScript without emission;
4. Vitest;
5. production build;
6. Playwright against `next start`;
7. targeted manual review of affected pages.

`pnpm audit` initially reports without blocking because the existing tree has
known critical and high advisories. After dependency modernization establishes a
clean baseline, the agreed severity threshold becomes required.

## GitHub Actions and deployment boundary

One validation workflow runs for pull requests and pushes to `main` with
superseded runs cancelled. It contains:

1. **Quality:** frozen install, formatting, lint, typecheck, and Vitest.
2. **Build:** production Next.js build and build-artifact upload.
3. **Browser contracts:** frozen install, build-artifact download, production
   server startup, Playwright, and failure artifact upload.
4. **Dependency report:** non-blocking audit until the modernization milestone.

The workflow uses Node 22, pinned pnpm, dependency caching, read-only default
permissions, and no deployment secrets. Once green, Quality, Build, and Browser
Contracts become required branch checks.

Vercel remains responsible for Preview and Production deployments. Existing
GitHub deployment records show both Preview and Production deployments created
by `vercel[bot]`; GitHub Actions must not duplicate that responsibility.

## Migration sequence

1. Establish scripts, Vitest, Playwright, CI, and required checks.
2. Add failing publishing-contract tests and fix draft, sitemap, OG image, RSS
   discovery, and server-rendered-index defects.
3. Patch within the current generation: latest Next 14 and React 18.3. If
   Contentlayer blocks that patch, stop rather than force peer dependencies.
4. Build and migrate to the owned content module on Next 14/React 18.
5. Remove Contentlayer and its generated configuration completely.
6. Upgrade Next 14 to 15 with React 19 and resolve async request APIs.
7. Upgrade Next 15 to 16 and migrate removed tooling such as `next lint`.
8. Modernize remaining dependencies in cohesive clusters, deleting unused
   dependencies instead of upgrading them automatically.
9. Introduce the article/note writing experience and stable redirects.
10. Add the Substack signup and documented selected-email workflow.
11. Replace stale template documentation with the authoring runbook.

Each numbered migration is independently reviewable and revertible.

## Alternatives considered

### Content Collections

It offers an active, close replacement for Contentlayer and would reduce the
initial migration code. It was rejected as the default because it recreates a
central build-time dependency that owns schema, transformation, generated types,
and Next integration. Reconsider only if the owned module encounters a measured
blocker that Content Collections clearly removes.

### Upgrade everything before replacing Contentlayer

Rejected because Contentlayer wraps every Next build and already declares an
incompatible Next peer range. A large update would mix framework, compiler,
React, styling, and application failures.

### One large migration to the latest stack

Rejected because it would be faster to start but substantially harder to
diagnose, review, verify, and roll back.

## Success criteria

- All required GitHub checks pass on every pull request.
- Vercel remains the sole deployment owner.
- No production route can render a draft.
- Invalid content fails locally and in CI with actionable errors.
- Content indexes are server-rendered and do not ship compiled article bodies.
- RSS, sitemap, metadata, and routes share one URL and publication policy.
- Contentlayer and its transitive dependency tree are absent.
- Next, React, TypeScript, linting, and the retained UI dependencies are on
  deliberately verified current versions.
- Adding an article or note requires one MDX file and a documented publish
  command/checklist.
