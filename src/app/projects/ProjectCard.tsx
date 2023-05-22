export default function ProjectCard({project}): JSX.Element {
    return (
        <div className={`dark:bg-slate-800 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md hover:shadow-xl transition-all duration-200 rounded-lg p-6 sm:w-[32rem]`}>
            <div className={`mb-4`}>
                <h2 className={`dark:text-slate-200 text-2xl font-semibold text-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 animate-fade-in-down`}>{project.name}</h2>
            </div>
            <div className={`mb-4`}>
                <p className={`dark:text-slate-400 text-slate-500 hover:text-slate-600 dark:hover:text-slate-500 transition-colors duration-200 animate-fade-in-down`}>{project.description}</p>
            </div>
            <div className={`flex flex-wrap`}>
                {project.tags.map((tag, index) => (
                    <div key={`${tag}-${index}`}>
                    <span className={`
                    dark:bg-slate-600 dark:text-slate-200
                    inline-block
                    bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500
                    rounded-full px-3 py-1
                    text-sm font-semibold
                    text-slate-700 hover:text-slate-800 dark:hover:text-slate-100
                    mr-2 mb-2
                    transition-colors duration-200 animate-fade-in-down
                    `}>{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
