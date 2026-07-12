# Blog Platform Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan
> task-by-task.

**Goal:** Replace the abandoned Contentlayer blog with an owned, tested
local-MDX pipeline and modernize the application safely behind required GitHub
Actions checks while Vercel retains deployment ownership.

**Architecture:** Establish deterministic Vitest and Playwright contracts before
changing infrastructure. Move all publication, URL, and ordering policy into a
server-only `src/content` module backed by `fs`, `gray-matter`, Zod, and
first-party Next.js MDX. Remove Contentlayer before crossing the Next 15/React
19 and Next 16 boundaries, and update remaining dependencies in isolated
clusters.

**Tech Stack:** Node 22, pnpm 10, Next.js App Router, React, TypeScript,
`@next/mdx`, Zod, Vitest, Playwright, GitHub Actions, Vercel.

**Design:** `docs/plans/2026-07-10-blog-platform-modernization-design.md`

---

## Execution rules

- Execute in an isolated worktree created from `main` at or after `c240a49`.
- Preserve the user's untracked `.codex/` directory; never stage or remove it.
- Do not combine numbered tasks into one commit.
- Never use `--force`, `--legacy-peer-deps`, or an override to hide an invalid
  peer dependency.
- At every dependency step, read the target package's official migration guide
  and installed type definitions before changing application code.
- Run the full gate after every task that changes runtime behavior:

  ```bash
  pnpm check:format
  pnpm lint
  pnpm typecheck
  pnpm test:unit
  pnpm build
  pnpm test:e2e
  ```

- If a gate fails for a reason outside the task's declared scope, stop and
  report it instead of broadening the change.
- Do not enable required branch checks until the workflow has completed
  successfully at least once on GitHub.
- Vercel remains the deployment owner. Do not add Vercel tokens or deployment
  commands to GitHub Actions.

## Target dependency versions recorded during planning

These were current on 2026-07-10 and must be re-verified immediately before
installation:

- `pnpm@10.25.0`
- `vitest@4.1.10`
- `@playwright/test@1.61.1`
- `zod@4.4.3`
- `@next/mdx@16.2.10` when the framework reaches Next 16; use the matching Next
  major during intermediate steps
- `@mdx-js/loader@3.1.1`
- `@types/mdx@2.0.14`
- `gray-matter@4.0.3`
- `remark-frontmatter@5.0.0`

GitHub Actions current stable majors recorded during planning:

- `actions/checkout@v7`
- `actions/setup-node@v6`
- `actions/upload-artifact@v7`
- `actions/download-artifact@v8`
- `pnpm/action-setup@v6`

Do not silently substitute a new major. Read its release notes first.

### Task 1: Add repeatable local quality commands

**Files:**

- Modify: `package.json`
- Modify: `.eslintrc.json`
- Create: `.prettierignore`

**Step 1: Record the package manager and add check scripts**

Add the following top-level field:

```json
"packageManager": "pnpm@10.25.0"
```

Replace the script surface with named, composable checks while retaining dev,
build, and start:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "contentlayer build && tsc --noEmit --incremental false",
    "check:format": "prettier --check .",
    "format": "prettier --write .",
    "test": "pnpm test:unit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Remove `--debug` from the production build; debug logging should be opted into
locally rather than required in CI.

Baseline corrections (verified in the working tree before implementation):

- `typecheck` must run `contentlayer build` before `tsc` because
  `.contentlayer/generated` does not exist in a clean checkout until
  Contentlayer runs. Task 8 removes the `contentlayer build &&` prefix when
  Contentlayer is deleted.
- Add `"root": true` to `.eslintrc.json` so ESLint stops resolving parent
  configs (required for nested worktrees; harmless elsewhere). Include
  `.eslintrc.json` in the Task 1 commit.

Create `.prettierignore` with generated and test-artifact paths:

```text
.next/
.contentlayer/
node_modules/
playwright-report/
test-results/
```

**Step 2: Install the test tools**

Run:

```bash
pnpm add -D vitest@4.1.10 @playwright/test@1.61.1
pnpm exec playwright install chromium
```

Expected: `package.json` and `pnpm-lock.yaml` change; Chromium is installed
locally and no peer dependency is forced.

**Step 3: Run the pre-existing checks through their new names**

Run:

```bash
pnpm check:format
pnpm lint
pnpm typecheck
pnpm build
```

