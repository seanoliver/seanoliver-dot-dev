import {
  NEWSLETTER_CTA,
  type DistributionLink,
} from '@/components/writing-presentation'

import type { JSX } from 'react'

/**
 * Anchor for a `DistributionLink` (see `writing-presentation.ts`): a quiet
 * underlined link that opens the external distribution surface in a new tab.
 * Shared by the newsletter signup line and the per-entry email-edition link
 * so both distribution affordances render identically.
 */
export function DistributionLinkAnchor({
  link,
}: {
  link: DistributionLink
}): JSX.Element {
  return (
    <a
      href={link.href}
      target='_blank'
      rel='noopener noreferrer'
      className='underline underline-offset-4 hover:text-foreground transition-colors'
    >
      {link.label}
    </a>
  )
}

/**
 * Newsletter signup affordance: one muted line with a plain labeled link to
 * the public Substack home (`NEWSLETTER_CTA`). Deliberately not Substack's
 * iframe embed — the page must stay static and deterministic, and a quiet
 * text link matches the site's styling. Rendered in the /writing index
 * footer and the article footer.
 */
export function NewsletterSignup(): JSX.Element {
  return (
    <p className='text-xs text-muted-foreground'>
      Selected posts also go out by email.{' '}
      <DistributionLinkAnchor link={NEWSLETTER_CTA} />
    </p>
  )
}
