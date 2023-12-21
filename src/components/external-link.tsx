import Link from 'next/link'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

export default function ExternalLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`${className} font-medium text-primary underline underline-offset-4 hover:no-underline`}
      target='_blank'
    >
      {children} <ArrowTopRightIcon className='inline w-4 h-4' />
    </Link>
  )
}
