# Dependency report job failed on pnpm cache save it never populated

**Date:** 2026-07-11 **Branch:** feat/blog-platform-modernization **Caught by:**
The Dependency report CI job going red on a PR whose audit step had actually
passed.

## Symptom

The `Dependency report` job in `.github/workflows/ci.yml` failed even though its
only real step — the `pnpm audit` gate — succeeded. The failure came from the
automatic `Post Run actions/setup-node` step, which errored trying to save the
pnpm store cache.

## Root cause

The job configured `actions/setup-node` with `cache: pnpm` but deliberately has
**no install step** — `pnpm audit` works off `package.json` and the lockfile
alone and never needs `node_modules`. Because `pnpm install` never runs, the
pnpm store directory is never created.

That mismatch was latent while the cache key (hashed from the lockfile) kept
hitting: on a hit, setup-node restores the cache and skips the save. The Task 5
dependency work changed `pnpm-lock.yaml`, the key missed, and the post-run step
tried to save a store path that did not exist — failing the job.

## Repro steps

1. On a commit where the dependency-report job still had `cache: pnpm`
   (pre-`49d2227`), change anything in `pnpm-lock.yaml`.
2. Push and watch the `Dependency report` job: the audit step passes, then the
   `Post Run actions/setup-node` cache-save step errors on the missing pnpm
   store path and fails the job.

## Fix

Commit `49d2227` (`ci: drop pnpm cache from dependency-report job`) removed
`cache: pnpm` from that job's `setup-node` step. The cache was pure overhead
there — with no install, there is nothing to cache or restore.

## Verification

Dependency report job green on subsequent pushes, including ones that changed
the lockfile again (which is exactly the case that used to fail).

## Recurrence guardrail

Comments in `.github/workflows/ci.yml` on the dependency-report job state both
halves of the invariant: no `cache: pnpm` because the job never runs
`pnpm install`, and no `pnpm install` because audit only needs the lockfile.
Anyone re-adding one without the other has to argue with the comment explaining
why it fails.
