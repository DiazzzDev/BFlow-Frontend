import { MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useResendCooldown } from "../hooks/useResendCooldown";
import { RESEND_COOLDOWN_SECONDS, VERIFICATION_CODE_LENGTH } from "../utils/verificationCode";

import { VerificationCodeInput } from "./VerificationCodeInput";

import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";
import {
    authErrorClass,
    authFieldClass,
    authHintClass,
    authLabelClass,
    authPrimaryButtonClass,
    authTextLinkClass,
} from "@/modules/auth/utils/authStyles";

interface VerifyAccountFormProps {
    email: string;
    onSubmit: (args: { email: string; code: string }) => Promise<unknown>;
    onResendCode: (email: string) => Promise<unknown>;
    isLoading: boolean;
    isResending: boolean;
}

const CODE_LABEL_ID = "verify-code-label";

export const VerifyAccountForm = ({ email, onSubmit, onResendCode, isLoading, isResending }: VerifyAccountFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [showIncomplete, setShowIncomplete] = useState(false);
    const { seconds: cooldown, restart: restartCooldown } = useResendCooldown(RESEND_COOLDOWN_SECONDS);

    const verify = async (value: string) => {
        if (isLoading) {
            return;
        }
        if (value.length < VERIFICATION_CODE_LENGTH) {
            setShowIncomplete(true);
            return;
        }
        try {
            await toast.promise(onSubmit({ email, code: value }), {
                loading: t("auth.verifyLoading"),
                success: t("auth.verifySuccess"),
                error: (err) => getCognitoErrorMessage(err, t("auth.verifyError")),
            }).unwrap();
            void navigate(`/auth/login?email=${encodeURIComponent(email)}`);
        } catch {
            setCode("");
        }
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        setShowIncomplete(false);
        if (value.length === VERIFICATION_CODE_LENGTH) {
            void verify(value);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || isResending) {
            return;
        }
        try {
            await toast.promise(onResendCode(email), {
                loading: t("auth.verifyResending"),
                success: t("auth.verifyResendSuccess"),
                error: (err) => getCognitoErrorMessage(err, t("auth.verifyResendError")),
            }).unwrap();
            setCode("");
            restartCooldown();
        } catch {
            // Error handled by toast
        }
    };

    const resendLabel = isResending
        ? t("auth.verifyResending")
        : cooldown > 0
            ? t("auth.verifyResendIn", { seconds: cooldown })
            : t("auth.verifyResend");

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault();
                void verify(code);
            }}
        >
            <div className={authFieldClass}>
                <span id={CODE_LABEL_ID} className={authLabelClass}>
                    {t("auth.verifyCodeLabel")}
                </span>
                <VerificationCodeInput
                    value={code}
                    onChange={handleCodeChange}
                    labelledBy={CODE_LABEL_ID}
                    disabled={isLoading}
                    invalid={showIncomplete}
                />
                {showIncomplete && <p className={authErrorClass}>{t("auth.verifyCodeIncomplete")}</p>}
            </div>

            <div className="flex items-center justify-between gap-3">
                <span className={authHintClass}>{t("auth.verifyNoCode")}</span>
                <button
                    type="button"
                    disabled={cooldown > 0 || isResending || isLoading}
                    onClick={() => void handleResend()}
                    className={`inline-flex cursor-pointer items-center gap-1.5 text-xs tabular-nums disabled:pointer-events-none disabled:opacity-50 ${authTextLinkClass}`}
                >
                    <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
                    {resendLabel}
                </button>
            </div>

            <button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
                {isLoading ? t("auth.verifyLoading") : t("auth.verifyButton")}
            </button>

            <div className="flex items-start gap-2.5 rounded-lg border border-light-10 bg-surface-hard/60 p-3 text-xs text-helper">
                <MailCheck size={15} className="mt-px shrink-0 text-primary" />
                <span>{t("auth.verifySpamHint")}</span>
            </div>
        </form>
    );
};
