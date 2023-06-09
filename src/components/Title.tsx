'use client';

/** Title component */
export default function Title({
	title,
	titleSize = 'large',
}: {
	title: string;
	titleSize?: 'large' | 'medium' | 'small';
}) {

	const titleStyles = {
		'large': 'text-4xl font-extrabold',
		'medium': 'text-3xl font-bold',
		'small': 'text-2xl font-semibold',
	}
	return (
		<>
			<h1
				className={`
				${titleStyles[titleSize]} text-center p-2 mb-4
				bg-clip-text text-transparent
				bg-gradient-to-r from-zinc-600 to-slate-600 text-black
				dark:bg-gradient-to-r dark:from-stone-300 dark:to-slate-300 dark:text-white
				px-2`}>
				{title}
			</h1>
		</>
	);
}
