import Title from '@/components/Title';
import { metadata } from '@/app/layout';

import { SOCIAL_LINKS } from '@/lib/globals';

export default function About(): JSX.Element {
	return (
		<section id='about'>
			<div className='About flex justify-center align-middle self-center'>
				<div className='About-body text-left md:w-1/2'>
					<Title title={metadata.title} />
					<p className={`mt-4`}>{metadata.longDescription}</p>
					<div className='About-social-icons flex flex-row justify-center'>
						{SOCIAL_LINKS.map((link, index) => (
							<a
								key={`${link.name}-${index}`}
								className={`About-social-link text-2xl m-5`}
								href={link.url}
								target='_blank'
								rel='noopener noreferrer'>
								{link.icon}
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
