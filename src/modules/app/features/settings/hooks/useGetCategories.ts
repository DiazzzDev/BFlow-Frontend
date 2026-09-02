import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../categories.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetCategories = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
