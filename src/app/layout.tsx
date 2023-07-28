'use client';

import './globals.css';
import clsx from 'clsx';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

/** Inter Font */

import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { TailwindIndicator } from '@/components/tailwind-indicator';
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
			<Head>
				<title>Sean Oliver</title>
				<meta property="og:title" content="Sean Oliver" key="title" />
			</Head>
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem>
					<div className='container flex flex-col justify-center items-center xl:max-w-[700px] lg:max-w-[600px] md:max-w-3/4 sm:max-w-4/5 max-w-5/6 mx-auto'>
						<Header className='w-full flex flex-col mt-5' />
						{children}
						<Footer />
					</div>
				</ThemeProvider>
				<Analytics />
				<TailwindIndicator />
			</body>
		</html>
	);
}
