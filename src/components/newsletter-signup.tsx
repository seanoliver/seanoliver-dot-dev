import { NEWSLETTER_CTA } from '@/components/writing-presentation'

import type { JSX } from 'react'

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
      <a
        href={NEWSLETTER_CTA.href}
        target='_blank'
        rel='noopener noreferrer'
        className='underline underline-offset-4 hover:text-foreground transition-colors'
      >
        {NEWSLETTER_CTA.label}
      </a>
    </p>
  )
}
