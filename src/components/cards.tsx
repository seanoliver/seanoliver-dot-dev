'use client';

import '@/app/globals.css';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CardWrapperProps } from '@/lib/types';

/**
 * Adds a gradient border around the card.
 * FIXME: Not sure where to actually use this yet.
 *
 * @param children
 * @returns A card box
 * @example
 * <CardBox>
 * 	<Card />
 * </CardBox>
 */
export const CardBox = ({ children }: CardWrapperProps) => {
	return (
		<div
			className={`
            ProjectCard-border-gradient
            flex align-middle justify-center
            bg-gradient-to-r from-indigo-600 to-pink-500
            rounded-lg
            p-[0.25rem]
            `}>
			{children}
		</div>
	);
};

/**
 * This component is a wrapper for the card content. It provides a
 * consistent style for the card content.
 *
 * Includes a fade-in animation.
 *
 * @param children The content of the card
 * @returns A card
 * @example
 * <Card>
 * 	<CardTitle />
 * 	<CardSubtitle />
 * 	<CardContent />
 * </Card>
 */
export const Card = ({ children }: CardWrapperProps) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<motion.div
			className={`
                dark:bg-slate-800 bg-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-900
                transition-all duration-200 rounded-lg p-6
                sm:w-[32rem] w-full
                shadow-lg
                mb-4`}
			ref={ref}
			// initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ ease: 'linear', duration: 1 }}>
			{children}
		</motion.div>
	);
};

/**
 * This component returns the title of the card.
 *
 * @param children The title of the card
 *
 * @returns The title of the card
 * @example
 * <CardTitle>My Project</CardTitle>
 */
export const CardTitle = ({ children }: CardWrapperProps) => {
	return (
		<div className={`mb-4 flex items-center`}>
			<h2
				className={`
                    dark:text-slate-200 text-slate-800
                    text-xl font-semibold
                    hover:text-slate-900 dark:hover:text-slate-100
                    transition-colors duration-200 animate-fade-in-down
                    `}>
				{children}
			</h2>
			<div className={`title-line bg-slate-500 ml-5`} />
		</div>
	);
};

/**
 * This component returns the subtitle of the card.
 * @param children The subtitle of the card
 *
 * @returns
 * @example
 * <CardSubtitle>My Project</CardSubtitle>
 */
export const CardSubtitle = ({ children }: CardWrapperProps) => {
	return (
		<div className={`mb-4 flex justify-between`}>
			<h3
				className={`
                    dark:text-slate-400 text-slate-500
                    font-extralight
                    hover:text-slate-600 dark:hover:text-slate-300
                    transition-colors duration-200 animate-fade-in-down

                `}>
				{children}
			</h3>
			<p className={`text-sm text-slate-500 font-extralight`}>2000 - 2005</p>
		</div>
	);
};

/**
 * Wrapper for the description of the card.
 *
 * @param children
 * @returns The formatted description of the card
 * @example
 * <CardDescription>My Project</CardDescription>
 */
export const CardDescription = ({ children }: CardWrapperProps) => {
	return (
		<div className={`mb-4`}>
			<p
				className={`
                    dark:text-slate-400 text-slate-500
                    transition-colors duration-200 animate-fade-in-down
                `}>
				{children}
			</p>
		</div>
	);
};

/**
 * Wrapper for styling the tags of the card.
 * @param children The tags of the card
 * @returns The formatted tags of the card
 * @example
 * <CardTags>
 * 	<CardTag>My Tag</CardTag>
 * </CardTags>
 */
export const CardTags = ({ children }: CardWrapperProps) => {
	return <div className={`flex flex-wrap`}>{children}</div>;
};

/**
 * This component returns the tag of the card.
 *
 * @param children The tag of the card
 * @returns The formatted tag of the card
 * @example
 * <CardTag>My Tag</CardTag>
 */
export const CardTag = ({ children }: CardWrapperProps) => {
	return (
		<div>
			<span
				className={`
                    dark:bg-slate-600 dark:text-slate-200
                    inline-block
                    bg-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500
                    rounded-full px-3 py-1
                    text-sm font-semibold
                    text-slate-700 hover:text-slate-800 dark:hover:text-slate-100
                    mr-2 mb-2
                    transition-colors duration-200 animate-fade-in-down
                `}>
				{children}
			</span>
		</div>
	);
};
