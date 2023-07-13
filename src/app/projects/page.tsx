'use client';

import { PROJECTS } from '@/lib/globals';
import ProjectCard from './ProjectCard';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects(): JSX.Element {
	return (
		<div className=''>
			{PROJECTS.map((project, index) => (
				<Card
					key={`${project.name}-${index}`}
					className='mb-4 rounded-md hover:transition-shadow hover:shadow-lg'>
					<CardHeader>
						<CardTitle className='flex items-center'>
							{project.name}{' '}
							<Button variant='link' className='pl-2 pr-1' asChild>
								<Link href={project.github} target='_blank'><GitHubLogoIcon /></Link>
							</Button>{' '}
							<Button variant='link' className='px-1' asChild>
								<Link href={project.url} target='_blank'><ExternalLinkIcon /></Link>
							</Button>
						</CardTitle>
						<CardDescription className='leading-7'>{project.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<AspectRatio ratio={7 / 3}>
							<Image
								src={project.image}
								alt={project.name}
								className='object-cover rounded-lg'
								width={700}
								height={300}
							/>
						</AspectRatio>
					</CardContent>
					{/* <Separator className='mb-6' /> */}
					<CardFooter className='flex flex-wrap'>
						{project.tags.map((tag, idx) => (
							<Badge
								key={`${tag}-${idx}`}
								className='mr-2 mb-2'
								variant={'secondary'}>
								{tag}
							</Badge>
						))}
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
