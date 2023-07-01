import React from 'react';

/**
 * This component returns the footer.
 * @returns The footer
 */
export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<div className='Footer flex flex-row items-center justify-center w-full h-16'>
			<div className='Footer-item rounded-full'>Sean Oliver</div>
			<div className='Footer-item'>&nbsp;&copy; {year}</div>
		</div>
	);
}
