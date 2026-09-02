import { useMemo, type ReactNode } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Label } from "./Label";

interface SelectAutoCompleteProps<T> {
    selectedItem: T | null;
    setSelectedItem: (item: T | null) => void;
    query: string;
    setQuery: (query: string) => void;
    data: T[];
    label?: string;
    idSelect: string;
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    placeholder?: string;
    disabled?: boolean;
    allowCreate?: boolean;
    showSearchIcon?: boolean;
    /** When false, shows `data` as-is (useful for remote search). Default true. */
    filterLocally?: boolean;
    /**
     * When true (default), the options list floats with absolute/portal positioning.
     * When false, the list stays in document flow and takes up space.
     */
    portal?: boolean;
    isOptionDisabled?: (item: T) => boolean;
    renderOption?: (item: T) => ReactNode;
}

const inputClassNameWithIcon =
    "h-11 w-full rounded-xl border border-light-10 bg-surface pl-10 pr-10 text-sm text-light shadow-sm transition-colors placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

const inputClassNameWithoutIcon =
    "h-11 w-full rounded-xl border border-light-10 bg-surface px-4 pr-10 text-sm text-light shadow-sm transition-colors placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

const floatingOptionsClassName =
    "z-50 mt-2 max-h-60 w-[var(--input-width)] overflow-auto rounded-xl border border-light-10 bg-surface-hard p-1.5 text-sm shadow-xl empty:invisible";

const inlineOptionsClassName =
    "relative mt-2 max-h-60 w-full overflow-auto rounded-xl border border-light-10 bg-surface-hard p-1.5 text-sm empty:hidden";

const optionClassName =
    "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-light transition-colors data-focus:bg-primary/15 data-selected:bg-primary/10 data-selected:font-medium data-disabled:cursor-not-allowed data-disabled:opacity-50";

export const SelectAutoComplete = <T,>({
    selectedItem,
    setSelectedItem,
    query,
    setQuery,
    data,
    label,
    idSelect,
    getKey,
    getLabel,
    placeholder = "Buscar...",
    disabled = false,
    allowCreate = false,
    showSearchIcon = true,
    filterLocally = true,
    portal = true,
    isOptionDisabled,
    renderOption,
}: SelectAutoCompleteProps<T>) => {
    const selectedLabel = selectedItem ? getLabel(selectedItem) : "";
    const isEditingSelection = query.length > 0 && query !== selectedLabel;
    const comboboxValue = isEditingSelection ? null : selectedItem;
    const inputDisplayValue = query || selectedLabel;

    const filteredData = useMemo(() => {
        if (!filterLocally || !query.trim()) {
            return data;
        }

        const normalizedQuery = query.trim().toLowerCase();
        return data.filter((item) =>
            getLabel(item).toLowerCase().includes(normalizedQuery),
        );
    }, [data, filterLocally, getLabel, query]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        if (selectedItem && value !== getLabel(selectedItem)) {
            setSelectedItem(null);
        }
    };

    return (
        <Combobox
            as="div"
            value={comboboxValue}
            disabled={disabled}
            onChange={(item: T | null) => {
                if (!item) {
                    return;
                }

                setQuery("");
                setSelectedItem(item);
            }}
        >
            <Label htmlFor={idSelect}>{label}</Label>

            <div className="relative mt-2 [--anchor-gap:0px]">
                {showSearchIcon ? (
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-helper"
                    />
                ) : null}

                <ComboboxInput
                    id={idSelect}
                    placeholder={placeholder}
                    displayValue={() => inputDisplayValue}
                    className={
                        showSearchIcon ? inputClassNameWithIcon : inputClassNameWithoutIcon
                    }
                    onChange={handleInputChange}
                />

                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-helper transition-colors hover:text-light">
                    <ChevronDown className="size-4" aria-hidden="true" />
                </ComboboxButton>

                <ComboboxOptions
                    {...(portal
                        ? { portal: true as const, anchor: "bottom start" as const }
                        : { modal: false as const })}
                    className={portal ? floatingOptionsClassName : inlineOptionsClassName}
                >
                    {allowCreate && query.trim().length > 0 && (
                        <ComboboxOption
                            value={{ id: null, name: query } as T}
                            className={optionClassName}
                        >
                            <span className="truncate">Crear “{query.trim()}”</span>
                        </ComboboxOption>
                    )}

                    {filteredData.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-helper">
                            Sin resultados
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <ComboboxOption
                                key={getKey(item)}
                                value={item}
                                disabled={isOptionDisabled?.(item)}
                                className={optionClassName}
                            >
                                <Check
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-primary opacity-0 group-data-selected:opacity-100"
                                />
                                {renderOption ? (
                                    renderOption(item)
                                ) : (
                                    <span className="truncate">{getLabel(item)}</span>
                                )}
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
};
