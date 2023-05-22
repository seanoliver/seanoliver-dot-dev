import Projects from './projects/page';
import About from './about/page';
import Experiences from './experiences/page';

export default function Home(): JSX.Element {
	return (
		<div className='Home mb-5 flex flex-col gap-8'>
			<About />
			<Projects />
			<Experiences />
		</div>
	);
}
