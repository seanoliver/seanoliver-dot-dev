# seanoliver.dev

My personal site — portfolio, and a writing section (articles + notes) built on
an owned MDX content pipeline. Live at
[seanoliver.dev](https://seanoliver.dev/).

**Stack:** Next.js 16 (App Router, Turbopack for dev and build), React 19,
TypeScript 5.9, Tailwind CSS + shadcn/ui, MDX via `@next/mdx` with a Zod
frontmatter schema, Vitest, Playwright.

## Setup

Requires Node 22 (pinned in `.nvmrc` — `nvm use` or `mise` picks it up) and pnpm
10.25.0 (pinned via the `packageManager` field — `corepack enable` gives you the
right version automatically).

```bash
git clone https://github.com/seanoliver/seanoliver-dot-dev.git
cd seanoliver-dot-dev
pnpm install
pnpm dev   # http://localhost:3000 — draft entries are visible in dev only
```

## Scripts

| Command             | What it does                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Dev server on port 3000 (Turbopack). Drafts visible, content re-read per request.                     |
| `pnpm build`        | Production build. Also validates all content frontmatter — invalid content fails the build.           |
| `pnpm start`        | Serve the production build.                                                                           |
| `pnpm check:format` | Prettier check (`pnpm format` to write).                                                              |
| `pnpm lint`         | ESLint 9 flat config (2 known warnings in `src/app/api/og/route.tsx`).                                |
| `pnpm typecheck`    | `tsc --noEmit`.                                                                                       |
| `pnpm test:unit`    | Vitest — 72 tests (`test:unit:watch` for watch mode).                                                 |
| `pnpm test:e2e`     | Playwright — 16 production contracts. Starts `pnpm start --port 3100` itself; run `pnpm build` first. |

The full local gate (what CI runs, in order):

```bash
pnpm check:format && pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:e2e
```

First e2e run only: `pnpm exec playwright install chromium`.

## CI and deployment boundary

- **GitHub Actions** (`.github/workflows/ci.yml`) runs on every PR and on
  `main`: `Quality` (format/lint/typecheck/unit), `Production build`, and
  `Browser contracts` are required checks on `main` (strict — branches must be
  up to date). `Dependency report` also runs (blocking at high/critical
  advisories in production dependencies) but is not a required context.
- **Vercel owns all deployments** — Preview per PR, Production on `main` —
  through its GitHub integration. Actions never deploy anything; there are no
  deploy steps or Vercel tokens in any workflow.

## Writing

Authoring, previewing, publishing, Substack email editions, and content
debugging are covered in the runbook: **[docs/writing.md](docs/writing.md)**.

## Docs index

- [`docs/writing.md`](docs/writing.md) — authoring and maintenance runbook.
- [`docs/plans/`](docs/plans/) — implementation plans and design docs.
- [`docs/bugs/`](docs/bugs/) — bug journal ([template](docs/bugs/TEMPLATE.md)).
- [`docs/investigations/`](docs/investigations/) — investigation notes
  ([template](docs/investigations/TEMPLATE.md)).

## License

MIT — see [LICENSE](LICENSE).
