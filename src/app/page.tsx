'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import About from './about/page';
import Projects from './projects/page';
import Experiences from './experiences/page';

export default function Home(): JSX.Element {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className='Home flex flex-col'>
			<About />
			<Projects />
			<Experiences />
		</div>
	);
}

const ProfilePic = () => {
	return (
		<Image
			className={`flex -left-6 w-24 h-24 rounded-full shadow-lg`}
			src='/../public/profile.jpeg'
			width={96}
			height={96}
			alt='Sean Oliver'
		/>
	);
};