Expected: formatting, lint, typecheck, and build exit 0. Existing non-blocking
image/alt warnings may remain only if they were present at baseline; record them
for a later scoped task.

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .prettierignore .eslintrc.json
git commit -m "chore: add repeatable quality commands"
```

### Task 2: Configure Vitest and establish pure-function contracts

**Files:**

- Create: `vitest.config.ts`
- Create: `src/lib/feed.ts`
- Create: `src/lib/feed.test.ts`
- Modify: `src/app/feed.xml/route.ts`

**Step 1: Add the Vitest configuration**

Create `vitest.config.ts`:

```ts
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
})
```

**Step 2: Write failing tests for feed primitives**

Create `src/lib/feed.test.ts` covering:

- XML special characters are escaped exactly once;
- `]]>` cannot terminate CDATA;
- unpublished entries are absent;
- entries sort newest first;
- every link and GUID uses the canonical URL supplied by the entry projection.

Use two published fixtures and one draft. Assert meaningful fields rather than
snapshotting the entire XML document.

**Step 3: Verify the test fails**

Run:

```bash
pnpm test:unit -- src/lib/feed.test.ts
```

Expected: FAIL because `src/lib/feed.ts` does not exist.

**Step 4: Extract the smallest feed module**

Move XML escaping and feed-string construction from the route into
`src/lib/feed.ts`. Its input must be a plain array, not `allPosts`, so the same
function survives the Contentlayer migration:

```ts
export type FeedEntry = {
  title: string
  summary: string
  publishedAt: string
  canonicalUrl: string
  isPublished: boolean
}

export function escapeXml(value: string): string
export function buildRssFeed(entries: FeedEntry[]): string
```

The route remains responsible for mapping the current Contentlayer documents
into `FeedEntry` and returning the `Response` with cache headers.

**Step 5: Verify**

Run:

```bash
pnpm test:unit -- src/lib/feed.test.ts
pnpm typecheck
pnpm build
```

Expected: all commands exit 0 and `/feed.xml` remains valid XML.

**Step 6: Commit**

```bash
git add vitest.config.ts src/lib/feed.ts src/lib/feed.test.ts src/app/feed.xml/route.ts
git commit -m "test: add deterministic feed contracts"
```

### Task 3: Add Playwright publishing contracts and fix known defects

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/publishing.spec.ts`
- Modify: `src/app/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `contentlayer.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/posts-content.tsx`
- Delete: `src/hooks/use-posts.tsx` when no longer imported

**Step 1: Configure Playwright against a production server**

Create `playwright.config.ts` with Chromium only, one retry in CI, trace on the
first retry, and this web server:

```ts
webServer: {
  command: 'pnpm start',
  port: 3000,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
}
```

Set `baseURL` to `http://127.0.0.1:3000`. Do not start `next dev` in E2E.

Approved deviation (quality review): E2E runs on a dedicated port 3100
(`pnpm start --port 3100`, `baseURL` `http://127.0.0.1:3100`) so
`reuseExistingServer` can never silently attach to a `next dev` instance on the
default port 3000.

**Step 2: Write failing browser contracts**

Create `tests/e2e/publishing.spec.ts` asserting:

1. `/posts` returns 200 and its initial HTML contains both published titles.
2. `/ai-function-calling` returns 404 in the production build.
3. `/sitemap.xml` contains the real canonical post paths and each listed post
   URL returns 200.
4. `/nextjs-contentlayer` has a non-empty OG image title parameter.
5. `/posts` exposes a discoverable `application/rss+xml` link in `<head>`.

Use Playwright request APIs for status/XML assertions and page locators for
rendered/metadata assertions. Do not call Goodreads endpoints.

**Step 3: Verify the tests expose the current defects**

Run:

```bash
pnpm build
pnpm test:e2e
```

Expected: FAIL on draft visibility, sitemap paths, OG image content, RSS
discovery, and server-rendered post titles.

**Step 4: Make publication filtering authoritative at the route**

In both `generateStaticParams` and page lookup, restrict production routes to
published posts. A direct lookup of a draft must call `notFound()`. Add:

```ts
export const dynamicParams = false
```

Do not rely on the listing filter for access control.

**Step 5: Repair canonical URLs and metadata**

- Make sitemap URLs match the existing real post URLs until `/writing` ships.
- Generate the OG query with `encodeURIComponent(doc.title)` rather than
  `path.join` or string replacement.
- Move RSS discovery into the App Router Metadata API. Because metadata exports
  require a Server Component, remove the root layout's `'use client'` boundary
  and move any client-only behavior behind existing child components.

**Step 6: Server-render the post index**

Remove the effect-based hook. Filter, sort, and map the current collection in a
Server Component and pass only title/date/URL list data to presentation. Ensure
compiled MDX bodies are not referenced by a client component.

**Step 7: Verify all baseline gates**

Run the full gate from **Execution rules**.

Expected: every command exits 0; the five browser contracts pass.

**Step 8: Commit**

```bash
git add playwright.config.ts tests/e2e/publishing.spec.ts src contentlayer.config.ts
git commit -m "fix: enforce blog publishing contracts"
```

