# /api/og returns 500 in production

**Date:** 2026-10-07 **Branch:** fix/gsc-indexing-errors **Caught by:** Google
Search Console alert ("Server error (5xx)"), tracked as issue #16

## Symptom

`GET https://www.seanoliver.dev/api/og` and `/api/og?title=...` returned 500 on
every request. Every page's `og:image` points at this route, so Google crawled
the image URLs, got 500s, and reported them as indexing errors. Social previews
had no image.

## Root cause

The route fetched the avatar from a hardcoded dev URL with no environment check:

```ts
const response = await fetch('http://localhost:3000/profile.jpeg')
```

Nothing listens on localhost:3000 in a Vercel function, so the fetch threw and
the handler returned 500. The font and background URLs a few lines below were
switched on `NODE_ENV`, and that made the avatar line look switched too.

Fixing the fetch exposed a second bug: the background was
`shattered-island.gif`, and Satori (the renderer behind `ImageResponse`) does
not decode GIFs. The background silently disappeared, leaving `#F5F6F7` title
text on a `#f5f6f7` background. The title was invisible.

## Repro steps

1. Check out `main` at `676893b`.
2. `curl -s -o /dev/null -w '%{http_code}' https://www.seanoliver.dev/api/og`
   prints `500`.
3. Locally, change the avatar fetch to use the request origin, then
   `pnpm build && pnpm start` and request `/api/og?title=Test`. The PNG has an
   avatar but no visible title or background.

## Fix

- Every asset URL is now built from the request: `new URL(path, request.url)`.
  That works on localhost, preview deployments and production with no
  environment branching.
- Removed `runtime = 'edge'`. The Edge runtime is deprecated on Vercel, and the
  route uses `Buffer`, which belongs to Node.
- Converted the background pattern to `public/patterns/shattered-island.png` and
  deleted the GIF.
- Made the card's base color dark (`#2a2b33`), so the light title text stays
  readable even if the background fails to load.

## Verification

- Ran `pnpm build && pnpm start` locally and requested `/api/og?title=...` and
  `/api/og` with no title. Both returned 200 `image/png`, and the rendered PNG
  shows the pattern, the title and the avatar.
- `pnpm test:e2e` passes 18/18, including the new `/api/og` smoke test.
  `pnpm lint`, `pnpm typecheck` and `pnpm test:unit` also pass.

## Recurrence guardrail

`tests/e2e/publishing.spec.ts` has the test "/api/og renders a PNG, with and
without a title". It runs against `pnpm start` and asserts a 200 `image/png`
response. A hardcoded host that doesn't resolve makes that test fail. A
background asset Satori can't decode does not make it fail. Look at the rendered
PNG when you change the design.
