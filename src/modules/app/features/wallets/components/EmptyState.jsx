export const EmptyState = ({ Button, titleText, descriptionText, Icon }) => (
    <div className="flex flex-col items-center justify-center py-12 gap-4 border border-dashed border-[var(--border)] rounded-xl col-span-full border-dashed">
        <div className="w-14 h-14 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
            {Icon}
        </div>
        <div className="text-center">
            <p className="text-[var(--text-primary)] font-medium">{titleText}</p>
            <p className="text-sm text-[var(--text-label)] mt-1">{descriptionText}</p>
        </div>
        {Button ? Button : null}
    </div>
)