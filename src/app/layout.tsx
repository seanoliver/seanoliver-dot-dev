import './globals.css';
import clsx from 'clsx';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

import localFont from 'next/font/local';

const jetBrainsMono = localFont({
	src: '../../public/fonts/JetBrainsMono-Regular.woff2',
	variable: '--font-jetbrains-mono',
	display: 'swap',
});

// const inter = Inter({ subsets: ['latin'] })

// Metadata for the home page
export const metadata = {
  title: 'Sean Oliver',
  description: 'Software Engineer in San Francisco, CA',
  longDescription: `After 13 years in the tech industry, I've seen it all - the ups, the
  downs, and everything in between. I started as a marketer, understanding
  what people want, what they need, and how to tell them we have it. Now, I
  build it. I live in San Francisco. I've got a family – a wife and two
  kids. When I'm not coding, we play tennis or travel. I read a lot, mostly
  through audiobooks. I'm interested in how we organize our knowledge, how
  AI is changing our world, and I love good gadgets. Professionally, I code
  in JavaScript/TypeScript and Python. React, Flask, Express, PostgreSQL,
  and Node.js are my tools. I use them to build things that make sense.
  Things that are needed. Things that work. Thanks for visiting. Have a look
  around, reach out if something catches your eye. Let's build something
  great together.`,
}

/**
 * Root layout component
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className={clsx(
				'text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-900',
				jetBrainsMono.variable
			)}>
			<body className={jetBrainsMono.variable}>
			<div className='Home flex flex-col items-center justify-between w-full h-screen'>
			<SiteNav />
			<div className='Home-body flex flex-col items-center p-10'>
				{children}
				</div>
			<Footer />
		</div>
			</body>
		</html>
	);
}
