import Link from 'next/link'
/**
 * Custom link component for use on about page
 * Extends Next.js Link component
 * @param href - Link href
 * @param children - Link children
 * @returns Custom link component
 */
export const UnderLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}): JSX.Element => {
  // If the link is an external link, open in new tab
  let isExternal = href.startsWith('http') ? true : false

  return (
    <Link
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:no-underline"
      target={isExternal ? '_blank' : '_self'}
    >
      {children}
    </Link>
  )
}
