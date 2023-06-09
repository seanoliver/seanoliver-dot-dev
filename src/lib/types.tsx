export type Project = {
    name: string;
    url: string;
    description: string;
    image: string;
    tags: string[];
}

export interface CardWrapperProps {
    children: React.ReactNode;
}