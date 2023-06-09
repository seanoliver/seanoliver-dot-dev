'use client';

import Section from '@/components/Section';
import About from './about/page';
import Projects from './projects/page';
import Experience from './experience/page';
import Socials from '@/components/socials';
import Goodreads from '@/components/goodreads';

export default function Home(): JSX.Element {
	return (
		<>
			<Section title='Home'>
				<h4 className='font-medium'>Sean Oliver</h4>
				<p className='text-muted-foreground'>Software Engineer</p>
			</Section>
			<Section title='About'>
				<About />
			</Section>
			<Section title='Social'>
				<Socials />
			</Section>
			<Section title='Projects'>
				<Projects />
			</Section>
			<Section title='Experience'>
				<Experience />
			</Section>
			<Section title='Reading'>
				<Goodreads />
			</Section>
		</>
	);
}
