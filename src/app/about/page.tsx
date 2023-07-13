'use client';

import { SOCIAL_LINKS } from '@/lib/globals';
import Link from 'next/link';

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

const myStack = [
	'React',
	'Next.js',
	'Node.js',
	'Typescript',
	'Javascript',
	'SQL',
	'Python',
	'Flask',
	'HTML',
	'CSS',
	'Sass',
	'PostgreSQL',
	'AWS S3',
	'Electron',
	'Git',
	'GitHub',
];

/**
 * Custom link component for use on about page
 * Extends Next.js Link component
 * @param href - Link href
 * @param children - Link children
 * @returns Custom link component
 */
const AboutLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<Link
			href={href}
			className='font-medium text-primary underline underline-offset-4 hover:no-underline'
			target='_blank'>
			{children}
		</Link>
	);
};

/**
 * About me page
 * @returns About me page
 * @example
 * <About />
 */
export default function About(): JSX.Element {
	return (
		<div className='About'>
			<p className='leading-7 [&:not(:first-child)]:mt-6'>
				I’m a software engineer and former product marketer who loves building
				and growing technology products that delight users. I have 13 years of
				experience at leading companies like{' '}
				<AboutLink href='https://www.microsoft.com/'>Microsoft</AboutLink>,{' '}
				<AboutLink href='https://www.linkedin.com/'>LinkedIn</AboutLink>,{' '}
				<AboutLink href='https://www.lyft.com/'>Lyft</AboutLink>, and{' '}
				<AboutLink href='https://www.block.xyz/'>Block</AboutLink>.
			</p>
			<p className='leading-7 [&:not(:first-child)]:mt-6'>
				My background in marketing and growth has taught me that the best
				marketing is a product that prioritizes users’ needs above all else and
				then meets those needs in ways that feel natural and effortless.
			</p>
			<p className='leading-7 [&:not(:first-child)]:mt-6'>
				In 2023, I traded my full-time job in marketing for a seat at{' '}
				<AboutLink href='https://rithmschool.com'>Rithm School</AboutLink>, a
				16-week software engineering bootcamp that taught me how to program—not
				how to code. In addition to{' '}
				<AboutLink href='https://www.typescriptlang.org/'>TypeScript</AboutLink>{' '}
				and <AboutLink href='https://www.python.org/'>Python</AboutLink>, it
				taught me how to create strategically and how to evaluate technical
				tradeoffs.
			</p>
			<p className='leading-7 [&:not(:first-child)]:mt-6'>
				I have a{' '}
				<AboutLink href='https://newsletter.seanoliver.dev/'>
					newsletter
				</AboutLink>
				{' '}where I write about programming, productivity, personal knowledge
				management.
			</p>
			<p className='leading-7 [&:not(:first-child)]:mt-6'>
				I live in San Francisco, CA with my amazing wife, two children, and our
				3.5 lbs dog named Pixel (no relation to the phone). I love productivity
				tools and systems, personal knowledge management, artificial
				intelligence, tennis, and casual mobile games.
			</p>
		</div>
	);
	// (
	// 	<Section
	// 		title='About'
	// 		className={className}>
	// 		{metadata.longDescription}
	// 	</Section>
	// <section
	// 	id='about'
	// 	className={className}>
	// 	<div>About</div>
	// 	<div>Some information about me here.</div>
	// 	{/* <div className='About'>
	// 		<Title title='About Me' />
	// 		<div className='flex justify-center gap-8'>
	// 			<div className={`mt-4 w-1/4 p-5 rounded-lg`}>
	// 				<Title title='Get to know me!' titleSize='small' />
	// 				{metadata.longDescription}
	// 			</div>
	// 			<div className={`mt-4 w-1/4 p-5 rounded-lg`}>
	// 				<Title title='My Stack' titleSize='small' />
	// 					{myStack.map((tag, index) => (
	// 						<Badge className={`m-1`} variant={'outline'} key={index}>{tag}</Badge>
	// 					))}
	// 			</div>
	// 		</div>
	// 		<SocialLinks />
	// 	</div> */}
	// </section>

	// );
}

const SocialLinks = (): JSX.Element => {
	return (
		<div className='About-social-icons flex flex-row justify-center mt-10'>
			{SOCIAL_LINKS.map((link, index) => (
				<a
					key={`${link.name}-${index}`}
					className={`About-social-link text-2xl m-5`}
					href={link.url}
					target='_blank'
					rel='noopener noreferrer'>
					{link.icon}
				</a>
			))}
		</div>
	);
};
