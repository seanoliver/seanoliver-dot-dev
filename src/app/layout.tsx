'use client';

import './globals.css';
import clsx from 'clsx';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

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
			className={clsx(
				'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700 bg-gradient-to-b bg-no-repeat dark:from-slate-900 dark:to-slate-700 from-slate-100 to-slate-300',
				inter.className
			)}>
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem>
					<div className='flex flex-col justify-center items-center xl:w-[700px] lg:w-[600px] md:w-3/4 sm:w-4/5 w-5/6 mx-auto'>
						<Header className='w-full flex flex-col mt-5' />
						{children}
						<Footer />
					</div>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}