export const PolicySidebar = ({ sidebarItems }) => {
    return (
        <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
                <p className="text-xs tracking-widest uppercase text-[var(--text-label)] mb-4">Contenido</p>
                <nav className="flex flex-col gap-1">
                    {sidebarItems.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            className="text-sm text-[var(--text-foreground)] hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-[var(--card)] leading-snug cursor-pointer text-left"
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

