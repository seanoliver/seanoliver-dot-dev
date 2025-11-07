'use client'

import { EXPERIENCES } from '@/lib/constants'
import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { UnderLink } from '@/components/under-link'

export default function Experience({ limit, href }: { limit?: number; href?: string } = {}): JSX.Element {
  const displayExperiences = limit ? EXPERIENCES.slice(0, limit) : EXPERIENCES

  const items: ListItem[] = displayExperiences.map((experience, idx) => ({
    key: idx,
    left: <UnderLink href={experience.url}>{experience.company}</UnderLink>,
    right: experience.date,
  }))

  return (
    <Section title='Experience' href={href}>
      <List items={items} />
    </Section>
  )
}
