'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import Title from '@/components/Title';
import { SOCIAL_LINKS } from '@/lib/globals';

/** About me metadata */
const metadata = {
	title: 'Sean Oliver',
	description: 'Software Engineer in San Francisco, CA',
	longDescription: `I'm a software engineer and recovering
	product marketer with 13 years of experience building and growing
	technology products. My background in marketing helps me understand
	people's needs and how to communicate with them. Now as a software
	engineer, I build products that meet those needs.`,
};

const bodyVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0 },
};

/**
 * About me page
 * @returns About me page
 * @example
 * <About />
 * @see https://seanoliver.dev/about
 */
export default function About(): JSX.Element {
	return (
		<section id='about'>
			<div className='About flex flex-col mx-auto'>
				<Title title={metadata.title} />
				<div className='flex'>
					{/* <PhotoLockup /> */}
					<motion.p
						variants={bodyVariants}
						initial='hidden'
						animate='visible'
						transition={{ duration: 0.75 }}
						className={`mt-4`}>
						{metadata.longDescription}
					</motion.p>
				</div>
				<SocialLinks />
			</div>
		</section>
	);
}

const variants = {
	hidden: { opacity: 0, y: 100 },
	visible: { opacity: 1, y: 0 },
};

const PhotoLockup = () => {
	return (
		<motion.div
			className={`relative rounded-xl overflow-auto p-8 md:block`}
			style={{ minWidth: 'max-content' }}>
			<div className='overflow-visible relative max-w-sm mx-auto pt-5 bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col items-center dark:bg-slate-700 dark:highlight-white/5'>
				<ProfilePic />
				<div className='flex flex-col p-5 text-center'>
					<strong className='text-slate-900 text-sm font-medium dark:text-slate-200'>
						Hi, I&apos;m Sean
					</strong>
				</div>
			</div>
		</motion.div>
	);
};

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

const SocialLinks = (): JSX.Element => {
	return (
		<div className='About-social-icons flex flex-row justify-center mt-10'>
			{SOCIAL_LINKS.map((link, index) => (
				<motion.a
					variants={variants}
					initial='hidden'
					animate='visible'
					transition={{ delay: 0.1 + index * 0.1 }}
					key={`${link.name}-${index}`}
					className={`About-social-link text-2xl m-5`}
					href={link.url}
					target='_blank'
					rel='noopener noreferrer'>
					{link.icon}
				</motion.a>
			))}
		</div>
	);
};
