'use client';

import { NAV_ITEMS } from '@/lib/globals';
import { useState } from 'react';
import { Nametag, NavItem, NavWrapper, ResponsiveMenu } from './navElements';

export default function SiteNav(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<NavWrapper>
			<Nametag />
			<ResponsiveMenu
				isOpen={isOpen}
				setIsOpen={setIsOpen}>
				{NAV_ITEMS.map((item, index) => (
					<NavItem key={`${item.name}-${index}`} item={item} />
				))}
				</ResponsiveMenu>
		</NavWrapper>
	);

}
