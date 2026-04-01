import { useEffect, useState } from "react";

import { API_URL } from "../../../api/config.js";

export const useGetWallets = () => {
    const [wallets, setWallets] = useState([]);
    const [sharedWallets, setSharedWallets] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWallets = async () => {
            setWallets([]);
            setSharedWallets([]);
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/wallets`, {
                    credentials: "include",
                });
                const data = await response.json();
                const myWallets = [];
                const shared = [];

                data.forEach(wallet => {
                    wallet.users = JSON.parse(wallet.users);
                    if (wallet.role === "owner") {
                        myWallets.push(wallet);
                    } else {
                        shared.push(wallet);
                    }
                });

                setWallets(myWallets);
                setSharedWallets(shared);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWallets();
    }, []);
    return { wallets, sharedWallets, isloading, error };
}
