import type { ReactNode } from "react";

interface ModalActionFooterProps {
    children: ReactNode;
}

export const ModalActionFooter = ({ children }: ModalActionFooterProps) => (
    <footer className="-mx-5 -mb-6 mt-1 flex items-center justify-end border-t border-light-10 bg-surface-dark px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
        {children}
    </footer>
);
