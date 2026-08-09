import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { DEFAULT_PAGE_SIZE } from "@/hooks/usePaginationParams";

interface PaginationSelectProps {
    totalItems?: number;
    numberOfElements?: number;
}

const baseOptions = [5, 10, 15, 20, 25];

export const PaginationSelect = ({
    totalItems = 0,
    numberOfElements,
}: PaginationSelectProps) => {
    const { params, updateSearchParams } = useUpdateSearchParams();
    const limit = params.get("limit") || String(DEFAULT_PAGE_SIZE);

    const availableOptions = baseOptions.filter(
        (option) => option <= totalItems || option === DEFAULT_PAGE_SIZE,
    );

    const showing =
        numberOfElements ?? Math.min(Number(limit) || DEFAULT_PAGE_SIZE, totalItems);

    return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-helper">
            <span className="min-w-0">
                Mostrando {showing} de {totalItems} resultados
            </span>

            <div className="relative w-auto shrink-0 overflow-hidden rounded-lg border border-light-10 bg-surface">
                <select
                    id="paginationLimit"
                    value={limit}
                    aria-label="Resultados por página"
                    onChange={(event) => {
                        updateSearchParams(
                            {
                                limit:
                                    event.target.value === String(DEFAULT_PAGE_SIZE)
                                        ? null
                                        : event.target.value,
                                page: null,
                            },
                            { replace: false },
                        );
                    }}
                    className="w-auto min-w-16 cursor-pointer appearance-none bg-transparent px-3 py-1.5 pr-8 text-sm text-light focus:outline-none"
                >
                    {availableOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[10px] text-helper">
                    ▼
                </div>
            </div>
        </div>
    );
};
