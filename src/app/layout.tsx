'use client';

import './globals.css';
import clsx from 'clsx';
import Nav from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

/** Inter Font */

import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

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
			className={clsx('text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700 bg-gradient-to-b bg-no-repeat dark:from-slate-900 dark:to-slate-700 from-slate-100 to-slate-300', inter.className)}>
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem>
					<div className='flex flex-column justify-center items-center'>
						<Nav className='xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm xs:max-w-xs mx-auto flex flex-col mt-5' />
						{children}
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
