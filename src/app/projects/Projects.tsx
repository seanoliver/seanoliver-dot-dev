import { PROJECTS } from "@/lib/globals";
import ProjectCard from "./ProjectCard";

export default function Projects(): JSX.Element {
    return (
        <>
            {PROJECTS.map((project, index) => (
                <div className={`mb-4`} key={`${project.name}-${index}`}>
                    <ProjectCard project={project} />
                </div>
            ))}

        </>
    );
}