import { FaTwitter as TwitterIcon, FaGithub as GitHubIcon, FaLinkedin as LinkedInIcon } from 'react-icons/fa'

export const NAV_ITEMS = [
    {
        name: 'Home',
        url: '/'
    },
    {
        name: 'About',
        url: '/about'
    },
    {
        name: 'Projects',
        url: '/projects'
    },
    {
        name: 'Newsletter',
        url: 'https://newsletter.seanoliver.dev/'
    }
]

export const SOCIAL_LINKS = [
    {
        name: 'Twitter',
        url: 'https://twitter.com/SeanOliver',
        icon: <TwitterIcon />
    },
    {
        name: 'GitHub',
        url: 'https://github.com/SeanOliver',
        icon: <GitHubIcon />
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/theseanoliver/',
        icon: <LinkedInIcon />
    }
]

export const PROJECTS = [
    {
        name: 'SeanOliver.dev',
        url: 'https://seanoliver.dev',
        description: 'My personal website built with Next.js and Tailwind CSS.',
        image: '/images/projects/seanoliver.dev.png',
        tags: ['Next.js', 'Tailwind CSS', 'TypeScript']
    },
    {
        name: 'Sharebnb',
        url: 'https://sharebnb.vercel.app',
        description: 'A clone of Airbnb for sharing remarkable outdoor spaces. Express backend with Next.js and React on the frontend.',
        image: '/images/projects/sharebnb.png',
        tags: ['Next.js', 'React', 'Express', 'TypeScript']
    },
    {
        name: 'Warbler',
        url: 'https://warbler.vercel.app',
        description: 'A Twitter clone built with React and Firebase.',
        image: '/images/projects/warbler.png',
        tags: ['React', 'Firebase']
    },
    {
        name: 'Jobly',
        url: 'https://jobly.vercel.app',
        description: 'A job board built with React and Express.',
        image: '/images/projects/jobly.png',
        tags: ['React', 'Express']
    },
    {
        name: 'TheraGPT',
        url: 'https://theragpt.ai',
        description: 'A web app using OpenAI\'s GPT-3 to help people reframe negative thoughts.',
        image: '/images/projects/theragpt.png',
        tags: ['React', 'Express', 'OpenAI']
    },
]

