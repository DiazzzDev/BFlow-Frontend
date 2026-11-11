import { DatePicker as AntDatePicker } from "antd";
import type { DatePickerProps as AntDatePickerProps } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import enUS from "antd/es/date-picker/locale/en_US";
import esES from "antd/es/date-picker/locale/es_ES";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_DATE_FORMAT = "YYYY-MM-DD";
const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";

type NativeDatePickerProps = Omit<
    AntDatePickerProps,
    "value" | "defaultValue" | "onChange" | "format" | "locale" | "minDate" | "maxDate"
>;

export interface DatePickerProps extends NativeDatePickerProps {
    id: string;
    value?: string;
    onChange: (value: string) => void;
    minDate?: string;
    maxDate?: string;
    error?: boolean;
}

/**
 * Date input for BFlow forms. It displays dates in the user's locale while
 * preserving the API's YYYY-MM-DD string format in React Hook Form.
 */
export const DatePicker = ({
    id,
    value,
    onChange,
    minDate,
    maxDate,
    error = false,
    className,
    onBlur,
    ...props
}: DatePickerProps) => {
    const { i18n, t } = useTranslation();
    const isSpanish = i18n.resolvedLanguage?.startsWith("es") ?? i18n.language.startsWith("es");

    return (
        <AntDatePicker
            {...props}
            id={id}
            value={value ? dayjs(value, API_DATE_FORMAT) : null}
            minDate={minDate ? dayjs(minDate, API_DATE_FORMAT) : undefined}
            maxDate={maxDate ? dayjs(maxDate, API_DATE_FORMAT) : undefined}
            onChange={(date) => {
                if (date && dayjs.isDayjs(date)) {
                    onChange(date.format(API_DATE_FORMAT));
                } else {
                    onChange("");
                }
            }}
            onBlur={onBlur}
            format={DISPLAY_DATE_FORMAT}
            locale={isSpanish ? esES : enUS}
            placeholder={isSpanish ? "dd/mm/aaaa" : "dd/mm/yyyy"}
            inputReadOnly
            suffixIcon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
            className={`bflow-date-picker ${error ? "bflow-date-picker--error" : ""} ${className ?? ""}`}
            classNames={{
                popup: {
                    root: "bflow-date-picker-popup",
                },
            }}
            aria-label={t("a11y.selectDate")}
        />
    );
};