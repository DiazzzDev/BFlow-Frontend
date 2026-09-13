import {
    isDetailTab,
    isManagementTab,
    TAB_TO_TYPE,
    type DetailTab,
} from "../utils/tabs/walletViewTabs";

import { useGetOverview } from "./useGetOverview";
import { useGetTransactions } from "./useGetTransactions";
import { useGetWallet } from "./useGetWallet";
import { useGetWalletDetails } from "./useGetWalletDetails";

import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

export const useWalletViewPage = (walletId: string) => {
    // URL filters + pagination (query is debounced before hitting the API)
    const { params, updateSearchParams } = useUpdateSearchParams();
    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const tabParam = params.get("tab");
    const activeTab: DetailTab = isDetailTab(tabParam) ? tabParam : "overview";
    const { apiPage, limit } = usePaginationParams();

    // Transaction list type for income/expense tabs; null on overview/management
    const transactionType =
        isManagementTab(activeTab) || activeTab === "overview"
            ? null
            : TAB_TO_TYPE[activeTab];

    // Wallet entity + sidebar stats (/info)
    const { data: walletDetailsResponse, isLoading: isWalletDetailsLoading } =
        useGetWalletDetails(walletId);
    const { data: walletResponse, isLoading: isWalletLoading } =
        useGetWallet(walletId);

    // Overview list (all types) vs filtered list by tab type
    const overviewQuery = useGetOverview(
        walletId,
        debouncedQuery,
        activeTab === "overview",
        apiPage,
        limit,
    );
    const transactionsQuery = useGetTransactions(
        walletId,
        transactionType,
        debouncedQuery,
        apiPage,
        limit,
    );

    // Which list feeds the transactions panel for the current tab
    const activeList =
        activeTab === "overview"
            ? overviewQuery
            : isManagementTab(activeTab)
              ? null
              : transactionsQuery;

    // Derived page / sidebar data
    const wallet = walletResponse?.data;
    const walletDetails = walletDetailsResponse?.data;
    const transactions = activeList?.data?.data.content ?? [];
    const totalTransactions = activeList?.data?.data.totalElements ?? 0;
    const totalPages = activeList?.data?.data.totalPages ?? 0;
    const numberOfElements =
        activeList?.data?.data.numberOfElements ?? transactions.length;
    const isLoadingList = activeList?.isLoading ?? false;
    const isNotFound = !isWalletLoading && !!walletId && !wallet;

    // Persist tab in the URL (`overview` omits the param)
    const setTab = (tab: DetailTab) => {
        updateSearchParams(
            {
                tab: tab === "overview" ? null : tab,
            },
            { resetPage: true },
        );
    };

    return {
        query,
        activeTab,
        transactionType,
        setTab,
        wallet,
        isWalletLoading,
        isNotFound,
        transactions,
        totalTransactions,
        totalPages,
        numberOfElements,
        isLoadingList,
        sidebar: {
            lastActivity: walletDetails?.lastActivity ?? "—",
            highestExpense: walletDetails?.highestExpense ?? "—",
            transactionsCount: walletDetails?.transactions ?? 0,
            initialValue: walletDetails?.initialValue ?? 0,
            currency: wallet?.currency ?? "USD",
            upcoming: walletDetails?.upcoming ?? [],
            isLoading: isWalletDetailsLoading,
        },
    };
};
