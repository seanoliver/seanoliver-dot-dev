'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Image from 'next/image';
import Link from 'next/link';

import { CardWrapperProps, NavItemProps, MenuProps } from '@/lib/types';
import { NAV_ITEMS } from '@/lib/globals';

export default function SiteNav(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// const timeout = setTimeout(() => setIsMounted(true), 0);
		// return () => clearTimeout(timeout);
	}, []);

	return (
		<NavWrapper>
			<Nametag isMounted={isMounted} />
			<ResponsiveMenu
				isOpen={isOpen}
				setIsOpen={setIsOpen}>
				<AnimatePresence>
					{NAV_ITEMS.map((item, index) => (
						<NavItem
							key={`${item.name}-${index}`}
							item={item}
							index={index}
							isMounted={isMounted}
						/>
					))}
				</AnimatePresence>
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
		<div className='flex flex-row items-center justify-around'>{children}</div>
	);
};

const variationLeft = {
	hidden: {
		opacity: 0,
		x: -100,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

const variationRight = {
	hidden: {
		opacity: 0,
		x: 100,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

/**
 *	This component returns a name tag with my name and title.
 *
 * @returns A name tag with my name and title
 * @example
 * <Nametag />
 */
const Nametag = ({ isMounted }: { isMounted: boolean }) => {
	return (
		<AnimatePresence>
			<motion.div
				variants={variationLeft}
				initial='hidden'
				animate={isMounted ? 'visible' : 'hidden'}
				transition={{ delay: 0.15, type: 'spring' }}
				exit='hidden'
				className={`relative rounded-xl overflow-auto p-8 hidden md:block`}>
				<div className='overflow-visible relative max-w-sm mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6 dark:bg-slate-700 md:w-80 dark:highlight-white/5'>
					<Image
						className={`absolute -left-6 w-24 h-24 rounded-full shadow-lg`}
						src='/../public/profile.jpeg'
						width={96}
						height={96}
						alt='Sean Oliver'
					/>
					<div className='flex flex-col py-5 pl-24'>
						<strong className='text-slate-900 text-sm font-medium dark:text-slate-200'>
							Sean Oliver
						</strong>
						<span className='text-slate-500 text-sm font-medium dark:text-slate-400'>
							Software Engineer
						</span>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
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
 */
const ResponsiveMenu: React.FC<MenuProps> = ({
	isOpen,
	setIsOpen,
	children,
}) => {
	return (
		<div className='ResponsiveMenu'>
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
			md:flex md:justify-end md:flex-col rounded-md m-6 md:m-0
			top-full left-0 bg-sate-200 dark:bg-slate-800
			md:static md:bg-transparent ${isOpen ? 'block' : 'hidden'}`}>
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
			variants={variationRight}
			initial='hidden'
			animate={isMounted ? 'visible' : 'hidden'}
			transition={{ delay: index * 0.1, duration: 1, type: 'spring' }}
			exit='hidden'
			className={`
				SiteNav-item
				p-2
			`}>
			<Link
				className={`transition duration-500 ease-in-out rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-lg text-center`}
				href={`${item.url}`}>
				{item.name}
			</Link>
		</motion.div>
	);
};
