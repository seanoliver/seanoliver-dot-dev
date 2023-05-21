export default function ProjectCard({project}): JSX.Element {
    return (
        <div className={`bg-slate-50 hover:bg-slate-100 shadow-md hover:shadow-xl transition-all duration-200 rounded-lg p-6`}>
            <div className={`mb-4`}>
                <h2 className={`text-2xl font-semibold text-slate-800 hover:text-slate-900 transition-colors duration-200`}>{project.name}</h2>
            </div>
            <div className={`mb-4`}>
                <p className={`text-slate-500 hover:text-slate-600 transition-colors duration-200`}>{project.description}</p>
            </div>
            <div className={`flex flex-wrap`}>
                {project.tags.map((tag, index) => (
                    <div key={`${tag}-${index}`}>
                    <span className={`
                    inline-block
                    bg-slate-200 hover:bg-slate-300
                    rounded-full px-3 py-1
                    text-sm font-semibold
                    text-slate-700 hover:text-slate-800
                    mr-2 mb-2
                    transition-colors duration-200`}>{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
