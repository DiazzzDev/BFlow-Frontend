// Shared Tailwind classes for every auth form
export const authFieldClass = "flex flex-col gap-2";

export const authLabelClass = "text-sm font-medium text-light";

// Browsers paint autofilled fields with their own background: the inset shadow covers it,
// and clipping to the padding box keeps it from showing through the translucent border.
// The dark color scheme makes the autofill preview text and suggestions popup readable.
export const authInputClass =
    "h-11 w-full rounded-lg border border-light-10 bg-surface-hard px-3.5 [color-scheme:dark] text-sm text-light placeholder:text-placeholder outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 autofill:bg-clip-padding autofill:shadow-[inset_0_0_0_1000px_var(--color-surface-hard)] autofill:[-webkit-text-fill-color:var(--color-light)] autofill:[caret-color:var(--color-light)]";

export const authErrorClass = "text-xs text-danger";

export const authHintClass = "text-xs text-helper";

export const authPrimaryButtonClass =
    "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50";

export const authTextLinkClass =
    "font-medium text-primary transition-colors hover:text-primary-dark";
