import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Label } from './Label'

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
}

export const SelectAutoComplete = <T,>({ selectedItem, setSelectedItem, query, setQuery, data, label, idSelect, getKey, getLabel }: SelectAutoCompleteProps<T>) => {
    return (
        <Combobox as="div" value={selectedItem} onChange={(item : T | null) => {
            if (!item) { return }
            setQuery('')
            setSelectedItem(item)
        }}>
            <Label htmlFor={idSelect}>{label}</Label>

            <div className="relative mt-2">
                <ComboboxInput
                    id={idSelect}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-dark shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value || '')}
                />

                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-3 text-tertiary">
                    <ChevronDownIcon className="size-5" aria-hidden="true" />
                </ComboboxButton>

                <ComboboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface py-1 text-sm shadow-lg data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0"
                >
                    {query.length > 0 && (
                        <ComboboxOption
                            value={{ id: null, name: query }}
                            className="cursor-pointer select-none px-3 py-2 text-dark data-focus:bg-primary data-focus:text-primary-foreground"
                        >
                            {query}
                        </ComboboxOption>
                    )}

                    {data.map((item) => (
                        <ComboboxOption
                            key={getKey(item)}
                            value={item}
                            className="cursor-pointer select-none px-3 py-2 text-dark data-focus:bg-primary data-focus:text-primary-foreground"
                        >
                            <span className="block truncate">
                                {getLabel(item)}
                            </span>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </div>
        </Combobox>
    )
}