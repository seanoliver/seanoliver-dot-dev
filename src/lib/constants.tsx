import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
  ArrowTopRightIcon,
} from '@radix-ui/react-icons'
import { Project, Experience } from '@/lib/types'

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
    name: 'X',
    url: 'https://x.com/SeanOliver',
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
    name: 'TheraGPT',
    url: 'https://theragpt.ai',
    github: 'https://github.com/seanoliver/theragpt-app',
    description:
      'An AI-powered CBT journal to help people identify cognitive distortions and reframe negative thoughts.',
    summary: 'AI-powered CBT journal for mental health',
    image: '/projects/theragpt-new.png',
    tags: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'OpenAI',
      'Vercel',
      'TypeScript',
      'Expo',
      'Supabase',
      'Shadcn',
    ],
  },
  {
    name: 'Audioflare',
    url: 'https://audioflare.seanoliver/dev/',
    github: 'https://github.com/seanoliver/audioflare',
    description:
      'An all-in-one AI audio playground using Cloudflare AI Workers to transcribe, analyze, summarize, and translate any audio file.',
    summary: 'AI audio transcription and translation tool',
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
    summary: 'Menubar app for multiple AI chatbots',
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
    summary: 'Personal portfolio and blog website',
    image: '/projects/sodev.png',
    tags: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'TypeScript',
      'Vercel',
      'Shadcn',
      'Contentlayer',
      'Radix UI',
    ],
  },
  {
    name: 'TheraGPT (v1)',
    url: 'https://theragpt.ai',
    github: 'https://github.com/seanoliver/thera-gpt',
    description:
      "A web app using OpenAI's Chat Completions API to help people reframe negative thoughts.",
    summary: 'Web app to reframe negative thoughts',
    image: '/projects/theragpt.png',
    tags: ['Flask', 'OpenAI', 'JavaScript', 'Python'],
  },
]

export const EXPERIENCES: Experience[] = [
  {
    title: 'Growth Engineer',
    company: 'Supabase',
    url: 'https://supabase.com/',
    logo: '/logos/supabase.png',
    date: '2025 - Present',
    description:
      'Driving growth through experimentation and data-driven feature development at the open source Firebase alternative, building tools that help developers ship faster.',
  },
  {
    title: 'Software Engineer',
    company: 'Gamma',
    url: 'https://gamma.app/',
    logo: '/logos/gamma.png',
    date: '2023 - 2025',
    description:
      'Built AI-powered features for a platform that helps people share knowledge through interactive, multimodal docs that eliminate the dread of a blank page.',
  },
  {
    title: 'Software Engineer',
    company: 'Smol AI',
    url: 'https://github.com/smol-ai',
    logo: '/logos/smol.png',
    date: '2023 - 2023',
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
    company: 'Block',
    url: 'https://block.xyz/',
    logo: '/logos/block.png',
    date: '2021 - 2023',
    description:
      'Led a cross-functional go-to-market effort for Square Team Communication, powered by the Crew app.',
  },
  {
    title: 'Director of Marketing',
    company: 'Crew',
    url: 'https://www.crewapp.com/',
    logo: '/logos/crew.png',
    date: '2019 - 2021',
    description:
      'Expanded and directed a marketing team that significantly grew the customer base, launched numerous features, and executed webinars to boost new ARR and renewals.',
  },
  {
    title: 'Senior Manager, Product Marketing',
    company: 'Lyft',
    url: 'https://www.lyft.com/',
    logo: '/logos/lyft.png',
    date: '2015 - 2019',
    description:
      'Led passenger GTM efforts, in tight coordination with operations, product, and engineering teams, introducing high-impact features like Scheduled Rides.',
  },
  {
    title: 'Senior Product Marketing Manager',
    company: 'Optimizely',
    url: 'https://www.optimizely.com/',
    logo: '/logos/optimizely.png',
    date: '2013 - 2015',
    description:
      "Launched Optimizely's first mobile app testing SDK. Created and implemented a comprehensive framework for measuring the success of in-product promotional messaging.",
  },
  {
    title: 'Product Marketing Manager',
    company: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    logo: '/logos/linkedin.webp',
    date: '2012 - 2013',
    description:
      'Implemented campaigns to activate lapsed users and improve user acquisition, while refining email marketing strategies for higher user engagement.',
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    url: 'https://www.microsoft.com/',
    logo: '/logos/microsoft.png',
    date: '2009 - 2012',
    description:
      'Managed product marketing for Windows Channel & Partner Marketing, significantly increasing sales and consumer impressions across stores.',
  },
]
