export type Project = {
    name: string;
    url: string;
    description: string;
    image: string;
    tags: string[];
}

/**
 * This type defines props for the main menu. It includes passed-in state and a
 * state setter, as well as the menu content.
 */
export type MenuProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	children: React.ReactNode;
};

/**
 * This type defines props for the nav item.
 */
export type NavItemProps = {
	item: {
		name: string;
		url: string;
	};
};

export interface CardWrapperProps {
    children: React.ReactNode;
}