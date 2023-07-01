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
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function Projects(): JSX.Element {
	return (
		<div className=''>
			{PROJECTS.map((project, index) => (
				<Card
					key={`${project.name}-${index}`}
					className='mb-4 rounded-sm'>
					<CardHeader>
						<CardTitle className='flex items-center'>
							{project.name} <GitHubLogoIcon className='ml-2 w-4 h-4' /> <ExternalLinkIcon className='ml-2 w-4 h-4' />
						</CardTitle>
						<CardDescription>{project.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<AspectRatio ratio={7 / 3}>
							<Image
								src='https://placehold.co/700x300'
								alt='placeholder'
								className='object-cover rounded-sm'
								width={700}
								height={300}
							/>
							{/* <img src={project.image} alt={project.name} /> */}
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