### Task 4: Add GitHub Actions validation

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: `.gitignore` if Playwright artifacts are not already ignored

**Step 1: Create the workflow**

Create `.github/workflows/ci.yml` with:

- triggers for `pull_request` and pushes to `main`;
- `permissions: contents: read`;
- concurrency keyed by workflow and ref with cancellation enabled;
- Node version read from `.nvmrc`;
- pnpm `10.25.0` installed by `pnpm/action-setup@v6`;
- checkout/setup actions at the reviewed stable majors listed above;
- `pnpm install --frozen-lockfile` in every job.

Use four jobs:

1. `quality`: format, lint, typecheck, unit tests.
2. `build`: depends on quality, builds Next, uploads `.next` excluding
   `.next/cache` as `next-build`.
3. `browser-contracts`: depends on build, installs Chromium with dependencies,
   downloads `next-build`, runs Playwright, and uploads `playwright-report` and
   `test-results` only on failure.
4. `dependency-report`: runs `pnpm audit --prod`, writes the output to the job
   summary, and is explicitly non-blocking with a comment linking to the
   dependency-modernization task.

Name the visible required jobs exactly `Quality`, `Production build`, and
`Browser contracts` so branch protection contexts remain stable.

**Step 2: Validate workflow syntax locally**

Run Prettier against the workflow and inspect the complete YAML. If `actionlint`
is already available, run it; do not add another dependency solely for this one
file.

**Step 3: Verify locally**

Run the full gate.

