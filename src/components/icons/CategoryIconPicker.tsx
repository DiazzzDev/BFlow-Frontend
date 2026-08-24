import { CategoryIcon } from "@/components/icons/CategoryIcon";
import {
    categoryIconKeys,
    type CategoryIconKey,
} from "@/utils/categoryIcons";

interface CategoryIconPickerProps {
    value: string;
    onChange: (icon: CategoryIconKey) => void;
    color?: string;
}

export const CategoryIconPicker = ({
    value,
    onChange,
    color = "#F97316",
}: CategoryIconPickerProps) => {
    return (
        <div className="grid max-h-44 grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-light-10 bg-surface p-2 sm:grid-cols-8">
            {categoryIconKeys.map((iconKey) => {
                const isSelected = value === iconKey;

                return (
                    <button
                        key={iconKey}
                        type="button"
                        onClick={() => onChange(iconKey)}
                        title={iconKey}
                        aria-label={`Seleccionar ícono ${iconKey}`}
                        aria-pressed={isSelected}
                        className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                            isSelected
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-transparent text-helper hover:bg-light-5 hover:text-light"
                        }`}
                    >
                        <CategoryIcon
                            icon={iconKey}
                            className="h-4 w-4"
                            style={isSelected ? { color } : undefined}
                        />
                    </button>
                );
            })}
        </div>
    );
};
