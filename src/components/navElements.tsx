import Image from 'next/image';
import Link from 'next/link';

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
export const NavWrapper = ({ children }) => {
	return (
		<div className='flex flex-col items-center justify-around container'>
			{children}
		</div>
	);
};

/**
 *	This component returns a name tag with my name and title.
 *
 * @returns A name tag with my name and title
 * @example
 * <Nametag />
 */
export const Nametag = () => {
	return (
		<div className='relative rounded-xl overflow-auto p-8 hidden md:block'>
			<div className='overflow-visible relative max-w-sm mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6 dark:bg-slate-700 md:w-52 lg:w-80 dark:highlight-white/5'>
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
		</div>
	);
};

/**
 * This type defines props for the main menu. It includes passed-in state and a
 * state setter, as well as the menu content.
 */
type MenuProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	children: React.ReactNode;
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
export const ResponsiveMenu: React.FC<MenuProps> = ({
	isOpen,
	setIsOpen,
	children,
}) => {
	return (
		<>
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
			md:flex md:justify-end flex-col
			top-full left-0 bg-slate-200 dark:bg-slate-800
			md:static md:bg-transparent ${isOpen ? 'block' : 'hidden'}`}>
				{children}
			</nav>
		</>
	);
};


/**
 * This type defines props for the nav item.
 */
type NavItemProps = {
	item: {
		name: string;
		url: string;
	};
};

/**
 * This component returns a nav item.
 *
 * @prop item
 * @returns A nav item
 * @example
 * <NavItem item={{ name: 'Home', url: '/' }} />
 */
export const NavItem: React.FC<NavItemProps> = ({ item }) => {
	return (
		<div
		className={`
				SiteNav-item
				p-2
			`}>
		<Link
			className={`
					transition duration-500 ease-in-out
					rounded-lg px-3 py-2
					text-slate-600
					dark:text-slate-300
					hover:bg-slate-200
					dark:hover:bg-slate-700
					hover:text-slate-900
					dark:hover:text-slate-100
					hover:shadow-lg
					text-center
				`}
			href={`${item.url}`}>
			{item.name}
		</Link>
	</div>
	)
};