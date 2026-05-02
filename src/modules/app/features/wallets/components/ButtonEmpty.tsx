import { Plus } from "lucide-react"

import { Button } from "../../../../../components/ui/button.tsx"

export const ButtonEmpty = ({onCreateClick}: {onCreateClick: () => void}) => {
    return (
        <Button onClick={onCreateClick} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ring text-primary text-sm font-medium bg-transparent">
            <Plus className="h-4 w-4" />
            Crear billetera
        </Button>
    )
}
