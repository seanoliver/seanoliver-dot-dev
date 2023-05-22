'use client';

import { NAV_ITEMS } from '@/lib/globals';
import Link from 'next/link';
import { useState } from 'react';
import Scrollspy from 'react-scrollspy';

export default function SiteNav(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='SiteNav-wrapper'>
			<div
				className={`
                SiteNav
                flex flex-col items-center justify-around
                container
                sticky
            `}>
				<div className='bg-slate-300 p-2 rounded-md'>HOLD BIO</div>
				<button
					className='md:hidden block relative'
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
                    md:flex md:justify-end flex-col
                    w-full absolute
                    top-full left-0 bg-slate-200 dark:bg-slate-800
                    md:static md:bg-transparent ${
											isOpen ? 'block' : 'hidden'
										}`}>
					<Scrollspy items={NAV_ITEMS.map((item) => item.name)}>
					{NAV_ITEMS.map((item, index) => (
						<div
							className={`
                            SiteNav-item
                            p-2 relative
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
                                block w-full text-center relative
                            `}
								href={`${item.url}`}>
								{item.name}
								<span className='absolute left-0 w-0 h-1 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ease-in-out hover:w-full'></span>
							</Link>
						</div>
					))}
					</Scrollspy>
				</nav>
			</div>
		</div>
	);
}
