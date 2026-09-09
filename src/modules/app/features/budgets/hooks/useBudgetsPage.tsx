import { useSearchParams } from "react-router";
import { useState } from "react";

import { useGetBudgets } from "./useGetBudgets";

import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";

export const useBudgetsPage = () => {
    const [params] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 650);
    const sort = params.get("sort") || "amount,desc";
    const periodParam = params.get("period") || "ALL";
    const period = periodParam === "ALL" ? undefined : periodParam;
    const { apiPage, limit } = usePaginationParams();

    const { data, isLoading } = useGetBudgets({
        query: debouncedQuery,
        sort,
        period,
        page: apiPage,
        size: limit,
    });

    const budgets = data?.data.content ?? [];
    const totalBudgets = data?.data.totalElements ?? budgets.length;
    const totalPages = data?.data.totalPages ?? 0;
    const numberOfElements = data?.data.numberOfElements ?? budgets.length;
    const totalLimit = budgets.reduce((sum, budget) => sum + (budget.budgetLimit), 0);
    const hasActiveFilters = Boolean(query.trim() || period || sort !== "amount,desc");

    return {
        budgets,
        isLoading,
        totalBudgets,
        totalPages,
        numberOfElements,
        totalLimit,
        hasActiveFilters,
        isModalOpen,
        sort,
        periodParam,
        setIsModalOpen,
    };
}