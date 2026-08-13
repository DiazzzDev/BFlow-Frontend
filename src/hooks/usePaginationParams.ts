import { useSearchParams } from "react-router";

export const DEFAULT_PAGE_SIZE = 5;

/** URL uses 1-based `page` + `limit`. Spring API uses 0-based `page` + `size`. */
export const usePaginationParams = () => {
    const [params] = useSearchParams();

    const rawPage = Number(params.get("page") ?? "1");
    const rawLimit = Number(params.get("limit") ?? String(DEFAULT_PAGE_SIZE));

    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit =
        Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : DEFAULT_PAGE_SIZE;

    return {
        page,
        limit,
        apiPage: page - 1,
    };
};
