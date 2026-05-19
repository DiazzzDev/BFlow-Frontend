import { Wallet } from "lucide-react";

export const WalletLoader = () => (
    <div className="flex flex-col items-center justify-center py-12 gap-6 col-span-full">
        <div className="relative w-14 h-14">
            <svg className="animate-spin" width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="24" stroke="var(--border)" strokeWidth="3"/>
                <path d="M28 4 A24 24 0 0 1 52 28" stroke="var(--ring)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-[var(--ring)]" />
            </div>
        </div>
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">Cargando billeteras</p>
            <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ring)] animate-pulse [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ring)] animate-pulse [animation-delay:400ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ring)] animate-pulse [animation-delay:800ms]" />
            </div>
        </div>
    </div>
)
