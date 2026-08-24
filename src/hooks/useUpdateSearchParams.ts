import { useSearchParams } from "react-router";

type ParamUpdates = Record<string, string | null | undefined>;

export const useUpdateSearchParams = () => {
    const [params, setParams] = useSearchParams();

    const updateSearchParams = (
        updates: ParamUpdates,
        options?: { replace?: boolean; resetPage?: boolean },
    ) => {
        const nextParams = new URLSearchParams(params);

        for (const [key, value] of Object.entries(updates)) {
            if (value) {
                nextParams.set(key, value);
            } else {
                nextParams.delete(key);
            }
        }

        if (options?.resetPage && nextParams.get("page")) {
            nextParams.set("page", "1");
        }

        setParams(nextParams, { replace: options?.replace ?? true });
    };

    return { params, updateSearchParams };
};
