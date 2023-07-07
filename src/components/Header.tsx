'use client';

import { NAV_ITEMS } from '@/lib/globals';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
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
								<SmartNavItem
									key={`${item.name}-${idx}`}
									name={item.name}
									url={item.url}
									icon={item.icon}
									scroll={item.icon ? false : true}
									separator={idx < NAV_ITEMS.length - 1}
								/>
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

const CommonElements = ({
	name,
	icon,
	scroll,
	url,
	separator,
}: {
	name: string;
	icon?: React.ReactNode;
	scroll: boolean;
	url: string;
	separator: boolean;
}): JSX.Element => (
	<>
		{scroll ? (
			<ScrollLink
				to={name.toLowerCase()}
				spy={true}
				smooth={'easeInOutQuint'}
				duration={1000}
				offset={-100}
				className={`flex py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer`}>
				{name}
				{icon && icon}
			</ScrollLink>
		) : (
			<Link
				href={url}
				className={`flex py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foregroun cursor-pointer`}>
				{name}
				{icon && icon}
			</Link>
		)}
		{separator && (
			<Separator
				className='mx-2'
				orientation='vertical'
			/>
		)}
	</>
);

const SmartNavItem = ({
	name,
	url,
	icon,
	scroll,
	separator,
	dropdown,
}: {
	name: string;
	url: string;
	icon?: React.ReactNode;
	scroll: boolean;
	separator: boolean;
	dropdown?: boolean;
}): JSX.Element => {
	return dropdown ? (
		<DropdownMenuItem>
			<CommonElements
				name={name}
				icon={icon}
				scroll={scroll}
				url={url}
				separator={separator}
			/>
		</DropdownMenuItem>
	) : (
		<NavigationMenuItem>
			<CommonElements
				name={name}
				icon={icon}
				scroll={scroll}
				url={url}
				separator={separator}
			/>
		</NavigationMenuItem>
	);
};

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
						<SmartNavItem
							key={`${item.name}-${idx}`}
							name={item.name}
							url={item.url}
							icon={item.icon}
							scroll={item.icon ? false : true}
							separator={idx === NAV_ITEMS.length - 2}
						/>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
