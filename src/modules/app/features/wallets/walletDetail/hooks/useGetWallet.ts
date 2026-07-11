import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getWallets } from "../../wallet.services"

import { useAuthStore } from "@/auth/authStore"

export const useGetWallet = (walletId?: string) => {
    const user = useAuthStore((state) => state.user)

    const query = useQuery({
        queryKey: ["wallets"],
        queryFn: () => getWallets(),
        enabled: !!user && !!walletId,
    })

    const wallet = useMemo(() => {
        if (!walletId || !query.data) {
            return undefined
        }
        return query.data.data.content.find((item) => item.id === walletId)
    }, [query.data, walletId])

    return {
        ...query,
        wallet,
        isNotFound: !query.isLoading && !!walletId && !wallet,
    }
}

export const useWalletRouteId = () => {
    const { id } = useParams<{ id: string }>()
    return id
}
