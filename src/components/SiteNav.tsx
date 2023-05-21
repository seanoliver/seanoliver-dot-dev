'use client';

import { NAV_ITEMS } from '@/lib/globals';
import Link from 'next/link';
import { useState } from 'react';

export default function SiteNav(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={`
                SiteNav
                flex flex-row items-center justify-around
                w-full h-24
                container
                sticky
            `}>
			<div className='SiteNav-logo'>
				<img
					className={`w-16 h-16`}
					src='/favicon.ico'
					alt='Sean Oliver'
				/>
			</div>
			<button
				className='sm:hidden block relative'
				onClick={() => setIsOpen(!isOpen)}>
				<div
					className={`w-6 h-0.5 bg-slate-600 mb-1.5 transition duration-500 ease-in-out ${
						isOpen ? 'transform rotate-45 translate-y-2' : ''
					}`}></div>
				<div
					className={`w-6 h-0.5 bg-slate-600 mb-1.5 transition duration-500 ease-in-out ${
						isOpen ? 'opacity-0' : ''
					}`}></div>
				<div
					className={`w-6 h-0.5 bg-slate-600 transition duration-500 ease-in-out ${
						isOpen ? 'transform -rotate-45 -translate-y-2' : ''
					}`}></div>
			</button>
			<nav
				className={`
                    sm:flex sm:justify-end flex-col
                    sm:flex-row w-full absolute
                    top-full left-0 bg-slate-200 dark:bg-slate-800
                    sm:static sm:bg-transparent ${
					isOpen ? 'block' : 'hidden'
				}`}>
				{NAV_ITEMS.map((item, index) => (
					<div
						className={`
                            SiteNav-item
                            p-2
                        `}
						key={`${item.name}-${index}`}>
						<Link
							className={`
                                transition duration-500 ease-in-out
                                rounded-lg px-3 py-2
                                text-slate-600
                                dark:text-slate-300
                                font-medium
                                hover:bg-slate-200
                                dark:hover:bg-slate-700
                                hover:text-slate-900
                                dark:hover:text-slate-100
                                block w-full text-center
                            `}
                            href={`${item.url}`}>
							{item.name}
						</Link>
					</div>
				))}
			</nav>
		</div>
	);
}
