# Goodreads shelf parser drops every book whose RSS title isn't CDATA-wrapped

**Date:** 2026-07-11 **Branch:** main **Caught by:** user report — homepage
"Read" section showed the wrong books with no ratings or dates

## Symptom

The homepage Read section (top 3 books) showed one correct recent book
(Hard-Boiled Wonderland, ★★★★, 06 05 2026) followed by books with no rating and
no completion date (Harry Potter and the Cursed Child, The Paper Menagerie).
Recent reads like Flowers for Algernon (finished 06/13/2026, rated 5) were
missing entirely, even though it was the _most recent_ book on the shelf.

## Root cause

Goodreads' RSS feed (`/review/list_rss/<user>?shelf=read`) mixes two encodings
in the same feed: titles needing XML escaping arrive as
`<title><![CDATA[...]]></title>`, plain ones as
`<title>Flowers for Algernon</title>`. At time of fix, 39 of 100 items in the
feed used the plain form.

The parser in `src/app/api/goodreads/route.ts` matched titles only with
`/<title><!\[CDATA\[(.*?)\]\]><\/title>/` and returned `null` when it didn't
match, silently dropping every plain-title book — including most recent, dated,
rated reads.

A second defect made the survivors look worse: the sort comparator returned `0`
whenever either book lacked a `dateRead`. An inconsistent comparator leaves
undated books (a 2026-03-02 bulk import with no read dates or ratings — the
Harry Potter / Paper Menagerie items, which _are_ on the read shelf) floating
near the top in feed order instead of sinking below dated books.

## Repro steps

1. On main at 9ea3eaa, run
   `curl -A 'Mozilla/5.0' 'https://www.goodreads.com/review/list_rss/<GOODREADS_USER_ID>?shelf=read'`
   and observe both `<title><![CDATA[...]]></title>` and plain
   `<title>...</title>` items.
2. `pnpm dev`, then `curl http://localhost:3000/api/goodreads`.
3. Observe plain-title books (e.g. Flowers for Algernon) absent from `books`,
   and undated/unrated books near the top of the list.

## Fix

Extracted parsing into `src/lib/goodreads.ts` (`parseReadShelf`,
`parseCurrentlyReadingShelf`) with an `extractTag` helper whose regex accepts
both CDATA and plain-text tag content (decoding XML entities for the plain
form). The route now just fetches and delegates. Extraction (vs. patching
regexes in the route) makes the parser unit-testable without mocking `fetch`.

Two follow-on decisions after Sean reviewed:

- Shelf entries without a `user_read_at` are excluded from display entirely
  (rather than sorted last) — the 2026-03-02 bulk import put ~96 undated,
  unrated entries on the read shelf that he doesn't consider read, and the
  parser can't otherwise distinguish them from finished books. Tradeoff: a
  future finished book with no read date set won't appear.
- The route fetches read-shelf RSS pages 1 and 2 (Goodreads caps each page at
  100 items, sorted by date added). The bulk import fills nearly all of page 1,
  so only 4 dated reads were visible there; the rest of the real reading history
  lives on page 2. Books are merged across pages, sorted by read date, and
  capped at 30 after filtering.

## Verification

- `pnpm test:unit` — 81 passed, including 9 new tests in
  `src/lib/goodreads.test.ts` covering plain titles, CDATA titles, mixed feeds,
  entity decoding, undated-entry exclusion, multi-page merge, and sort order.
- `pnpm typecheck` clean (after clearing stale `.next` type stubs left from the
  posts→writing rename).
- Live check: `pnpm dev` + `curl /api/goodreads` returned 30 dated, rated books
  ordered Flowers for Algernon (5★, 06/13) → Hard-Boiled Wonderland (4★, 06/05)
  → The Ministry for the Future (2★, 05/08) → …, with no undated bulk-import
  entries in the list.

## Recurrence guardrail

`src/lib/goodreads.test.ts` fixtures include a plain-text-title item and a
mixed-encoding feed; if a future edit reintroduces a CDATA-only regex, those
tests fail. A comment on `extractTag` documents that Goodreads mixes both
encodings in a single feed.
