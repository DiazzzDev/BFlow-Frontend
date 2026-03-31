

export const WalletCard = ({ wallet }) => { 
    return (
        <div className="bg-[var(--bg-card)] p-5 border border-[var(--border-card)] rounded-lg shadow-sm flex flex-col">
            <div></div>
            <h3>{wallet.name}</h3>
            <p>Balance: {wallet.balance}</p>
        </div>
    );
}