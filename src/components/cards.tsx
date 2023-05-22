export const CardBox = ({ children }) => {
    return (
        <div className={`
            ProjectCard-border-gradient
            flex align-middle justify-center
            bg-gradient-to-r from-indigo-600 to-pink-500
            rounded-lg
            p-[0.25rem]
            `}>
            {children}
        </div>
    )
}

export const Card = ({ children }) => {
    return (
        <div
            className={`
                dark:bg-slate-800 bg-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-900
                transition-all duration-200 rounded-lg p-6 sm:w-[32rem]
                shadow-lg`}>
            {children}
        </div>
    )
}

export const CardTitle = ({ children }) => {
    return (
        <div className={`mb-4`}>
            <h2
                className={`
                    dark:text-slate-200 text-slate-800
                    text-xl font-semibold
                    hover:text-slate-900 dark:hover:text-slate-100
                    transition-colors duration-200 animate-fade-in-down
                `}
            >
                {children}
            </h2>
        </div>
    )
}

export const CardDescription = ({ children }) => {
    return (
        <div className={`mb-4`}>
            <p
                className={`
                    dark:text-slate-400 text-slate-500
                    transition-colors duration-200 animate-fade-in-down
                `}
            >
                {children}
            </p>
        </div>
    )
}

export const CardTags = ({ children }) => {
    return (
        <div className={`flex flex-wrap`}>
            {children}
        </div>
    )
}

export const CardTag = ({ children }) => {
    return (
        <div>
            <span
                className={`
                    dark:bg-slate-600 dark:text-slate-200
                    inline-block
                    bg-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500
                    rounded-full px-3 py-1
                    text-sm font-semibold
                    text-slate-700 hover:text-slate-800 dark:hover:text-slate-100
                    mr-2 mb-2
                    transition-colors duration-200 animate-fade-in-down
                `}
            >
                {children}
            </span>
        </div>
    )
}
