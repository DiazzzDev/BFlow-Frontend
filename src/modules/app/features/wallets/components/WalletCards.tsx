import { NavLink } from "react-router-dom";

import { formatCurrency } from "../../../../../utils/formaters.ts";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar.tsx";
import { Separator } from "../../../../../components/ui/separator.tsx";
import { Wallet } from "../interfaces/Wallets.ts";

import { WalletProgressBar } from "./WalletProgressBar.tsx";



export const WalletCard = ({wallet}: {wallet: Wallet}) => {
    return (
        <NavLink className="bg-[var(--bg-card)] p-5 border border-[var(--border)] rounded-lg shadow-sm flex flex-col cursor-pointer transition-colors hover:bg-[var(--bg-card-hover)]" to={`/wallets/${wallet.id}`}>
            <div className="flex justify-between pb-3 pt-1">
                <h3 className="text-[var(--text-primary)] font-medium text-lg">{wallet.name}</h3>
                <p className="text-[var(--text-label)] text-lg">{wallet.currency}</p>
            </div>
            <Separator />
            <div className="flex flex-col pt-3 gap-1">
                <p className="text-[var(--text-label)] text-xs">Balance actual:</p>
                <p className="text-[var(--text-primary)] text-xl">{formatCurrency(wallet.balance)}</p>
            </div>
            <WalletProgressBar spent={wallet.balance} budget={wallet.initialValue} />
            <div className="flex items-center mt-auto gap-2 pt-4">
                <p className="text-[var(--text-label)] text-xs">Compartida con:</p>
                <div className="flex -space-x-2">
                    {/*wallet.users.map(user => (
                        <Avatar size="sm" key={user.id}>
                            <AvatarImage src={user.image} alt={user.name} />
                        </Avatar>
                    ))*/}
                </div>
            </div>
        </NavLink>
    );
}
