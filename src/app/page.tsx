'use client';

import Image from 'next/image';
import About from './about/page';
import Projects from './projects/page';
import Experiences from './experiences/page';

export default function Home(): JSX.Element {
	return (
		<>
			<Hero />
			<About />
			<Projects />
			<Experiences />
		</>
	);
}

const Hero = (): JSX.Element => {
	return (
		<section id='hero'>
			<div className='Home flex flex-1 items-center justify-center h-screen'>
				<div className={`relative rounded-xl overflow-auto p-28 md:block`}>
					<div className='relative max-w-md pt-5 sm:pt-0 bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col items-center dark:bg-slate-700 dark:highlight-white/5'>
						<Image
							className={`flex absolute -top-16 sm:w-60 sm:h-60 w-48 h-48 rounded-full shadow-lg`}
							src='/../public/profile.jpeg'
							width={240}
							height={240}
							alt='Sean Oliver'
						/>
						<div className='flex flex-col  sm:mt-40 mt-24 p-10'>
							<strong className='text-slate-900 sm:text-5xl text-2xl text-center mb-5 dark:text-slate-200'>
								Hi, I&apos;m Sean 👋
							</strong>
							<span className='text-slate-500 sm:text-2xl text-md text-center sm:leading-9 dark:text-slate-400'>
								I&apos;m a software engineer with a passion for building products
								products people love.
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
