import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { APIError } from "./api";
import type { ApiFieldError } from "./api.interfaces";

const isApiFieldError = (value: unknown): value is ApiFieldError => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const error = value as Record<string, unknown>;

    return typeof error.field === "string" && typeof error.message === "string";
};

const getErrorPayloads = (error: unknown): unknown[] => {
    if (error instanceof APIError) {
        return [error.cause];
    }

    if (typeof error !== "object" || error === null) {
        return [];
    }

    const errorRecord = error as Record<string, unknown>;
    const response = errorRecord.response as Record<string, unknown> | undefined;

    return [errorRecord, errorRecord.data, response?.data];
};

/** Returns the field-level validation errors included in a backend response. */
export const getApiValidationErrors = (error: unknown): ApiFieldError[] => {
    for (const payload of getErrorPayloads(error)) {
        if (typeof payload !== "object" || payload === null) {
            continue;
        }

        const errors = (payload as Record<string, unknown>).errors;
        if (!Array.isArray(errors)) {
            continue;
        }

        return errors.filter(isApiFieldError);
    }

    return [];
};

/**
 * Associates backend `errors[].field` values with react-hook-form fields.
 * `fieldMap` is only necessary when the API and form use different names.
 */
export const setApiValidationErrors = <TFieldValues extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<TFieldValues>,
    fieldMap: Partial<Record<string, Path<TFieldValues>>> = {},
): boolean => {
    const validationErrors = getApiValidationErrors(error);

    validationErrors.forEach(({ field, message }) => {
        const formField = fieldMap[field] ?? (field as Path<TFieldValues>);

        setError(formField, { type: "server", message });
    });

    return validationErrors.length > 0;
};
