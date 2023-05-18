import Title from '../app/Title';
import Subtitle from '../app/Subtitle';
import { ProfilePic } from './components/images';
import { metadata } from '../app/layout';
import Image from 'next/image';

export default function Home(): JSX.Element {
	return (
		<div className='Home flex flex-col items-center justify-center w-full h-screen'>
			<div className='Home-image mb-5'><ProfilePic /></div>
			<Title title={metadata.title} />
			<Subtitle description={metadata.description} />
		</div>
	);
}
