import { EXPERIENCES } from '@/lib/constants'
import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { UnderLink } from '@/components/under-link'

export default function ExperienceContent(props?: {
  limit?: number
  href?: string
}): JSX.Element {
  const { limit, href } = props ?? {}
  const displayExperiences = limit ? EXPERIENCES.slice(0, limit) : EXPERIENCES
  const hasMore = limit != null && EXPERIENCES.length > limit

  const items: ListItem[] = displayExperiences.map((experience) => ({
    key: experience.company,
    left: <UnderLink href={experience.url}>{experience.company}</UnderLink>,
    right: experience.date,
  }))

  return (
    <Section title='Experience' href={href} hasMore={hasMore}>
      <List items={items} />
    </Section>
  )
}
