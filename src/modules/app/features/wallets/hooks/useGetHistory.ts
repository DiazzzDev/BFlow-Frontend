import { useGetHistory as useGetHistoryQuery } from "../../history/hooks/useGetHistory";

export const useGetHistory = () => useGetHistoryQuery({ preview: true });
