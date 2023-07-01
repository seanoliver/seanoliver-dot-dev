import {
	FaTwitter as TwitterIcon,
	FaGithub as GitHubIcon,
	FaLinkedin as LinkedInIcon,
	FaInstagram as InstagramIcon,
} from 'react-icons/fa';
import { Project } from '@/lib/types';

export const NAV_ITEMS = [
	{
		name: 'About',
		url: '#about',
	},
	{
		name: 'Projects',
		url: '#projects',
	},
	{
		name: 'Experience',
		url: '#experiences',
	},
	{
		name: 'Newsletter',
		url: 'https://newsletter.seanoliver.dev/',
	},
];

export const SOCIAL_LINKS = [
	{
		name: 'Twitter',
		url: 'https://twitter.com/SeanOliver',
		icon: <TwitterIcon />,
	},
	{
		name: 'GitHub',
		url: 'https://github.com/SeanOliver',
		icon: <GitHubIcon />,
	},
	{
		name: 'LinkedIn',
		url: 'https://www.linkedin.com/in/theseanoliver/',
		icon: <LinkedInIcon />,
	},
	{
		name: 'Instagram',
		url: 'https://www.instagram.com/theseanoliver/',
		icon: <InstagramIcon />,
	},
];

export const PROJECTS: Project[] = [
	{
		name: 'SeanOliver.dev',
		url: 'https://seanoliver.dev',
		description: 'My personal website built with Next.js and Tailwind CSS.',
		image: '/images/projects/seanoliver.dev.png',
		tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
	},
	{
		name: 'Sharebnb',
		url: 'https://sharebnb.vercel.app',
		description:
			'A clone of Airbnb for sharing remarkable outdoor spaces. Express backend with Next.js and React on the frontend.',
		image: '/images/projects/sharebnb.png',
		tags: ['Next.js', 'React', 'Express', 'JavaScript', 'AWS', 'PostgreSQL'],
	},
	{
		name: 'Warbler',
		url: 'https://warbler.vercel.app',
		description: 'A Twitter clone built with Flask.',
		image: '/images/projects/warbler.png',
		tags: ['Flask', 'PostgreSQL', 'JavaScript'],
	},
	{
		name: 'Jobly',
		url: 'https://jobly.vercel.app',
		description: 'A job board built with React and Express.',
		image: '/images/projects/jobly.png',
		tags: ['React', 'Express', 'JavaScript', 'PostgreSQL'],
	},
	{
		name: 'TheraGPT v1',
		url: 'https://theragpt.ai',
		description:
			"A web app using OpenAI's GPT-3 to help people reframe negative thoughts.",
		image: '/images/projects/theragpt.png',
		tags: ['Flask', 'OpenAI', 'JavaScript'],
	},
];

export const EXPERIENCES = [
	{
		title: 'Senior Product Marketing Manager',
		company: 'Block, Inc.',
		logo: '/images/companies/block.png',
		date: '2021 - 2023',
		description: 'Led product marketing for Square Staff\'s new communication product, powered by the Crew app.',
	},
	{
		title: 'Director of Marketing',
		company: 'Crew',
		logo: '/images/companies/crew.png',
		date: '2019 - 2021',
		description: 'Expanded and directed a marketing team that significantly grew the customer base, launched numerous features, and executed webinars to boost new ARR and renewals.',
	},
	{
		title: 'Senior Manager, Product Marketing',
		company: 'Lyft',
		logo: '/images/companies/lyft.png',
		date: '2015 - 2019',
		description: 'Spearheaded product marketing efforts, coordinating with various product and engineering teams, and introduced high-impact features like Scheduled Rides.',
	},
	{
		title: 'Senior Product Marketing Manager',
		company: 'Optimizely',
		logo: '/images/companies/optimizely.png',
		date: '2013 - 2015',
		description: 'Introduced a framework for product adoption measurement, launched numerous products, and executed successful in-product marketing strategies.',
	},
	{
		title: 'Product Marketing Manager',
		company: 'LinkedIn',
		logo: '/images/companies/linkedin.png',
		date: '2012 - 2013',
		description: 'Implemented campaigns to activate lapsed users and improve user acquisition, while refining email marketing strategies for higher user engagement.',
	},
	{
		title: 'Product Manager',
		company: 'Microsoft',
		logo: '/images/companies/microsoft.png',
		date: '2009 - 2012',
		description: 'Managed product marketing for Windows Channel & Partner Marketing, significantly increasing sales and consumer impressions across stores.',
	},
];
