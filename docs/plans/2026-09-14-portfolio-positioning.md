# Portfolio positioning prototypes implementation plan

> **For Codex:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan
> task-by-task.

**Goal:** Compare two engineering-led portfolio homepages in separate draft PRs
and Vercel previews.

**Architecture:** Each branch starts at origin/main. Server-rendered homepage
components reuse navigation, section layout, writing, experience, and reading.
Native details elements reveal case studies without a new client dependency.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS modules, existing Tailwind
styles.

## Approved design

Sean approved two prototypes on September 14, 2026:

- Editorial: a stronger engineering-led introduction, one featured TheraGPT
  project, and the existing compact lists.
- Case studies: a shorter introduction and two project previews with expandable
  technical narratives before writing and experience.
- Keep the existing content width, navigation, monospace body, theme support,
  and simple vertical layout.
- Preserve engineering as the main identity. Explain growth experience through
  product decisions and documented features. Do not invent outcomes or adoption
  metrics.

## Visual system

- Base: existing white #ffffff and dark navy #020817.
- Text: existing dark navy #020817, muted slate #64748b, light text #f8fafc.
- Accent: restrained blue #315bd6, with #a5b4fc for dark-mode links.
- Type: existing JetBrains Mono for body; existing Inter for the main heading
  and project titles, exposed through a CSS variable.
- Layout: left-aligned introduction, existing section-label column, one
  full-width project image per featured project.
- Distinction: project-specific engineering and product decisions supply the
  detail. No decorative animation or repeated card grid.

## Task 1: Shared homepage structure

Files: src/components/Header.tsx, src/app/layout.tsx,
src/components/portfolio-intro.tsx, src/components/portfolio.module.css,
src/app/page.tsx.

1. Hide the existing small identity block only on the homepage, where a semantic
   h1 introduction replaces it.
2. Expose the already-loaded Inter font as --font-inter for scoped headline
   styling.
3. Add branch-specific introduction and a compact contact row using existing
   social URLs.
4. Preserve server-rendered writing and the existing lower sections.

## Task 2: Project presentation

Files: src/components/featured-project.tsx (editorial),
src/components/project-case-studies.tsx (case studies),
src/components/about-content.tsx (both).

1. Editorial: add TheraGPT screenshot, concise problem/engineering/product
   decisions, and project/source links.
2. Case studies: add TheraGPT and Audioflare screenshots and native details with
   substantive engineering and product notes based on their public READMEs.
3. Align the About page with the approved positioning while retaining personal
   information.
4. Record source evidence and limitations in
   docs/investigations/2026-09-14-portfolio-positioning.md.

## Task 3: Verification and previews

1. Run pnpm test:unit, pnpm lint, pnpm typecheck, and pnpm check:format in both
   worktrees.
2. Run pnpm build and the existing pnpm test:e2e suite for both branches.
3. Inspect desktop and mobile layouts, light/dark themes, links, and details
   keyboard interaction using Playwright. Capture screenshots.
4. Review the actual diff and public copy. Commit scoped files and push each
   branch.
5. Open independent draft PRs targeting main, wait for Vercel, and provide both
   preview URLs. Leave both PRs unmerged.
