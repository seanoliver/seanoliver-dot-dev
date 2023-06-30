import './globals.css';
import clsx from 'clsx';

/** Inter Font */

import { Inter } from 'next/font/google';
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

/** Jet Brains Mono Font */

import localFont from 'next/font/local';
import Nav from '@/components/navigation';

const jetBrainsMono = localFont({
	src: '../../public/fonts/JetBrainsMono-Regular.woff2',
	variable: '--font-jetbrains-mono',
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
				'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700',
				'bg-gradient-to-b bg-no-repeat',
				'dark:from-slate-900 dark:to-slate-700',
				'from-slate-100 to-slate-300',
				inter.className
			)}>
			<body className={inter.className}>
				<div
					className={`RootLayout flex flex-col items-center mx-auto h-screen`}>
					{children}
				</div>
			</body>
		</html>
	);
}
