import { useEffect, useState, type ReactNode } from "react";
import { QRCode } from "antd";
import {
    ArrowLeft,
    CheckCircle2,
    Copy,
    Info,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useMfaSetup } from "../hooks/useMfaSetup";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { Input } from "@/components/controls/Input";

interface MfaSetupPageProps {
    onBack: () => void;
    onComplete: () => void;
}

export const MfaSetupPage = ({ onBack, onComplete }: MfaSetupPageProps) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const { setUp, verify } = useMfaSetup();
    const startSetup = setUp.mutate;
    const [code, setCode] = useState("");
    const [isSecretVisible, setIsSecretVisible] = useState(false);

    useEffect(() => {
        startSetup();
    }, [startSetup]);

    const setupDetails = setUp.data;
    const setupUri = setupDetails?.getSetupUri(
        t("settings.account.mfa.appName"),
        user?.email ?? user?.name,
    ).toString();

    const copySecret = async () => {
        if (!setupDetails) {
            return;
        }

        try {
            await navigator.clipboard.writeText(setupDetails.sharedSecret);
            toast.success(t("settings.account.mfa.secretCopied"));
        } catch {
            toast.error(t("settings.account.mfa.copyError"));
        }
    };

    const verifySetup = () => {
        const promise = verify.mutateAsync(code);

        toast.promise(promise, {
            loading: t("settings.account.mfa.verifying"),
            success: () => {
                onComplete();
                return t("settings.account.mfa.verified");
            },
            error: () => t("settings.account.mfa.verifyError"),
        });
    };

    return (
        <div className="h-full min-h-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-162 pb-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-helper transition-colors hover:text-light"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("settings.navigation.back")}
                </button>

                <header className="mb-5">
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {t("settings.account.mfa.title")}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper sm:text-base">
                        {t("settings.account.mfa.description")}
                    </p>
                </header>

                <section className="rounded-2xl border border-light-10 bg-surface [background-image:var(--surface-gradient)] p-5 shadow-custom sm:p-6">
                    <SetupStep
                        number="1"
                        title={t("settings.account.mfa.stepOneTitle")}
                        description={t("settings.account.mfa.stepOneDescription")}
                    />

                    <div className="my-5 border-t border-light-10" />

                    <SetupStep
                        number="2"
                        title={t("settings.account.mfa.stepTwoTitle")}
                        description={t("settings.account.mfa.stepTwoDescription")}
                    >
                        {setUp.isPending ? (
                            <div className="mt-4 h-40 animate-pulse rounded-xl bg-light-5" />
                        ) : setupDetails && setupUri ? (
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="w-fit rounded-xl bg-white p-3">
                                    <QRCode value={setupUri} size={128} bordered={false} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-helper">
                                        {t("settings.account.mfa.secretHint")}
                                    </p>
                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-light-10 bg-surface-hard/40 px-3 py-2 font-mono text-sm text-light">
                                            <span className="truncate">
                                                {isSecretVisible
                                                    ? setupDetails.sharedSecret
                                                    : "••••••••••••••••"}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            text={isSecretVisible
                                                ? t("settings.account.mfa.hideSecret")
                                                : t("settings.account.mfa.showSecret")}
                                            icon={<ShieldCheck className="h-4 w-4" />}
                                            onClick={() => setIsSecretVisible((visible) => !visible)}
                                            className="w-full sm:w-auto"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            text={t("settings.account.mfa.copySecret")}
                                            icon={<Copy className="h-4 w-4" />}
                                            onClick={() => { void copySecret(); }}
                                            className="w-full sm:w-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
                                {t("settings.account.mfa.setupError")}
                            </div>
                        )}
                    </SetupStep>

                    <div className="my-5 border-t border-light-10" />

                    <SetupStep
                        number="3"
                        title={t("settings.account.mfa.stepThreeTitle")}
                        description={t("settings.account.mfa.stepThreeDescription")}
                    >
                        <div className="mt-4 max-w-70">
                            <label htmlFor="mfa-code" className="mb-1.5 block text-sm font-medium text-light">
                                {t("settings.account.mfa.codeLabel")}
                            </label>
                            <Input
                                id="mfa-code"
                                placeholder={t("settings.account.mfa.codePlaceholder")}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={code}
                                disabled={!setupDetails || verify.isPending}
                                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                                className="text-center font-mono text-xl tracking-[0.45em]"
                            />
                            <p className="mt-2 text-xs text-helper">
                                {t("settings.account.mfa.codeHint")}
                            </p>
                        </div>
                    </SetupStep>

                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-light-10 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            text={t("common.cancel")}
                            onClick={onBack}
                            disabled={verify.isPending}
                            className="w-full sm:w-auto"
                        />
                        <Button
                            type="button"
                            text={verify.isPending
                                ? t("settings.account.mfa.verifying")
                                : t("settings.account.mfa.verifyAndEnable")}
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            disabled={!setupDetails || code.length !== 6 || verify.isPending}
                            onClick={verifySetup}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </section>

                <aside className="mt-4 flex gap-3 rounded-xl bg-light-5 p-4 text-sm text-helper">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{t("settings.account.mfa.securityNotice")}</p>
                </aside>
            </div>
        </div>
    );
};

interface SetupStepProps {
    number: string;
    title: string;
    description: string;
    children?: ReactNode;
}

const SetupStep = ({ number, title, description, children }: SetupStepProps) => (
    <div>
        <div className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-light-5 text-xs font-semibold text-light">
                {number}
            </span>
            <div className="min-w-0">
                <h2 className="text-sm font-semibold text-light">{title}</h2>
                <p className="mt-0.5 text-sm text-helper">{description}</p>
                {children}
            </div>
        </div>
    </div>
);
