import { DatePicker as AntDatePicker } from "antd";
import type { DatePickerProps as AntDatePickerProps } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import enUS from "antd/es/date-picker/locale/en_US";
import esES from "antd/es/date-picker/locale/es_ES";
import { useTranslation } from "react-i18next";

const API_DATE_FORMAT = "YYYY-MM-DD";
const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";
const DATE_PICKER_CLASSES = "!w-full !min-h-[38px] !rounded-lg !border-light-10 !bg-surface-hard/40 !px-3 !font-sans !text-light !shadow-sm transition-[border-color,box-shadow,background-color] hover:!border-light-25 hover:!bg-surface hover:[background-image:var(--surface-gradient)] focus-within:!border-primary-75 focus-within:!bg-surface focus-within:[background-image:var(--surface-gradient)] focus-within:!shadow-[0_0_0_2px_var(--color-primary-15)] disabled:!bg-surface-hard/40 disabled:!opacity-50 [&_.ant-picker-input>input]:!text-light [&_.ant-picker-input>input::placeholder]:!text-placeholder [&_.ant-picker-suffix]:!text-helper [&_.ant-picker-clear]:!text-light";
const DATE_PICKER_POPUP_CLASSES = "[&_.ant-picker-panel-container]:!overflow-hidden [&_.ant-picker-panel-container]:!rounded-xl [&_.ant-picker-panel-container]:!border-light-10 [&_.ant-picker-panel-container]:!bg-surface [&_.ant-picker-panel-container]:[background-image:var(--surface-gradient)] [&_.ant-picker-panel-container]:!shadow-custom [&_.ant-picker-panel-container]:!font-sans [&_.ant-picker-panel]:!border-light-10 [&_.ant-picker-panel]:!bg-transparent [&_.ant-picker-date-panel]:!border-light-10 [&_.ant-picker-date-panel]:!bg-transparent [&_.ant-picker-header]:!border-light-10 [&_.ant-picker-header]:!bg-transparent [&_.ant-picker-footer]:!border-light-10 [&_.ant-picker-footer]:!bg-transparent [&_.ant-picker-header_button]:!text-light [&_.ant-picker-content_th]:!text-light [&_.ant-picker-cell]:!text-light [&_.ant-picker-cell:not(.ant-picker-cell-in-view)]:!text-helper [&_.ant-picker-cell-inner::before]:!border-primary [&_.ant-picker-cell:hover_.ant-picker-cell-inner]:!bg-primary-15 [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner::before]:!bg-primary-15 [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-primary [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!text-white [&_.ant-picker-today-btn]:!text-primary";

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
            className={`${DATE_PICKER_CLASSES} ${error ? "!border-danger hover:!border-danger" : ""} ${className ?? ""}`}
            classNames={{
                popup: {
                    root: DATE_PICKER_POPUP_CLASSES,
                },
            }}
            aria-label={t("a11y.selectDate")}
        />
    );
};
