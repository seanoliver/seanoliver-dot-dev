# Blog Pipeline and Substack Investigation

## Context

The personal site uses Next.js, local MDX, Contentlayer, and Vercel. The goal of
the spike was to assess maintainability, support long and short writing, and
connect publishing to the existing Substack newsletter without introducing a
browser CMS.

## Key findings

- Contentlayer states that it is no longer maintained. The installed
  `next-contentlayer` peer range ends at Next 13 while the site uses Next 14.
- The Git/MDX authoring model remains appropriate; the problem is the missing
  content boundary and inconsistent publication rules.
- A draft MDX entry is publicly reachable in production because the route does
  not reject unpublished content.
- Sitemap URLs use `/posts/<slug>` while real post routes are `/<slug>`.
- Open Graph image URLs currently resolve with an empty title.
- The post index imports all compiled MDX into a client hook and appears only
  after hydration.
- TypeScript and lint pass on the baseline commit, but there is no test suite,
  CI workflow, or required branch check.
- The production dependency audit reports known critical and high advisories;
  counts include transitive and potentially unreachable paths, so they are an
  upgrade signal rather than proof of exploitability.
- Vercel already creates Preview and Production deployments through its GitHub
  integration.
- Substack has no supported API for creating and emailing publication posts. RSS
  import is an explicit import flow, not continuous syndication. Notes do not
  email subscribers individually.

## How the current system works

Contentlayer scans `posts/*.mdx`, validates one `Post` type, compiles MDX, and
generates `allPosts`. Routes, a client hook, RSS, and sitemap import that raw
collection independently. Publication filtering and URL construction are
repeated rather than owned by one module. Vercel deploys the Git repository.

## Gotchas

- A migration that combines Contentlayer removal with Next and React major
  upgrades will make failures difficult to localize.
- A security audit cannot be a required green check until the existing known
  advisories are addressed or explicitly evaluated.
- Browser tests must avoid relying on Goodreads or other live third-party
  services.
- Mirroring full content to Substack can drift from the canonical evergreen
  copy; selected email editions should link back to the site.
- Next 15 introduces async request APIs; Next 16 removes synchronous
  compatibility and removes `next lint`.

## References

- Contentlayer repository: https://github.com/contentlayerdev/contentlayer
- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- Next.js 15 upgrade guide:
  https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js 16 upgrade guide:
  https://nextjs.org/docs/app/guides/upgrading/version-16
- React 19 upgrade guide:
  https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- Substack Developer API:
  https://support.substack.com/hc/en-us/articles/45099095296916-Substack-Developer-API
- Substack Notes guide:
  https://support.substack.com/hc/en-us/articles/14564821756308-Getting-started-on-Substack-Notes
- Approved design: `docs/plans/2026-07-10-blog-platform-modernization-design.md`
