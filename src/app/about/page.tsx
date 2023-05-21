import { ProfilePic } from "@/components/images";
import Title from "@/components/Title";
import { metadata } from "@/app/layout";

export default function About(): JSX.Element {
	return (
		<div className='About flex justify-center'>
			<div className='About-body text-left sm:w-1/2'>
				<Title title={metadata.title} />
				<p className={`mt-4`}>{metadata.longDescription}</p>
			</div>
		</div>
	);
}
