import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { useGetCategories } from "../../hooks/useGetCategories";
import { useMutateCategories } from "../../hooks/useMutateCategories";
import {
    CATEGORY_TYPE_TABS,
    type CategoryTypeFilter,
} from "../../utils/filters";
import {
    CATEGORY_TYPE_FORM_OPTIONS,
    CATEGORY_TYPE_LABELS,
} from "../../utils/categoryType";

import { CategoryIcon } from "@/components/icons/CategoryIcon";
import type { Category } from "@/modules/app/interfaces/Category";
import { CATEGORY_TYPE_VALUES } from "@/modules/app/interfaces/Category";
import { CategoryIconPicker } from "@/components/icons/CategoryIconPicker";
import { Button } from "@/components/controls/Button";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import {
    categoryIconKeys,
    defaultCategoryIcon,
    isCategoryIconKey,
} from "@/utils/categoryIcons";

const createCategorySchema = (t: TFunction) => z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    type: z.enum(CATEGORY_TYPE_VALUES),
    color: z.string().min(1, t("validation.colorRequired")),
    icon: z.enum(categoryIconKeys as [typeof categoryIconKeys[number], ...typeof categoryIconKeys[number][]]),
});

type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;

const defaultValues: CategoryFormValues = {
    name: "",
    type: "EXPENSE",
    color: "#F97316",
    icon: defaultCategoryIcon,
};

export const CategoriesManager = () => {
    const { t } = useTranslation();
    const categorySchema = createCategorySchema(t);
    // Categories list + create mutation
    const { data, isLoading, isError } = useGetCategories();
    const createCategory = useMutateCategories();
    const categories = data?.data ?? [];

    // List filter + which category is being edited (null = create mode)
    const [typeFilter, setTypeFilter] = useState<CategoryTypeFilter>("EXPENSE");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // RHF form + watched color/icon for the preview chip
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

    // Filtered list for the right-hand panel
    const filteredCategories = categories.filter((category) => category.type === typeFilter);

    // Load a category into the form for edit mode
    const startEdit = (category: Category) => {
        setEditingCategory(category);
        setTypeFilter(category.type);
        reset({
            name: category.name,
            type: category.type,
            color: category.color || "#F97316",
            icon: isCategoryIconKey(category.icon)
                ? category.icon
                : defaultCategoryIcon,
        });
        requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    // Back to create mode with empty defaults
    const clearForm = () => {
        setEditingCategory(null);
        reset(defaultValues);
    };

    // Create only for now — update endpoint is still pending
    const onSubmit = async (formData: CategoryFormValues) => {
        if (editingCategory) {
            return;
        }

        const promise = createCategory.mutateAsync({
            name: formData.name.trim(),
            type: formData.type,
            icon: formData.icon,
            color: formData.color,
        });

        toast.promise(promise, {
            loading: t("profile.categoryLoading"),
            success: (response) => getApiMessage(response, t("profile.categoryFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
        clearForm();
    };

    // Delete endpoint still pending
    const handleDelete = (_category: Category) => { };

    return (
        <div className="flex flex-col gap-6">
            <form
                ref={formRef}
                onSubmit={(event) => {
                    void handleSubmit(onSubmit)(event);
                }}
                className="flex flex-col gap-5"
            >
                <fieldset className="grid grid-cols-1 gap-5 rounded-xl border border-light-10 bg-surface-hard/40 px-4 pb-4 pt-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(19rem,1.1fr)]">
                    <legend className="px-1 text-sm font-semibold text-light">
                        {editingCategory ? t("settings.categoryEdit") : t("settings.categoryNew")}
                    </legend>

                    <div className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label htmlFor="categoryName">{t("settings.name")}</Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="categoryName"
                                        placeholder={t("settings.nameExample")}
                                    />
                                )}
                            />
                            {errors.name ? (
                                <span className="text-xs text-danger">
                                    {errors.name.message}
                                </span>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="categoryType">{t("settings.type")}</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} id="categoryType">
                                        {CATEGORY_TYPE_FORM_OPTIONS.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {t(`settings.categoryType.${option.value}`, { defaultValue: option.label })}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="categoryColor">{t("settings.color")}</Label>
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
                    </div>

                    <div className="flex min-w-0 flex-col gap-1.5">
                        <Label htmlFor="categoryIcon">{t("settings.icon")}</Label>
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
                            <span className="text-xs text-danger">
                                {errors.icon.message}
                            </span>
                        ) : null}
                    </div>
                </fieldset>

                <div className="flex flex-col gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-light">
                            {t("settings.categoriesListTitle")}
                        </h3>
                        <p className="mt-1 text-sm text-helper">
                            {t("settings.categoriesListDescription")}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {editingCategory ? (
                            <button
                                type="button"
                                onClick={clearForm}
                                className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5"
                            >
                                {t("settings.cancelEdit")}
                            </button>
                        ) : null}
                        <Button
                            type="submit"
                            text={editingCategory ? t("common.save") : t("settings.add")}
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
                </div>
            </form>

            <section className="flex flex-col gap-3 rounded-xl border border-light-10 bg-surface-hard/40 p-4">
                <div className="flex items-center gap-1 border-b border-light-10">
                    {CATEGORY_TYPE_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTypeFilter(tab.id)}
                            className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${typeFilter === tab.id
                                ? "border-primary font-medium text-light"
                                : "border-transparent text-helper hover:text-light"
                                }`}
                        >
                            {t(`settings.categoryType.${tab.id}`, { defaultValue: tab.label })}
                        </button>
                    ))}
                </div>

                <div className="max-h-110 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonText
                                    key={index}
                                    className="h-14 w-full rounded-xl"
                                />
                            ))}
                        </div>
                    ) : isError ? (
                        <CustomEmptyState
                            title={t("settings.categoriesLoadError")}
                            description={t("settings.connectionHint")}
                            className="m-0!"
                        />
                    ) : filteredCategories.length === 0 ? (
                        <CustomEmptyState
                            title={t("settings.noCategories")}
                            description={t("settings.categoryHint")}
                            className="m-0!"
                        />
                    ) : (
                        <ul className="flex flex-col">
                            {filteredCategories.map((category) => (
                                <li key={category.id} className="flex items-center gap-2 border-b border-light-10 py-2 last:border-b-0">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(category)}
                                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg p-1 text-left transition-colors hover:bg-light-5"
                                        aria-label={`${t("settings.edit")} ${category.name}`}
                                    >
                                        <span
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-10"
                                            style={{
                                                backgroundColor: `${category.color || "#64748B"}22`,
                                                color: category.color || "#64748B",
                                            }}
                                        >
                                            <CategoryIcon icon={category.icon} className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-light">
                                                {category.name}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-helper">
                                                {CATEGORY_TYPE_LABELS[category.type]}
                                            </span>
                                        </span>
                                    </button>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(category)}
                                            className="cursor-pointer rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light"
                                            aria-label={`${t("settings.edit")} ${category.name}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(category)}
                                            className="cursor-pointer rounded-lg p-2 text-helper transition-colors hover:bg-danger-sweet hover:text-danger"
                                            aria-label={`${t("settings.delete")} ${category.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};