Expected: all required local checks pass. The dependency audit may exit non-zero
and must not be included in the local full gate yet.

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml .gitignore
git commit -m "ci: validate pull requests and main"
```

**Step 5: Push the branch and observe one complete Actions run**

Expected: Quality, Production build, and Browser contracts are green. Vercel
creates a Preview deployment independently. Dependency report is visible but
does not fail the workflow.

**Step 6: Enable required checks only after the green run**

Configure `main` branch protection to require the three stable contexts above,
require branches to be up to date, and retain administrator enforcement only if
that matches the repository owner's preferred emergency policy. Do not make the
dependency report required yet.

Verify with:

```bash
gh api repos/seanoliver/seanoliver-dot-dev/branches/main/protection
```

Expected: required status checks include Quality, Production build, and Browser
contracts. Vercel remains absent from the Actions workflow and continues to own
deployments.

### Task 5: Patch the current framework generation

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify only files required by documented Next 14 patch or React 18.3 warnings

**Step 1: Re-read official release and security notes**

Confirm the latest Next 14 patch and React 18.3 versions on the execution date.
Record the chosen versions in the commit body.

**Step 2: Update only the current generation**

Run the equivalent of:

```bash
pnpm add next@14.2.35 react@18.3 react-dom@18.3 eslint-config-next@14.2.35
pnpm add -D @types/react@18 @types/react-dom@18
```

Do not force Contentlayer's invalid peer range. If normal resolution fails, stop
and execute Task 6 on the existing versions instead.

**Step 3: Resolve only documented compatibility changes**

Do not opportunistically update UI or MDX packages in this task.

**Step 4: Verify and commit**

Run the full gate, then:

```bash
git add package.json pnpm-lock.yaml src next.config.js
git commit -m "chore: patch Next and React within current generation"
```

### Task 6: Build the owned content domain with TDD

**Files:**

- Create: `src/content/schema.ts`
- Create: `src/content/files.ts`
- Create: `src/content/index.ts`
- Create: `src/content/content.test.ts`
- Create: `src/content/__fixtures__/valid/article.mdx`
- Create: `src/content/__fixtures__/valid/note.mdx`
- Create fixture directories for invalid metadata, duplicate slugs, and drafts
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Step 1: Install narrowly scoped primitives**

Re-verify versions, then install Zod and `gray-matter`. Do not install Content
Collections, Velite, or another collection framework.

**Step 2: Write failing schema tests**

Cover:

- valid article and note metadata;
- invalid `kind`, `status`, date, URL, and distribution combinations;
- a published entry without `publishedAt`;
- error messages containing the fixture path and failing field.

**Step 3: Implement the discriminated Zod schema**

Export the inferred metadata type. Keep author and site URL in site
configuration, not repeated in every file.

**Step 4: Write failing filesystem tests**

Use real fixture directories to cover:

- recursive `.mdx` discovery;
- slug derivation;
- duplicate slug rejection;
- deterministic reverse-chronological ordering;
- drafts absent from published, route, feed, and sitemap projections;
- returned index entries containing metadata only, never compiled bodies.

**Step 5: Implement the filesystem boundary**

`src/content/files.ts` may use only `node:fs/promises`, `node:path`, and
`gray-matter`. Accept an explicit content root for tests. Include paths in all
errors and aggregate validation errors when practical so authors can fix more
than one file per run.

**Step 6: Implement the public server-only API**

Begin `src/content/index.ts` with:

```ts
import 'server-only'
```

Export only the operations approved in the design. Centralize URL construction
and publication filtering here.

**Step 7: Verify and commit**

Run unit tests and typecheck, then:

```bash
git add src/content package.json pnpm-lock.yaml
git commit -m "feat: add typed filesystem content domain"
```

### Task 7: Configure first-party MDX and migrate content

**Files:**

- Create: `next.config.mjs`
- Create: `mdx-components.tsx`
- Create: `content/writing/*.mdx`
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Delete later in this task: `next.config.js`

**Step 1: Install the matching first-party MDX packages**

Install the `@next/mdx` version matching the current Next major plus
`@mdx-js/loader`, `@types/mdx`, and `remark-frontmatter`. Retain existing GFM
and syntax-highlighting plugins only after checking compatibility.

**Step 2: Configure native MDX**

Convert Next config to ESM, include `.mdx` in `pageExtensions`, recognize YAML
frontmatter with `remark-frontmatter`, and retain the existing GFM and code
highlighting behavior. Do not enable experimental MDX compilers.

**Step 3: Expose existing presentation through `mdx-components.tsx`**

Adapt `src/components/mdx.tsx` to Next's `MDXComponents` type. Preserve visual
output; do not redesign typography during migration.

**Step 4: Migrate one published article as a tracer bullet**

Move one post into `content/writing`, translate metadata to the approved schema,
and prove that schema parsing and native MDX rendering agree on the same file.

**Step 5: Verify the tracer bullet**

Add or update a Playwright assertion for the tracer route. Run unit tests,
typecheck, build, and that focused browser test.

**Step 6: Migrate the remaining content**

Move both remaining files, preserving original dates, slugs, and draft status.

**Step 7: Verify and commit**

Run the full gate, then commit only MDX configuration and content migration.

**Execution note (2026-07-11):**

- Content was **copied, not moved**, into `content/writing/`: the e2e suite pins
  the legacy Contentlayer routes (`/nextjs-contentlayer`, `/scroll-links`, draft
  `/ai-function-calling` 404) until Task 8, so `posts/` and
  `contentlayer.config.ts` stayed completely untouched.
- A **minimal `/writing/[slug]` tracer route was pulled forward from Task 8**
  (`src/app/writing/[slug]/page.tsx`): Step 5 requires a Playwright-testable
  route, and the route is what proves schema parsing (`src/content`) and native
  MDX rendering agree on the same file. No index page, redirects, or JSON-LD
  yet.
- Task 8 accordingly **deletes `posts/`** along with Contentlayer and **extends
  the existing `src/app/writing/[slug]/page.tsx`** (article chrome, metadata,
  JSON-LD) rather than creating it.
- Plugin compatibility: `remark-gfm@3` crashes under the MDX v3 / unified 11
  loader (`this.setData is not a function`), so the new pipeline uses the npm
  alias `remark-gfm-mdx3` (`npm:remark-gfm@^4.0.1`); Contentlayer keeps
  `remark-gfm@3`. `rehype-pretty-code@0.10` works unchanged on both.
  `tsconfig.json` needed no modification (`@types/mdx` is picked up
  automatically).

### Task 8: Migrate every consumer and remove Contentlayer

**Files:**

- Create: `src/app/writing/page.tsx`
- Create: `src/app/writing/[slug]/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/posts-content.tsx` or replace it with a server-only
  writing index component
- Modify: `src/app/feed.xml/route.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/json-ld.tsx` as required by article/note distinctions
- Modify: `next.config.mjs`
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Delete: `contentlayer.config.ts`
- Delete: `src/app/[slug]/page.tsx` after redirects exist
- Delete: all remaining source imports from `contentlayer/generated`

**Step 1: Write failing integration tests for all projections**

Assert one fixture's URL is identical in route params, index, feed, sitemap,
metadata, and JSON-LD. Assert the draft appears in none of them.

**Step 2: Build `/writing` and `/writing/[slug]` on the content API**

Use native dynamic MDX imports only after `getEntryBySlug` confirms the slug is
published. Export `dynamicParams = false`. Generate metadata from the same entry
projection used by the page.

**Step 3: Migrate indexes, feed, sitemap, and JSON-LD**

No consumer may read the filesystem or parse frontmatter independently.

**Step 4: Add permanent redirects for the two existing public root URLs**

Test the exact 308 destination. Do not redirect the unpublished draft.

**Step 5: Remove Contentlayer completely**

Delete packages, overrides used solely by Contentlayer, generated aliases,
configuration, and ignored/generated directories. Confirm:

```bash
rg -n "contentlayer|allPosts|contentlayer/generated" . \
  -g '!pnpm-lock.yaml' -g '!docs/**'
```

Expected: no source/config matches.

**Step 6: Verify dependency impact**

Run the full gate and `pnpm audit --prod`. Record the before/after dependency
and advisory counts in the commit or PR description without claiming every
remaining advisory is reachable.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: replace Contentlayer with native MDX content pipeline"
```

### Task 9: Upgrade Next 14 to Next 15 and React 19

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: App Router pages/layouts/routes affected by async request APIs
- Modify: TypeScript React types

**Step 1: Read the official Next 15 and React 19 upgrade guides**

Record breaking changes applicable to this repository, especially async
`params`, React types, and removed/deprecated APIs.

**Step 2: Run the official codemod in dry-run/print mode**

Inspect every proposed hunk. Apply only transformations relevant to this repo.

**Step 3: Upgrade Next, React, React DOM, matching MDX packages, ESLint config,
and React types as one framework cluster**

Do not update Tailwind, Radix, or unrelated libraries.

**Step 4: Resolve async request APIs explicitly**

Await route `params` and use the documented Next 15 types. Remove temporary
synchronous compatibility rather than carrying it into Next 16.

**Step 5: Verify and commit**

Run the full gate and audit, then commit the framework cluster.

**Execution note (2026-07-11):**

- **TypeScript 5.0.4 → 5.9.3 was pulled into this cluster as a requirement, not
  scope creep**: current `@types/react@19` (19.2.17) requires TS ≥ 5.3
  (DefinitelyTyped's rolling ~2-year support window pins `ts5.0` back at 19.0.12
  and `ts5.2` at 19.2.14). 5.9.3 is the newest stable TypeScript supported by
  the `@typescript-eslint` v8 line (npm `latest` is TypeScript 7, which nothing
  in this toolchain supports yet). _(Correction, 2026-07-11:
  `eslint-config-next@15` actually resolved the project's direct
  `@typescript-eslint@6.21.0` devDeps — a line that only declares support for TS
  <5.4.0 — not v8; the v8 line arrives with `eslint-config-next@16` in Task
  10.)_ Task 11's "TypeScript and Node types" cluster now covers only the
  `@types/node`/`bun-types` leftovers.
- Framework line: Next **15.5.20** (the `15.x` backport tag — npm `latest` is
  already Next 16, which is Task 10), React/ReactDOM **19.2.7**, `@types/react`
  **19.2.17**, `@types/react-dom` **19.2.3**.
- `@types/react@19` removed the global `JSX` namespace; the official
  `types-react-codemod scoped-jsx` transform added
  `import type { JSX } from 'react'` to the 20 files annotating `JSX.Element`.
  No other React 19 type breakage existed (no `useRef()` without argument, no
  deprecated aliases, no `propTypes`/`defaultProps`).
- `src/app/feed.xml/route.ts` gained `export const dynamic = 'force-static'`:
  Next 15 stopped caching GET route handlers by default, and the feed derives
  entirely from build-time content — this preserves the Next 14 build output
  (`○` static) exactly. `/api/goodreads` was already dynamic (`ƒ`) under Next 14
  per the CI build log, so its behavior is unchanged.

### Task 10: Upgrade Next 15 to Next 16 and modernize linting

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `eslint.config.mjs`
- Delete: `.eslintrc.json`
- Modify: `next.config.mjs`
- Modify files required by documented Next 16 removals

**Step 1: Read the official Next 16 guide**

Pay particular attention to Turbopack defaults, fully async request APIs,
`next lint` removal, ESLint flat config, and image defaults.

**Step 2: Dry-run the Next 16 codemod**

Inspect before applying. Do not enable React Compiler or Cache Components in
this migration; they are separate product/performance decisions.

**Step 3: Upgrade the framework cluster and convert linting**

Change `pnpm lint` to invoke ESLint directly. Ensure generated and build paths
are ignored in flat config.

**Step 4: Verify**

Run the full gate twice: once from a warm workspace and once after deleting
`.next` to catch stale-cache success.

**Step 5: Commit**

Commit only Next 16, React 19.2-compatible changes, and lint migration.

**Execution note (2026-07-11):**

- **Turbopack/MDX decision: Turbopack stays the default for both `next dev` and
  `next build` — no webpack opt-out needed.** The official MDX guide documents
  the non-experimental resolution: `@next/mdx` plugins specified as strings with
  JSON-serializable options (`['rehype-pretty-code', { theme: 'poimandres' }]`),
  because plugin functions cannot cross into Turbopack's Rust side. The
  templated `import()` of `content/writing/<slug>.mdx` is the guide's own
  documented Turbopack pattern; both published posts SSG-prerendered and all 14
  e2e contracts (including `data-language="bash"` highlighting and
  frontmatter-not-leaked) passed against the Turbopack production build. No
  `--webpack`, no `mdxRs`.
- `next build` rewrote `tsconfig.json` as mandatory Next 16 changes:
  `moduleResolution: "bundler"`, `jsx: "react-jsx"`, and
  `.next/dev/types/**/*.ts` in `include` (dev now outputs to `.next/dev`).
- Lint: `next lint` is removed in 16. `pnpm lint` is now `eslint .` with the
  documented flat config (`eslint-config-next/core-web-vitals` +
  `globalIgnores`). ESLint pinned to the 9.x line (`^9.39.5`), not 10.x:
  `eslint-plugin-react`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and
  `@next/eslint-plugin-next` in `eslint-config-next@16.2.10`'s chain only
  declare peer support through ESLint 9. Rule parity verified: identical two
  `src/app/api/og/route.tsx` warnings before/after, zero new findings despite
  the broader `eslint .` surface (e2e/, root configs now linted).
  `eslint-config-next/typescript` deliberately NOT enabled (old config never had
  typescript-eslint rules; candidate for a separate decision).
- Direct `@typescript-eslint/{eslint-plugin,parser}@^6` devDeps removed —
  `eslint-config-next@16` brings its own `typescript-eslint@8.63.0` (verified
  with `pnpm why`). Also removed unused ESLint-8-era devDeps that only appeared
  in `package.json` (never referenced by the config, which extended only
  `next/core-web-vitals`): `eslint-config-airbnb`, `eslint-config-prettier`,
  `eslint-plugin-{import,jsx-a11y,prettier,react,react-hooks}`.
- Next 16 pulls `sharp@0.34.5` for production image optimization; its install
  script was approved via `pnpm.onlyBuiltDependencies` (prebuilt binary check
  passed).
- Codemod: of the five documented v16 transforms only `next-lint-to-eslint-cli`
  applied to this repo (no `experimental.turbopack`, middleware, `unstable_`
  APIs, or `experimental_ppr`). Its `--dry` flag is not honored — it modified
  files anyway; changes were inspected, reset, and redone manually per the
  ESLint API reference (the generated config had dead `__dirname` boilerplate,
  no ignores, and left `.eslintrc.json` behind).
- `pnpm audit --prod`: 28 → 22 (high 14 → 11, moderate 12 → 9, low 2 → 2); the
  drop is the `@typescript-eslint@6` chain. Remainder lives in `postcss@8.4.23`,
  `react-use`, and `js-yaml`-era chains — Task 11 clusters.
- No new peer warnings; the pre-existing `framer-motion@10` react@18 peer
  warning remains (Task 11).

### Task 11: Modernize remaining dependencies in cohesive clusters

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify only source/config files required by each cluster

**Step 1: Generate an import-to-manifest inventory**

For every dependency, find real imports/usages. Remove unused packages in a
dedicated commit before upgrading retained packages.

**Step 2: Update one cluster per commit**

Recommended order:

1. TypeScript and Node types.
2. MDX/remark/rehype/Shiki.
3. Radix and shadcn primitives.
4. Tailwind, PostCSS, and styling utilities.
5. Analytics, icons, animation, and remaining runtime utilities.

Run the full gate after each cluster. Use targeted Playwright coverage for any
component visibly affected by a cluster.

**Step 3: Make the dependency audit blocking**

After evaluating remaining advisories for reachability and available patches,
choose and document an initial threshold. Update GitHub Actions so regressions
at that threshold fail. Do not mute advisories without a dated rationale and
review owner.

**Execution note (2026-07-11):**

- **Unused removals** (dedicated commit, verified by import inventory — MDX
  prose mentions don't count): `@headlessui/react`, `@heroicons/react`,
  `@makotot/ghostui`, `framer-motion`, `react-scroll` + `@types/react-scroll`,
  `react-use`, `react-icons`, `rehype-highlight`, `@vercel/og` (the OG route
  uses built-in `next/og`), devDeps `bun-types` and `supabase` (its
  `ignoredBuiltDependencies` entry pruned). `eslint-config-next` moved to
  devDependencies. `tsconfig.json` now pins
  `typeRoots: ["./node_modules/@types"]` — without it, tsc walks up out of a
  nested git worktree and auto-includes the main clone's stale `@types`.
- **Clusters**: (1) `@types/node` 20.1.2 → 22.20.1 (matches Node 22; moved to
  devDependencies); TS stays 5.9.3 (typescript-eslint cap). (2)
  `rehype-pretty-code` 0.10 → 0.14.4 + `shiki` 0.14 → 4.3.1; single-theme output
  now stamps `data-theme="poimandres"` (was `"default"`) and wraps blocks in
  `<figure data-rehype-pretty-code-figure>`; the e2e theme pin was deliberately
  updated to the (stronger) literal theme name. (3) Radix primitives to latest,
  no API drift. (4) Tailwind 3.3.2 → 3.4.19 with postcss/autoprefixer/clsx 2/cva
  0.7/tailwind-merge 2 (the Tailwind-3 line — tailwind-merge 3 targets Tailwind
  4 syntax). (5) `@vercel/analytics` → 2.0.1 with the `/next` entrypoint per
  Vercel docs; `next-themes` → 0.4.6 (fixed the removed `next-themes/dist/types`
  deep import).
- **Tailwind 3 → 4 deliberately deferred**: v4 is a CSS-first architectural
  migration (config-in-CSS, `@tailwindcss/postcss` split, automatic content
  detection replacing globs). Given the prior purge incident with root-level
  `mdx-components.tsx`
  (docs/bugs/2026-07-11-tailwind-purged-mdx-component-classes.md), it warrants a
  dedicated task with full visual QA, not a cluster rider.
- **Audit**: 22 prod advisories (11 high/9 moderate/2 low) at task start → **1
  moderate** after removals, cluster upgrades, reclassifying build-time tooling
  (tailwindcss/postcss/autoprefixer/typescript) to devDependencies, and in-range
  transitive refreshes (js-yaml 3.15.0, glob 10.5.0, minimatch 9.0.9,
  brace-expansion 2.0.3, picomatch 2.3.2, yaml 2.9.0, flatted 3.4.2). Remaining:
  `next>postcss` 8.4.31 (CVE-2026-41305, moderate) — pinned exactly by `next`,
  build-time-only processing of this repo's own CSS, waiting on an upstream next
  bump. No advisories were muted.
- **Blocking threshold (2026-07-11, review owner: Sean Oliver)**: the
  `Dependency report` job now fails on **high/critical advisories in production
  dependencies** (`pnpm audit --prod --audit-level high`); moderate/low and
  dev-only chains remain report-only in the job summary. Making
  `Dependency report` a required branch-protection context on `main` is a
  separate decision left to the repo owner.

### Task 12: Complete the article/note writing experience

**Files:**

- Modify: `src/content/schema.ts`
- Modify: `src/content/index.ts`
- Modify: `src/app/writing/page.tsx`
- Modify: `src/app/writing/[slug]/page.tsx`
- Create or modify focused presentation components and tests

**Step 1: Add failing tests for article/note distinctions**

Cover index labels/treatments, schema requirements, JSON-LD type, and whether a
summary is optional for notes. Resolve the summary decision based on real
authoring ergonomics before implementing it.

**Step 2: Implement the minimum distinct presentation**

Keep one chronological stream. Do not add pagination, search, tag pages, or a
CMS unless actual content volume demonstrates the need.

**Step 3: Verify and commit**

Run the full gate and manually review mobile/desktop article and note examples.

**Execution note (2026-07-11):**

- **Summary is optional for notes, required for articles.** Notes are
  short-form: a mandatory summary duplicates the body and adds authoring
  friction (the schema decision the design doc reserved). Implemented on the
  note branch of the discriminated union only. Fallbacks where a note has no
  summary: page metadata simply omits the description; the feed keeps its
  `FeedEntry.summary: string` surface and receives `''` (an empty
  `<description>` — the item still carries a `<title>`, so the RSS stays valid).
- **JSON-LD type per kind:** articles stay `BlogPosting`; notes emit
  `SocialMediaPosting` — schema.org's Article subtype for short informal
  microblog-style posts, so it fits notes without inventing a custom type.
  Implemented by parameterizing the existing `BlogPostingJsonLd` `@type`
  (default `BlogPosting`), not by rebuilding the component; the pure
  `entryJsonLdType` policy lives in `src/components/writing-presentation.ts`
  with unit coverage (a published-note page has no e2e surface yet).
- **`/posts` now 308-redirects to `/writing`** — the design makes `/writing` the
  single canonical index, so the duplicate `/posts` stream was removed:
  `src/app/posts/` deleted, nav label/link and the home section heading are now
  "Writing" → `/writing`, `/posts` dropped from the sitemap, and the e2e
  contracts rewritten deliberately (index-titles now covers `/` + `/writing`;
  `/posts` joined the exact-308 legacy-redirect contracts). e2e count stayed
  at 14.
- **One real draft note added** (`content/writing/leaving-contentlayer.mdx`,
  `kind: note`, `status: draft`, no summary) so dev preview and the manual
  review exercised a real note end to end without publishing content on Sean's
  behalf; production params exclude drafts, verified by curl (404) and the
  existing e2e draft contracts. Sean can publish, edit, or delete it.
- **Absorbed review minors:** (a) `formatDate`/`formatDateSpaced` now parse and
  render in UTC (frontmatter `YYYY-MM-DD` parses as UTC midnight; anywhere west
  of UTC previously rendered the prior day — proven by running Vitest under
  `TZ=America/Los_Angeles`). (b) `loadEntries` now rejects nested `.mdx` files
  with an aggregated, actionable error — the content domain enforces the flat
  root the route's by-slug MDX import assumes; fixtures/tests reworked
  (recursive-discovery test replaced by flat discovery + nested rejection). The
  duplicate-slug check stays as documented defense in depth, though a flat root
  with slug-=-basename makes duplicates structurally impossible, so its
  fixture-based test was removed. (c) The dev index always shows the `Draft`
  marker for drafts, with the date alongside when one exists (previously a dated
  draft looked published).
- The index projection (`toWritingListItem`) renders notes with a small muted
  "NOTE" tag next to the title; articles remain the default treatment. One
  reverse-chronological stream; no pagination, search, tag pages, or CMS.

### Task 13: Add Substack distribution affordances

**Files:**

- Modify: writing index and article layout components
- Modify: `src/content/schema.ts` tests if distribution invariants evolve
- Modify: site constants

**Step 1: Add a deterministic signup affordance**

Use Substack's supported embed or a clearly labeled link. If using the iframe,
test only that its URL and accessible title are correct; do not test Substack's
remote response.

**Step 2: Render distribution state only where useful**

`substackUrl` may expose an “email edition” link on selected articles. Never
make rendering depend on a live Substack API.

**Step 3: Verify and commit**

Run the full gate. Confirm no Substack credentials or undocumented endpoints
exist in the repository.

**Execution note (2026-07-11):**

- Affordance choice: a **plain labeled link, not the iframe embed**. The embed
  loads live remote Substack content on every page view, which conflicts with
  the deterministic/no-live-fetch decision; a muted one-line signup
  (`NewsletterSignup`) matches the site styling. It renders in the /writing
  index footer (via a new optional `footer` prop on `WritingIndex`; the
  home-page teaser passes none) and in a new article `<footer>`.
- The Substack URL was hoisted to `NEWSLETTER_URL` in `src/lib/site.ts` (single
  source; the nav's Newsletter item now imports it). Link href/label live in the
  `NEWSLETTER_CTA` projection in `writing-presentation.ts`.
- `emailEditionLink(metadata)` projects the "Also sent as an email edition" link
  (only for `email: selected` entries with a recorded `substackUrl`);
  unit-tested — no published entry carries the fields yet, so there is no e2e
  surface. Two e2e tests pin the signup link's href + accessible name on
  /writing and an article page (14 → 16).
- Distribution invariants did not evolve, so `schema.ts` tests are unchanged; a
  review-minor comment was folded into `sharedFields` (why `summary` is
  per-branch).

### Task 14: Write the authoring and maintenance runbook

**Files:**

- Modify: `README.md`
- Create: `docs/writing.md`
- Update: `docs/investigations/2026-07-10-blog-pipeline-and-substack.md` only if
  implementation discoveries materially change it

**Step 1: Replace stale setup instructions**

Document supported Node/pnpm versions, install, dev, full local gate, and the
Vercel/GitHub Actions responsibility boundary.

**Step 2: Document the complete writing workflow**

Include:

- creating an article and a note;
- every metadata field with examples;
- draft preview and publication;
- validation failure examples;
- URL/redirect rules;
- RSS, sitemap, and metadata effects;
- selected Substack email workflow;
- updating evergreen content without resending email;
- debugging commands and where each layer lives.

**Step 3: Run documentation commands exactly as written**

Use a clean checkout or disposable worktree. Correct any command that does not
produce the documented result.

**Step 4: Final verification**

Run the full gate, a blocking audit at the chosen threshold, and inspect the
GitHub required-check configuration. Confirm a Vercel Preview still appears on
the final PR without any Actions deployment job.

**Step 5: Commit**

```bash
git add README.md docs
git commit -m "docs: add writing and maintenance runbook"
```

## Completion checklist

- [ ] Quality, Production build, and Browser contracts are required on `main`.
- [ ] Vercel owns Preview and Production deployment.
- [ ] Contentlayer is absent from source, manifest, and lockfile.
- [ ] Drafts are excluded from every public surface and direct routing.
- [ ] Content failures identify the file and invalid field.
- [ ] `/writing` is server-rendered and supports articles and notes.
- [ ] Legacy public URLs redirect permanently.
- [ ] Feed, sitemap, metadata, JSON-LD, and routes share canonical URLs.
- [ ] Next/React and retained dependencies are deliberately current.
- [ ] The chosen audit threshold blocks new regressions.
- [ ] The authoring workflow is executable from the documentation.
