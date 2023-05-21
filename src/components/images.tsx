import Image from 'next/image';

export const ProfilePic = () => {
	return (
		<div className='ProfilePic relative w-80 h-80'>
		<Image
			className='rounded-full'
			src='https://placehold.co/80x80'
			alt='Sean Oliver'
			width={400}
			height={400}
			priority={true}
		/>
		</div>
	);
};
