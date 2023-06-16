import Projects from './projects/page';
import About from './about/page';
import Experiences from './experiences/page';
import SiteNav from '../components/navigation';

export default function Home(): JSX.Element {
	return (
		<div className='Home flex h-screen'>
			<SiteNav />
			{/* <div className='snap-section'><About /></div>
			<div className='snap-section'><Projects /></div>
			<div className='snap-section'><Experiences /></div> */}
		</div>
	);
}
