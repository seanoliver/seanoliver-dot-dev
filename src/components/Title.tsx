'use client';

/** Title component */
export default function Title({
	title,
	titleSize = 'text-4xl',
}: {
	title: string;
	titleSize?: 'text-4xl' | 'text-2xl' | 'text-xl' | 'text-lg' | 'text-base';
}) {
	return (
		<>
			<h1
				className={`
				${titleSize} font-extrabold text-center py-2`}>
				{title}
			</h1>
		</>
	);
}
