'use client';

import { NAV_ITEMS } from '@/lib/globals';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function Header({
	className,
}: {
	className: string;
}): JSX.Element {
	const pathname = usePathname();

	return (
		<div className={className}>
			<div className='flex justify-between text-sm min-w-max items-center'>
				<div className='flex items-center'>
					<Link href='/'>
						<Avatar className='mr-4'>
							<AvatarImage src='./profile.jpeg' />
							<AvatarFallback>SO</AvatarFallback>
						</Avatar>
					</Link>

					<NavigationMenu>
						<NavigationMenuList className='md:flex hidden'>
							{NAV_ITEMS.map((item, idx) => (
								<NavigationMenuItem key={`${item.name}-${idx}`}>
									<Link
										href={item.url}
										className={`flex py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground ${
											pathname === item.url ? 'bg-secondary' : ''
										}`}>
										{item.name}
										{item.icon && item.icon}
									</Link>
									{idx < NAV_ITEMS.length - 1 && (
										<Separator
											className='mx-2'
											orientation='vertical'
										/>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div>
					<ModeToggle />
					<HamburgerMenu />
				</div>
			</div>
		</div>
	);
}

const ModeToggle = () => {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'>
					<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const HamburgerMenu = () => {
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='md:hidden ml-1'>
					<HamburgerMenuIcon className='h-[1.2rem] w-[1.2rem]' />
					<span className='sr-only'>Toggle menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{NAV_ITEMS.map((item, idx) => (
					<DropdownMenuItem key={`${item.name}-${idx}`}>
						<Link
							href={item.url}
							className={`flex ${
								pathname === item.url ? 'bg-secondary' : ''
							}`}>
							{item.name}
							{item.icon && item.icon}
						</Link>
						{idx === NAV_ITEMS.length - 2 && (
							<DropdownMenuSeparator />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
