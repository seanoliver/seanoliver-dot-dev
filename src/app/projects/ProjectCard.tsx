import {
	Card,
	CardTitle,
	CardDescription,
	CardTags,
	CardTag,
} from '@/components/cards';

import { Project } from '@/lib/types';

export default function ProjectCard({ project }: {project: Project}): JSX.Element {
	return (
		<Card>
			<CardTitle>{project.name}</CardTitle>
			<CardDescription>{project.description}</CardDescription>
			<CardTags>
				{project.tags.map((tag:string, index:number) => (
					<CardTag key={`${tag}-${index}`}>{tag}</CardTag>
				))}
			</CardTags>
		</Card>
	);
}
