import { useQuery } from "@tanstack/react-query";

import { getHistory } from "../history.service";

import type { TransactionType } from "@/modules/app/interfaces/Transaction";
import { useAuthStore } from "@/auth/authStore";

interface UseGetHistoryParams {
    query?: string;
    type?: TransactionType | null;
    page?: number;
    size?: number;
    preview?: boolean;
}

export const useGetHistory = ({
    query = "",
    type = null,
    page = 0,
    size = 20,
    preview = false,
}: UseGetHistoryParams = {}) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: preview ? ["history", "preview"] : ["history", query, type, page, size],
        queryFn: () =>
            getHistory({
                query,
                type,
                page,
                size: preview ? 8 : size,
            }),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
