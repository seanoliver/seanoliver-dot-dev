import Image from 'next/image';

export const ProfilePic = () => {
	return (
		<div className='ProfilePic relative w-40 h-40'>
		<Image
			className='rounded-full'
			src='https://placehold.co/40x40'
			alt='Sean Oliver'
			width={400}
			height={400}
		/>
		</div>
	);
};
