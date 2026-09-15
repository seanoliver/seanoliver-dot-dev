# Portfolio positioning and project evidence

## Context

The portfolio needs to show Sean as a software engineer whose growth and
marketing experience informs product decisions. Two independent homepage
prototypes compare an introduction-led layout and a case-study-led layout.

## Key findings

- The homepage currently composes About, social links, writing, projects,
  experience, and two reading sections.
- Section.tsx provides the existing label/content columns and generous vertical
  spacing.
- JetBrains Mono is the body font. Inter is already loaded by the root layout.
- The TheraGPT README documents a Next.js web app, shared LLM/logic/prompt
  packages, local journal storage, optional Supabase persistence, and use
  without an account.
- The Audioflare README documents a 2023 experiment with transcription followed
  by summarization, sentiment analysis, and translation. It also documents
  sample audio, per-request timing, a 30-second input limit, and model
  limitations.

## How it works

Each prototype replaces the homepage introduction and adds project presentation
using server components. Existing writing and reading data paths remain in
place. The case-study version uses native details/summary disclosure so
technical material is present in initial HTML and accessible without client
state.

## Gotchas

- Project descriptions are based on public repository documentation, not an
  audit of current production behavior.
- No user counts, revenue, conversion improvements, clinical outcomes, or
  campaign results have been verified. Copy must not imply such results.
- Audioflare is described as a 2023 experiment. Its existing portfolio URL
  contains a typo; the case study links to source instead of assuming the demo
  is still available.
- Existing screenshots are reused as project imagery.
- The main worktree is on an unrelated branch; prototypes start at origin/main
  in separate worktrees.

## References

- src/app/page.tsx
- src/components/Section.tsx
- src/lib/constants.tsx
- https://github.com/seanoliver/theragpt-app#readme
- https://github.com/seanoliver/audioflare#readme
- docs/plans/2026-09-14-portfolio-positioning.md
