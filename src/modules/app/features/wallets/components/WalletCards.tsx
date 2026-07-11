import { NavLink } from "react-router-dom";

import { formatCurrency } from "../../../../../utils/formaters.ts";
import { Wallet } from "../interfaces/Wallets.ts";

import { WalletProgressBar } from "./WalletProgressBar.tsx";

export const WalletCard = ({wallet}: {wallet: Wallet}) => {
    return (
        <NavLink className="bg-card p-5 border border-border rounded-lg shadow-sm flex flex-col cursor-pointer hover:scale-102 transition-transform duration-300" to={`/wallets/${wallet.id}`}>
            <div className="flex justify-between pb-3 pt-1">
                <h3 className="text-foreground font-medium text-lg">{wallet.name}</h3>
                <p className="text-foreground text-lg font-medium">{wallet.currency}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex flex-col pt-3 gap-1">
                <p className="text-muted-foreground text-xs">Balance actual:</p>
                <p className="text-foreground text-xl">{formatCurrency(wallet.balance)}</p>
            </div>
            <WalletProgressBar spent={wallet.balance} budget={wallet.initialValue} />
            <div className="flex items-center mt-auto gap-2 pt-4">
                <p className="text-label text-xs">Compartida con:</p>
                <div className="flex -space-x-2" />
            </div>
        </NavLink>
    );
}
