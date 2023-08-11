import { SOCIAL_LINKS } from '@/lib/constants'
import ExternalLink from './external-link'

export default function Socials(): JSX.Element {
  return (
    <>
      {SOCIAL_LINKS.map((link, index) => (
        <ExternalLink key={index} className="px-2" href={link.url}>
          {link.name}
        </ExternalLink>
      ))}
    </>
  )
}
