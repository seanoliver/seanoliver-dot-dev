'use client';

import { motion } from 'framer-motion';

/** Subtitle component */
export default function Subtitle({ description }: { description: string }) {
	// Animation for subtitle text (all at once)
	const container = {
		hidden: {
            y: 10,
            opacity: 0},
		show: { opacity: 1 },
	};

	return (
		<>
			<motion.h2
				className='text-2xl font-bold text-center text-gray-900 dark:text-gray-100'
				variants={container}
				initial='hidden'
				animate='show'>
				{description}
			</motion.h2>
		</>
	);
}
