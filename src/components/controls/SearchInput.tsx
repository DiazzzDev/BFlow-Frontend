import { Search } from "lucide-react";

import { Input } from "./Input";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder: string;
    paramKey?: string;
    syncToParams?: boolean;
}

export const SearchInput = ({
    id,
    placeholder,
    className,
    paramKey = "query",
    syncToParams = false,
    value,
    onChange,
    ...props
}: SearchInputProps) => {
    const { params, updateSearchParams } = useUpdateSearchParams();
    const paramValue = params.get(paramKey) ?? "";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!syncToParams) {
            onChange?.(event);
            return;
        }

        updateSearchParams(
            { [paramKey]: event.target.value || null },
            { resetPage: true },
        );
    };

    return (
        <div className="relative min-w-75 max-w-140 flex-2!">
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
            />
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                className={`h-10 text-sm rounded-xl border-light-10 bg-surface w-full px-11 ${className || ""}`}
                value={syncToParams ? paramValue : value}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};
