'use client';

import './globals.css';
import clsx from 'clsx';
import Nav from '@/components/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { variationUp } from '@/components/AnimationVariants';

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
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	return (
		<html
			lang='en'
			className={clsx(
				'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700',
				'bg-gradient-to-b bg-no-repeat',
				'dark:from-slate-900 dark:to-slate-700',
				'from-slate-100 to-slate-300',
				inter.className
			)}>
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<Nav />
				<div className='flex-1 overflow-hidden'>
					{isMounted ? (
						<motion.div
							variants={variationUp}
							initial='hidden'
							animate={isMounted ? 'visible' : 'hidden'}
							transition={{ delay: 0.25, type: 'spring' }}
							exit={{ opacity: 0 }}
							className='overflow-y-auto'>
							{children}
						</motion.div>
					) : (
						<div style={{ visibility: 'hidden' }}>{children}</div>
					)}
					<Footer />
				</div>
			</body>
		</html>
	);
}
