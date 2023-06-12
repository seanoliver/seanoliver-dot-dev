import { PROJECTS } from '@/lib/globals';
import ProjectCard from './ProjectCard';
import Title from '@/components/Title';

export default function Projects(): JSX.Element {
	return (
		<section id='projects'>
			<div
				className='md:flex md:flex-col items-center w-full h-full'>
				<Title title='Projects' titleSize='medium' />
				{PROJECTS.map((project, index) => (
					<div
						key={`${project.name}-${index}`}>
						<ProjectCard project={project} />
					</div>
				))}
			</div>
		</section>
	);
}