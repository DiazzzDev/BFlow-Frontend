import { Plus } from "lucide-react"

import { Button } from "../../../../../components/ui/button.jsx"

export const ButtonEmpty = ({onCreateClick}) => {
    return (
        <Button onClick={onCreateClick} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--btn-primary-bg)] text-[var(--btn-primary-bg)] text-sm font-medium bg-transparent">
            <Plus className="h-4 w-4" />
            Crear billetera
        </Button>
    )
}