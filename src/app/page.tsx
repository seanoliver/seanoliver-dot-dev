import Title from '@/components/Title';
import { ProfilePic } from '@/components/images';
import { metadata } from '@/app/layout';
import ProjectCard from './projects/ProjectCard';
import Projects from './projects/Projects';
import About from './about/page';

export default function Home(): JSX.Element {
	return (
		<div className='Home mb-5 flex flex-col gap-8'>
			<About />
			<Projects />
		</div>
	);
}
