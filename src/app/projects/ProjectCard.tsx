import {
	Card,
	CardTitle,
	CardDescription,
	CardTags,
	CardTag,
} from '@/components/cards';

export default function ProjectCard({ project }): JSX.Element {
	return (
		<Card>
			<CardTitle>{project.name}</CardTitle>
			<CardDescription>{project.description}</CardDescription>
			<CardTags>
				{project.tags.map((tag, index) => (
					<CardTag key={`${tag}-${index}`}>{tag}</CardTag>
				))}
			</CardTags>
		</Card>
	);
}
