import { ProfilePic } from "@/components/images";
import Title from "@/components/Title";
import { metadata } from "@/app/layout";

export default function About(): JSX.Element {
	return (
		<div className='About flex flex-col items-center justify-between w-full h-screen'>
			<div className='About-body flex flex-col items-center p-10'>
				<div className='About-image mb-5'>
					<ProfilePic />
				</div>
				<Title title={metadata.title} />
				<Title
					title={metadata.description}
					titleSize='text-2xl'
				/>
			</div>
		</div>
	);
}
