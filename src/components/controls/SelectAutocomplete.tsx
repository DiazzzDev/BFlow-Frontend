import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Label } from "./Label";

interface SelectAutoCompleteProps<T> {
    selectedItem: T | null;
    setSelectedItem: (item: T) => void;
    query: string;
    setQuery: (query: string) => void;
    data: T[];
    label: string;
    idSelect: string;
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    placeholder?: string;
    disabled?: boolean;
    allowCreate?: boolean;
}

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
}: SelectAutoCompleteProps<T>) => {
    const filteredData =
        query === ""
            ? data
            : data.filter((item) =>
                  getLabel(item).toLowerCase().includes(query.toLowerCase()),
              );

    return (
        <Combobox
            as="div"
            value={selectedItem}
            disabled={disabled}
            onChange={(item: T | null) => {
                if (!item) {return;}
                setQuery("");
                setSelectedItem(item);
            }}
        >
            <Label htmlFor={idSelect}>{label}</Label>

            <div className="relative mt-2">
                <ComboboxInput
                    id={idSelect}
                    placeholder={placeholder}
                    displayValue={(item: T | null) => (item ? getLabel(item) : "")}
                    className="w-full rounded-lg border border-light-10 bg-surface px-4 py-2 pr-10 text-sm text-light shadow-sm transition-colors placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setQuery(event.target.value || "")
                    }
                />

                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-3 text-helper">
                    <ChevronDownIcon className="size-5" aria-hidden="true" />
                </ComboboxButton>

                <ComboboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-light-10 bg-surface py-1 text-sm shadow-lg data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0"
                >
                    {allowCreate && query.length > 0 && (
                        <ComboboxOption
                            value={{ id: null, name: query } as T}
                            className="cursor-pointer select-none px-3 py-2 text-light data-focus:bg-primary data-focus:text-light"
                        >
                            Crear “{query}”
                        </ComboboxOption>
                    )}

                    {filteredData.length === 0 ? (
                        <div className="px-3 py-2 text-helper">Sin resultados</div>
                    ) : (
                        filteredData.map((item) => (
                            <ComboboxOption
                                key={getKey(item)}
                                value={item}
                                className="cursor-pointer select-none px-3 py-2 text-light data-focus:bg-primary data-focus:text-light"
                            >
                                <span className="block truncate">{getLabel(item)}</span>
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
};
