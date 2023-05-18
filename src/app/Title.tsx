'use client';

import { motion } from 'framer-motion';

/** Title component */
export default function Title({
	title
}: {
	title: string
}) {

	// Animation for the title
	const container = {
		hidden: { opacity: 1 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.3,
			},
		},
	};

	// Animation for each letter
	const item = {
		hidden: { y: 10, opacity: 0 },
		show: { y: 0, opacity: 1 },
	};

	return (
		<>
			<motion.h1
				className='text-4xl font-bold text-center text-gray-900 dark:text-gray-100'
				variants={container}
				initial='hidden'
				animate='show'>
				{title.split('').map((letter, index) => (
					<motion.span
						className='inline-block'
						key={`${letter}-${index}`}
						variants={item}>
						{letter === ' ' ? '\u00A0' : letter}
					</motion.span>
				))}
			</motion.h1>
		</>
	);
}
