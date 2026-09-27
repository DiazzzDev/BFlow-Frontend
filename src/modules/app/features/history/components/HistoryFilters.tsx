import { HISTORY_TYPE_TABS } from "../filters";
import { useTranslation } from "react-i18next";

import { SearchInput } from "@/components/controls/SearchInput";
import { TabFilter } from "@/components/controls/TabFilter";

interface HistoryFiltersProps {
    selectedType: string;
}

export const HistoryFilters = ({ selectedType }: HistoryFiltersProps) => {
    const { t } = useTranslation();
    const tabs = HISTORY_TYPE_TABS.map((tab) => ({ ...tab, label: t(`history.${tab.value === "ALL" ? "all" : tab.value === "INCOME" ? "income" : tab.value === "EXPENSE" ? "expense" : "transfer"}`, { defaultValue: tab.label }) }));
    return (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <SearchInput
                id="txtSearchHistory"
                placeholder={t("history.search")}
                syncToParams
                className="w-full max-w-none min-w-0 xl:max-w-md"
            />

            <TabFilter
                options={tabs}
                selected={selectedType}
                keyFilter="type"
                responsive="scroll"
                layoutId="historyTypeFilter"
            />
        </div>
    );
};
