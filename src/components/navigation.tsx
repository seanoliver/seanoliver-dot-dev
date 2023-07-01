'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';

import { CardWrapperProps, NavItemProps, MenuProps } from '@/lib/types';
import { NAV_ITEMS } from '@/lib/globals';

import { variationDown } from '@/components/AnimationVariants';

export default function Nav(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<NavWrapper>
			<ResponsiveMenu
				isOpen={isOpen}
				setIsOpen={setIsOpen}>
				{NAV_ITEMS.map((item, index) => (
					<NavItem
						key={`${item.name}-${index}`}
						item={item}
						index={index}
						isMounted={isMounted}
					/>
				))}
			</ResponsiveMenu>
		</NavWrapper>
	);
}

/**
 * This component is a wrapper for the nav elements. It provides a
 * consistent style for the nav elements.
 *
 * @param children The content of the nav wrapper
 * @returns A wrapper for the nav elements
 * @example
 * <NavWrapper>
 * 	<NavElement />
 * </NavWrapper>
 */
const NavWrapper = ({ children }: CardWrapperProps) => {
	return (
		<div className='flex flex-row items-center justify-center sticky top-5 w-full mx-auto mt-5 z-10'>
			{children}
		</div>
	);
};

/**
 *
 * This component returns a responsive menu.
 *
 * @prop isOpen
 * @prop setIsOpen
 * @prop children
 * @returns A responsive menu component
 * @example
 * <ResponsiveMenu isOpen={isOpen} setIsOpen={setIsOpen}>
 * 	<NavLink href='/'>Home</NavLink>
 * 	<NavLink href='/about'>About</NavLink>
 * 	<NavLink href='/projects'>Projects</NavLink>
 * 	<NavLink href='/contact'>Contact</NavLink>
 * </ResponsiveMenu>
 *
 */
const ResponsiveMenu: React.FC<MenuProps> = ({
	isOpen,
	setIsOpen,
	children,
}) => {
	return (
		<div className='ResponsiveMenu flex md:bg-white md:rounded-lg md:p-2 md:shadow-lg'>
			<button
				className='md:hidden block relative'
				onClick={() => setIsOpen(!isOpen)}>
				<div
					className={`w-6 h-0.5 bg-slate-600 mb-1.5 transition duration-500 ease-in-out ${
						isOpen ? 'transform rotate-45 translate-y-2' : ''
					}`}></div>
				<div
					className={`w-6 h-0.5 bg-slate-600 mb-1.5 transition duration-500 ease-in-out ${
						isOpen ? 'opacity-0' : ''
					}`}></div>
				<div
					className={`w-6 h-0.5 bg-slate-600 transition duration-500 ease-in-out ${
						isOpen ? 'transform -rotate-45 -translate-y-2' : ''
					}`}></div>
			</button>
			<nav
				className={`
			md:flex md:justify-end rounded-md m-6 md:m-0
			top-full left-0 bg-sate-200 dark:bg-slate-800
			md:static ${isOpen ? 'block' : 'hidden'}`}>
				{children}
			</nav>
		</div>
	);
};

/**
 * This component returns a nav item.
 *
 * @prop item
 * @returns A nav item
 * @example
 * <NavItem item={{ name: 'Home', url: '/' }} />
 */
const NavItem: React.FC<NavItemProps> = ({ item, isMounted, index }) => {
	return (
		<motion.div
			variants={variationDown}
			initial='hidden'
			animate={isMounted ? 'visible' : 'hidden'}
			transition={{ delay: index * 0.1, duration: 1, type: 'spring' }}
			exit='hidden'
			className={`
				SiteNav-item
				p-2
			`}>
			<Link
				className={`transition duration-500 ease-in-out rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 text-center`}
				href={`${item.url}`}>
				{item.name}
			</Link>
		</motion.div>
	);
};
