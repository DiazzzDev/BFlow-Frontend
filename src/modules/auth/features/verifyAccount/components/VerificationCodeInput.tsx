import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

import { sanitizeVerificationCode, VERIFICATION_CODE_LENGTH } from "../utils/verificationCode";

interface VerificationCodeInputProps {
    value: string;
    onChange: (value: string) => void;
    labelledBy: string;
    disabled?: boolean;
    invalid?: boolean;
}

export const VerificationCodeInput = ({
    value,
    onChange,
    labelledBy,
    disabled = false,
    invalid = false,
}: VerificationCodeInputProps) => {
    const { t } = useTranslation();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const digits = Array.from({ length: VERIFICATION_CODE_LENGTH }, (_, index) => value.charAt(index));

    const focusAt = (index: number) => {
        const target = Math.min(Math.max(index, 0), VERIFICATION_CODE_LENGTH - 1);
        inputsRef.current[target]?.focus();
    };

    useEffect(() => {
        if (!value && !disabled) {
            inputsRef.current[0]?.focus();
        }
    }, [value, disabled]);

    const handleChange = (index: number, rawValue: string) => {
        const typed = sanitizeVerificationCode(rawValue);
        if (!typed) {
            return;
        }
        // A single box can receive the whole code (OS one-time-code autofill)
        const next = sanitizeVerificationCode(value.slice(0, index) + typed + value.slice(index + typed.length));
        onChange(next);
        focusAt(index + typed.length);
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            event.preventDefault();
            if (digits[index]) {
                onChange(value.slice(0, index) + value.slice(index + 1));
                return;
            }
            onChange(value.slice(0, index - 1) + value.slice(index));
            focusAt(index - 1);
            return;
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            focusAt(index - 1);
            return;
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            focusAt(Math.min(index + 1, value.length));
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = sanitizeVerificationCode(event.clipboardData.getData("text"));
        if (!pasted) {
            return;
        }
        onChange(pasted);
        focusAt(pasted.length);
    };

    // Digits stay contiguous, so focusing a box past the first empty one jumps back to it
    const handleFocus = (index: number) => {
        if (index > value.length) {
            focusAt(value.length);
            return;
        }
        inputsRef.current[index]?.select();
    };

    return (
        <div role="group" aria-labelledby={labelledBy} className="grid grid-cols-6 gap-2 sm:gap-3">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputsRef.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={t("auth.verifyDigitLabel", { index: index + 1, total: VERIFICATION_CODE_LENGTH })}
                    aria-invalid={invalid}
                    disabled={disabled}
                    value={digit}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    className={`h-12 w-full rounded-lg border bg-surface-hard text-center font-mono text-xl font-semibold text-light caret-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:text-2xl ${
                        invalid ? "border-danger" : digit ? "border-light-25" : "border-light-10"
                    }`}
                />
            ))}
        </div>
    );
};
