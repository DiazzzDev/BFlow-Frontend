import { historyTypeTabs } from "../history.filters";

import { SearchInput } from "@/components/controls/SearchInput";
import { TabFilter } from "@/components/controls/TabFilter";

interface HistoryFiltersProps {
    selectedType: string;
}

export const HistoryFilters = ({ selectedType }: HistoryFiltersProps) => {
    return (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <SearchInput
                id="txtSearchHistory"
                placeholder="Buscar transacciones..."
                syncToParams
                className="w-full max-w-none min-w-0 xl:max-w-md"
            />

            <TabFilter
                options={historyTypeTabs.map((tab) => ({
                    label: tab.label,
                    value: tab.value,
                }))}
                selected={selectedType}
                keyFilter="type"
                responsive="scroll"
                layoutId="historyTypeFilter"
            />
        </div>
    );
};
