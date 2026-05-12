import { useQuery } from "@tanstack/react-query";
import { getDocument } from "../../legal.service.ts";

export const useGetPrivacy = () => {
    return useQuery({
        queryKey: ['wallets'],
        queryFn: () => getDocument("privacy"),
        select: (response) => {
            const { success, message, timestamp, path, content} = response;
            return {
                myWallets: content.filter(w => w.role === "OWNER"),
                sharedWallets: content.filter(w => w.role !== "OWNER"),
            };
        }
    });
}