'use client';

import { NAV_ITEMS } from '@/lib/globals';

import { Separator } from './ui/separator';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Nav({ className }: { className: string }): JSX.Element {
	return (
		<div className={className}>
			<div className='space-y-1'>
				<h4 className='text-sm font-medium leading-none'>Sean Oliver</h4>
				<p className='text-sm text-muted-foreground'>
					I&apos;m a software engineer in SF, and I&apos;m passionate about
					building products that make a difference.
				</p>
			</div>
			<Separator className='my-4' />
			<div className='flex text-sm'>
				{NAV_ITEMS.map((item, idx) => (
					<div
						key={item.name}
						className='flex'>
						<div>{item.name}</div>
						{idx < NAV_ITEMS.length - 1 && (
							<Separator
								className='mx-2'
								orientation='vertical'
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export function ModeToggle() {
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
}