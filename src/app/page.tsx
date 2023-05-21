import Title from '@/components/Title';
import { ProfilePic } from '@/components/images';
import { metadata } from '@/app/layout';

export default function Home(): JSX.Element {
	return (
		<>
			<div className='Home-image mb-5'>
				<ProfilePic />
			</div>
			<Title title={metadata.title} />
			<Title
				title={metadata.description}
				titleSize='text-2xl'
			/>
		</>
	);
}
