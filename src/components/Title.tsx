'use client';

import { motion } from 'framer-motion';

const titleVariants = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};

/**
 *
 * @param title Title text to display
 * @param titleSize Size of the title
 * @returns A title with the given text and size
 * @example
 * <Title title='My Title' titleSize='large' />
 */
export default function Title({
	title,
	titleSize = 'large',
}: {
	title: string;
	titleSize?: 'large' | 'medium' | 'small';
}) {

	const titleStyles = {
		'large': 'text-4xl font-extrabold',
		'medium': 'text-3xl font-bold',
		'small': 'text-2xl font-semibold',
	}
	return (
		<>
			<motion.h1
				variants={titleVariants}
				initial='hidden'
				animate='visible'
				transition={{ duration: 0.75 }}
				className={`
				${titleStyles[titleSize]} ${titleSize === 'small' ? 'text-left' : 'text-center'} p-2 mb-4
				bg-clip-text text-transparent
				bg-gradient-to-r from-zinc-600 to-slate-600 text-black
				dark:bg-gradient-to-r dark:from-stone-300 dark:to-slate-300 dark:text-white
				px-2`}>
				{title}
			</motion.h1>
		</>
	);
}
