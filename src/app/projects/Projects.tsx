import { PROJECTS } from "@/lib/globals";
import ProjectCard from "./ProjectCard";

export default function Projects(): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {PROJECTS.map((project, index) => (
                <div className={`mb-4`} key={`${project.name}-${index}`}>
                    <ProjectCard project={project} />
                </div>
            ))}

        </div>
    );
}