import { Search } from "lucide-react"

import { Input } from "./Input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder: string;
}

export const SearchInput = ({ id, placeholder, className, ...props }: SearchInputProps) => {
    return (
        <div className="relative min-w-[300px] !flex-2 md:flex-initial">
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
            />
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                className={`h-10 text-sm rounded-xl border-border bg-surface px-11 ${className || ''}`}
                {...props}
            />
        </div>
    )
}