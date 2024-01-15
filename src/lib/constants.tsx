import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
  ArrowTopRightIcon,
} from '@radix-ui/react-icons'
import { Project } from '@/lib/types'

export const NAV_ITEMS = [
  {
    name: 'Posts',
    url: '#posts',
    pageLink: '/posts',
  },
  {
    name: 'About',
    url: '#about',
    pageLink: '/about',
  },
  {
    name: 'Projects',
    url: '#projects',
    pageLink: '/projects',
  },
  {
    name: 'Experience',
    url: '#experience',
    pageLink: '/experience',
  },
  {
    name: 'Newsletter',
    url: 'https://newsletter.seanoliver.dev/',
    pageLink: 'https://newsletter.seanoliver.dev/',
    icon: <ArrowTopRightIcon className='ml-1 mt-1 inline w-4 h-4' />,
  },
]

export const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/SeanOliver',
    icon: <TwitterLogoIcon />,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/SeanOliver',
    icon: <GitHubLogoIcon />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/theseanoliver/',
    icon: <LinkedInLogoIcon />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/theseanoliver/',
    icon: <InstagramLogoIcon />,
  },
]

export const PROJECTS: Project[] = [
  {
    name: 'Audioflare',
    url: 'https://audioflare.seanoliver/dev/',
    github: 'https://github.com/seanoliver/audioflare',
    description:
      'An all-in-one AI audio playground using Cloudflare AI Workers to transcribe, analyze, summarize, and translate any audio file.',
    image: '/projects/audioflare.png',
    tags: [
      'Cloudflare',
      'TypeScript',
      'React',
      'Whisper',
      'Tailwind CSS',
      'Cloudflare AI Workers',
    ],
  },
  {
    name: 'Smol Menubar',
    url: 'https://github.com/smol-ai/menubar',
    github: 'https://github.com/smol-ai/menubar',
    description:
      'A menubar with Zero latency access to ChatGPT, Bard, Bing Chat, and Claude. I joined the Smol team out of a passion for LLMs and tools like this. Modularized chat providers and continue to maintain the project.',
    image: '/projects/smolmenubar.png',
    tags: [
      'TypeScript',
      'React',
      'JavaScript',
      'Electron',
      'CSS',
      'ChatGPT',
      'Bard',
      'Bing Chat',
      'Claude',
    ],
  },
  {
    name: 'SeanOliver.dev',
    url: 'https://seanoliver.dev',
    github: 'https://github.com/seanoliver/seanoliver-dot-dev',
    description: 'My personal website built with Next.js and Tailwind CSS.',
    image: '/projects/sodev.png',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Vercel'],
  },
  // {
  // 	name: 'Sharebnb',
  // 	url: 'https://sharebnb.vercel.app',
  // 	github: 'https://github.com/seanoliver/sharebnb-backend',
  // 	description:
  // 		'A clone of Airbnb for sharing remarkable outdoor spaces. Express backend with Next.js and React on the frontend.',
  // 	image: 'https://placehold.co/700x300',
  // 	tags: ['Next.js', 'React', 'Express', 'JavaScript', 'AWS', 'PostgreSQL'],
  // },
  {
    name: 'Jobly',
    url: 'https://jobly.seanoliver.dev',
    github: 'https://github.com/seanoliver/react-jobly',
    description: 'A job board built with React and Express.',
    image: '/projects/jobly.png',
    tags: ['React', 'Express', 'JavaScript', 'PostgreSQL'],
  },
  {
    name: 'Warbler',
    url: 'https://sean-warbler.onrender.com/',
    github: 'https://github.com/seanoliver/warbler',
    description: 'A Twitter clone built with Flask.',
    image: '/projects/warbler.png',
    tags: ['Flask', 'PostgreSQL', 'JavaScript'],
  },
  {
    name: 'TheraGPT',
    url: 'https://theragpt.ai',
    github: 'https://github.com/seanoliver/thera-gpt',
    description:
      "A web app using OpenAI's Chat Completions API to help people reframe negative thoughts.",
    image: '/projects/theragpt.png',
    tags: ['Flask', 'OpenAI', 'JavaScript', 'Python'],
  },
]

export const EXPERIENCES = [
  // TODO: Finish implementing these roles and find logos.
  // {
  //   title: 'Software Engineer',
  //   company: 'State Technologies',
  //   logo: '/logos/state.png',
  //   date: '2023 - Present',
  //   description:
  //     'Building the future of enterprise software.',
  //   tags: ['Remix', 'SST', 'AWS Amplify', 'Firebase', 'TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Electron'],
  // },
  // {
  //   title: 'Software Engineer',
  //   company: 'Storybird.ai',
  //   logo: '/logos/storybird.png',
  //   date: '2023 - Present',
  //   description:
  //     'Building the future of storytelling with AI.',
  //   tags: ['TypeScript', 'React', 'Redux'],
  // },
  {
    title: 'Software Engineer',
    company: 'Gamma',
    logo: '/logos/gamma.png',
    date: '2023 - Present',
    description:
      'Building a new platform that helps people share knowledge in ways that engage, using AI-powered, interactive, multimodal docs that eliminate the dread of a blank page.'
  },
  {
    title: 'Software Engineer',
    company: 'Smol AI',
    logo: '/logos/smol.png',
    date: '2023',
    description:
      'Building tools to help developers and enthusiasts leverage AI to be more creative, productive, and effective.',
    tags: [
      'Next.js',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'Electron',
      'Tailwind CSS',
    ],
  },
  {
    title: 'Senior Product Marketing Manager',
    company: 'Block, Inc.',
    logo: '/logos/block.png',
    date: '2021 - 2023',
    description:
      'Led a cross-functional go-to-market effort for Square Team Communication, powered by the Crew app.',
  },
  {
    title: 'Director of Marketing',
    company: 'Crew',
    logo: '/logos/crew.png',
    date: '2019 - 2021',
    description:
      'Expanded and directed a marketing team that significantly grew the customer base, launched numerous features, and executed webinars to boost new ARR and renewals.',
  },
  {
    title: 'Senior Manager, Product Marketing',
    company: 'Lyft',
    logo: '/logos/lyft.png',
    date: '2015 - 2019',
    description:
      'Led passenger GTM efforts, in tight coordination with operations, product, and engineering teams, introducing high-impact features like Scheduled Rides.',
  },
  {
    title: 'Senior Product Marketing Manager',
    company: 'Optimizely',
    logo: '/logos/optimizely.png',
    date: '2013 - 2015',
    description:
      "Launched Optimizely's first mobile app testing SDK. Created and implemented a comprehensive framework for measuring the success of in-product promotional messaging.",
  },
  {
    title: 'Product Marketing Manager',
    company: 'LinkedIn',
    logo: '/logos/linkedin.webp',
    date: '2012 - 2013',
    description:
      'Implemented campaigns to activate lapsed users and improve user acquisition, while refining email marketing strategies for higher user engagement.',
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    logo: '/logos/microsoft.png',
    date: '2009 - 2012',
    description:
      'Managed product marketing for Windows Channel & Partner Marketing, significantly increasing sales and consumer impressions across stores.',
  },
]
