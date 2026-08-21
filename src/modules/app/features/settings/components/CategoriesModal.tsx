import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { Category, CategoryType } from "../interfaces/Category";
import { useGetCategories } from "../hooks/useGetCategories";
import { useMutateCategories } from "../hooks/useMutateCategories";

import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { CategoryIconPicker } from "@/components/icons/CategoryIconPicker";
import { Button } from "@/components/controls/Button";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { CustomModal } from "@/components/custom/CustomModal";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import {
    categoryIconKeys,
    defaultCategoryIcon,
    isCategoryIconKey,
} from "@/utils/categoryIcons";

const categorySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    type: z.enum(["INCOME", "EXPENSE"]),
    color: z.string().min(1, "El color es obligatorio"),
    icon: z.enum(categoryIconKeys as [typeof categoryIconKeys[number], ...typeof categoryIconKeys[number][]]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const defaultValues: CategoryFormValues = {
    name: "",
    type: "EXPENSE",
    color: "#F97316",
    icon: defaultCategoryIcon,
};

const typeLabels: Record<CategoryType, string> = {
    INCOME: "Ingreso",
    EXPENSE: "Gasto",
};

type TypeFilter = "ALL" | CategoryType;

interface CategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CategoriesModal = ({ isOpen, onClose }: CategoriesModalProps) => {
    const { data, isLoading, isError } = useGetCategories();
    const { createCategory } = useMutateCategories();
    const categories = data?.data ?? [];
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues,
    });

    const selectedColor = useWatch({ control, name: "color" });
    const selectedIcon = useWatch({ control, name: "icon" });

    useEffect(() => {
        const f = () => {
            if (!isOpen) {
                return;
            }
            setEditingCategory(null);
            setTypeFilter("ALL");
            reset(defaultValues);
        }
        f();
    }, [isOpen, reset]);

    const filteredCategories = useMemo(() => {
        if (typeFilter === "ALL") {
            return categories;
        }
        return categories.filter((category) => category.type === typeFilter);
    }, [categories, typeFilter]);

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        reset({
            name: category.name,
            type: category.type,
            color: category.color || "#F97316",
            icon: isCategoryIconKey(category.icon) ? category.icon : defaultCategoryIcon,
        });
    };

    const clearForm = () => {
        setEditingCategory(null);
        reset(defaultValues);
    };

    const onSubmit = async (formData: CategoryFormValues) => {
        if (editingCategory) {
            // Endpoint de update pendiente.
            return;
        }

        const promise = createCategory.mutateAsync({
            name: formData.name.trim(),
            type: formData.type,
            icon: formData.icon,
            color: formData.color,
        });

        toast.promise(promise, {
            loading: "Creando categoría...",
            success: "Categoría creada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear la categoría",
        });

        await promise;
        clearForm();
    };

    const handleDelete = (_category: Category) => {
        // Endpoint de delete pendiente.
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Administrar categorías"
            maxWidth="max-w-4xl"
        >
            <div className="flex flex-col gap-5 lg:flex-row">
                <form
                    onSubmit={(event) => {
                        void handleSubmit(onSubmit)(event);
                    }}
                    className="flex-1 rounded-xl border border-light-10 bg-surface-hard/40 p-4"
                >
                    <div className="mb-3 flex items-center gap-3">
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-light-10"
                            style={{ backgroundColor: `${selectedColor}22`, color: selectedColor }}
                        >
                            <CategoryIcon icon={selectedIcon} className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-medium text-light">
                            {editingCategory ? "Editar categoría" : "Nueva categoría"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="categoryName">Nombre</Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="categoryName"
                                        placeholder="Ej. Alimentos"
                                    />
                                )}
                            />
                            {errors.name ? (
                                <span className="text-xs text-danger">{errors.name.message}</span>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="categoryType">Tipo</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} id="categoryType">
                                        <option value="EXPENSE">Gasto</option>
                                        <option value="INCOME">Ingreso</option>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="categoryColor">Color</Label>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="categoryColor"
                                        type="color"
                                        placeholder="#F97316"
                                        className="h-10 cursor-pointer px-2 py-1"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="categoryIcon">Ícono</Label>
                            <Controller
                                name="icon"
                                control={control}
                                render={({ field }) => (
                                    <CategoryIconPicker
                                        value={field.value}
                                        color={selectedColor}
                                        onChange={(icon) => {
                                            setValue("icon", icon, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                )}
                            />
                            {errors.icon ? (
                                <span className="text-xs text-danger">{errors.icon.message}</span>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                        {editingCategory ? (
                            <button
                                type="button"
                                onClick={clearForm}
                                className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5"
                            >
                                Cancelar edición
                            </button>
                        ) : null}
                        <Button
                            type="submit"
                            text={editingCategory ? "Guardar" : "Agregar"}
                            disabled={createCategory.isPending}
                            icon={
                                editingCategory ? (
                                    <Pencil className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )
                            }
                            className="w-fit"
                        />
                    </div>
                </form>

                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-1 border-b border-light-10">
                        {(
                            [
                                { id: "ALL", label: "Todas" },
                                { id: "EXPENSE", label: "Gastos" },
                                { id: "INCOME", label: "Ingresos" },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTypeFilter(tab.id)}
                                className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
                                    typeFilter === tab.id
                                        ? "border-primary font-medium text-light"
                                        : "border-transparent text-helper hover:text-light"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-110 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <SkeletonText key={index} className="h-14 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : isError ? (
                            <CustomEmptyState
                                title="No se pudieron cargar"
                                description="Revisa tu conexión e intenta de nuevo."
                                className="m-0!"
                            />
                        ) : filteredCategories.length === 0 ? (
                            <CustomEmptyState
                                title="Sin categorías"
                                description="Agrega una categoría para empezar a clasificar tus movimientos."
                                className="m-0!"
                            />
                        ) : (
                            <ul className="flex flex-col">
                                {filteredCategories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="flex items-center gap-3 border-b border-light-10 py-3 last:border-b-0"
                                    >
                                        <span
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-10"
                                            style={{
                                                backgroundColor: `${category.color || "#64748B"}22`,
                                                color: category.color || "#64748B",
                                            }}
                                        >
                                            <CategoryIcon
                                                icon={category.icon}
                                                className="h-4 w-4"
                                            />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-light">
                                                {category.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-helper">
                                                {typeLabels[category.type] ?? category.type}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(category)}
                                                className="cursor-pointer rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light"
                                                aria-label={`Editar ${category.name}`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(category)}
                                                className="cursor-pointer rounded-lg p-2 text-helper transition-colors hover:bg-danger-sweet hover:text-danger"
                                                aria-label={`Eliminar ${category.name}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};
