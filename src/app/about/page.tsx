'use client';

import Section from '@/components/Section';
import Title from '@/components/Title';
import { CardTag, CardTags } from '@/components/cards';
import { Badge } from '@/components/ui/badge';
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
 * About me page
 * @returns About me page
 * @example
 * <About />
 */
export default function About(): JSX.Element {
	return <div>{metadata.longDescription}</div>;
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
