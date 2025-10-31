'use client'

import { EXPERIENCES } from '@/lib/constants'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  OptimizedAvatar,
  OptimizedAvatarFallback,
  OptimizedAvatarImage,
} from '@/components/optimized-avatar'
import Section from '@/components/Section'

export default function Experience(): JSX.Element {
  return (
    <Section title='Experience'>
      {EXPERIENCES.map((experience, index) => (
        <Card
          key={index}
          className='mb-4 rounded-md hover:transition-shadow hover:shadow-lg'
        >
          <CardHeader className='flex flex-row justify-between'>
            <div className='flex items-center gap-4'>
              <OptimizedAvatar>
                <OptimizedAvatarImage
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                />
                <OptimizedAvatarFallback>
                  {experience.company[0]}
                </OptimizedAvatarFallback>
              </OptimizedAvatar>
              <div>
                <CardTitle>{experience.company}</CardTitle>
                {/* <CardDescription>{experience.title}</CardDescription> */}
              </div>
            </div>
            <div className='hidden md:block'>
              <Badge variant='secondary'>{experience.date}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className='leading-7'>
              {experience.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </Section>
  )
}
