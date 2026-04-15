export const PolicyHeader = ({ locale, setLocale, header }) => {
    return (
        <div className="border-b border-[var(--border-subtle)] px-20 py-16">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs tracking-widest uppercase text-[var(--accent-orange)] mb-3">{header.badge}</p>
                    <h1 className="text-4xl font-bold tracking-tight mb-3">{header.title}</h1>
                    <p className="text-sm text-[var(--text-muted)]">{header.lastUpdated}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{header.operator}</p>
                </div>
                <select className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded px-3 py-2 text-sm" onChange={(e) => setLocale(e.target.value)} value={locale}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                </select>
            </div>
        </div>
    )
}