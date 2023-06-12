import './globals.css';
import clsx from 'clsx';
import NewSiteNav from '@/components/Nav';

/** Inter Font */

import { Inter } from 'next/font/google';
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

/** Jet Brains Mono Font */

import localFont from 'next/font/local';

const jetBrainsMono = localFont({
	src: '../../public/fonts/JetBrainsMono-Regular.woff2',
	variable: '--font-jetbrains-mono',
	display: 'swap',
});

// Metadata for the home page
export const metadata = {
	title: 'Sean Oliver',
	description: 'Software Engineer in San Francisco, CA',
	longDescription: `Hi there, I'm a software engineer and recovering
	product marketer witH 13 years of experience building and growing
	technology products. My background in marketing helps me understand
	people's needs and how to communicate with them. Now as a software
	engineer, I build products that meet those needs.`,
};

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
				'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700',
				'bg-gradient-to-b bg-no-repeat',
				'dark:from-slate-900 dark:to-slate-700',
				'from-slate-100 to-slate-300',
				jetBrainsMono.className
			)}>
			<body className={jetBrainsMono.className}>
				<div
					className={`Home flex md:flex-row flex-col items-start md:items-start w-full`}>
					<div
						className={`bg-transparent w-full md:w-1/3 pt-10 sticky top-0`}>
						<NewSiteNav />
					</div>
					<div
						className={`Home-body flex flex-col items-center w-full md:w-2/3 p-10`}>
						{children}
					</div>
				</div>
			</body>
		</html>
	);

}
