import { useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Mail, Send } from "lucide-react";
import { SiGithub, SiInstagram } from "@icons-pack/react-simple-icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { sendContactMessage, type ContactMessage } from "./contact.service";

import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const inputClass =
    "w-full rounded-xl border border-light-10 bg-surface px-4 py-3 text-sm text-light placeholder:text-placeholder outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";
const SUPPORT_EMAIL = "support@bflow-studio.com";
const MAX_MESSAGE_CHARACTERS = 500;

export const ContactPage = () => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const contactSchema = z.object({
        name: z.string().trim().min(1, t("contact.validationName")),
        email: z
            .string()
            .trim()
            .min(1, t("contact.validationEmailRequired"))
            .email(t("contact.validationEmail")),
        subject: z.string().trim().min(1, t("contact.validationSubject")),
        message: z
            .string()
            .trim()
            .min(1, t("contact.validationMessage"))
            .min(10, t("contact.validationMessageMin"))
            .max(MAX_MESSAGE_CHARACTERS, t("contact.validationMessageMax")),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ContactMessage>({
        resolver: zodResolver(contactSchema),
        mode: "onSubmit",
    });
    const messageValue = useWatch({
        control,
        name: "message",
        defaultValue: "",
    });
    const messageRegistration = register("message");
    const messageCharacterCount = messageValue.length;

    const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length > MAX_MESSAGE_CHARACTERS) {
            event.target.value = event.target.value.slice(0, MAX_MESSAGE_CHARACTERS);
        }

        void messageRegistration.onChange(event);
    };

    const handleCopySupportEmail = async () => {
        try {
            await navigator.clipboard.writeText(SUPPORT_EMAIL);
            toast.success(t("contact.emailCopied"));
        } catch {
            window.location.href = `mailto:${SUPPORT_EMAIL}`;
        }
    };

    const onSubmit = async (data: ContactMessage) => {
        setIsSubmitting(true);

        try {
            const response = await sendContactMessage({
                name: data.name.trim(),
                email: data.email.trim(),
                subject: data.subject.trim(),
                message: data.message.trim(),
            });

            toast.success(getApiMessage(response, t("contact.success")));
            reset();
        } catch (error) {
            toast.error(getApiErrorMessage(error, t("contact.error")));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-300">
                <div className="mx-auto max-w-5xl">
                    <h1 className="text-4xl font-bold tracking-tight text-light sm:text-5xl">
                        {t("contact.title")}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-helper sm:text-lg">
                        {t("contact.description")}
                    </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
                    <form
                        className="rounded-2xl border border-light-10 bg-surface p-5 shadow-custom sm:p-8"
                        onSubmit={(event) => {
                            void handleSubmit(onSubmit)(event);
                        }}
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-label" htmlFor="contact-name">
                                    {t("contact.name")}
                                </label>
                                <input
                                    id="contact-name"
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                    placeholder={t("contact.namePlaceholder")}
                                    className={inputClass}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-danger">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-label" htmlFor="contact-email">
                                    {t("contact.email")}
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    placeholder={t("contact.emailPlaceholder")}
                                    className={inputClass}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-danger">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="text-sm font-medium text-label" htmlFor="contact-subject">
                                {t("contact.subject")}
                            </label>
                            <input
                                id="contact-subject"
                                disabled={isSubmitting}
                                placeholder={t("contact.subjectPlaceholder")}
                                className={inputClass}
                                {...register("subject")}
                            />
                            {errors.subject && (
                                <p className="text-sm text-danger">{errors.subject.message}</p>
                            )}
                        </div>

                        <div className="mt-5 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-sm font-medium text-label" htmlFor="contact-message">
                                    {t("contact.message")}
                                </label>
                                <span className="shrink-0 text-xs text-helper">
                                    {t("contact.characterCount", { count: messageCharacterCount })}
                                </span>
                            </div>
                            <textarea
                                id="contact-message"
                                rows={6}
                                disabled={isSubmitting}
                                placeholder={t("contact.messagePlaceholder")}
                                className={`${inputClass} resize-y`}
                                {...messageRegistration}
                                onChange={handleMessageChange}
                            />
                            {errors.message && (
                                <p className="text-sm text-danger">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-light shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? t("contact.sending") : t("contact.send")}
                        </button>
                    </form>

                    <aside className="flex flex-col rounded-2xl border border-light-10 bg-surface-hard p-5 sm:p-8">
                        <p className="text-lg font-semibold text-light">{t("contact.asideTitle")}</p>
                        <p className="mt-2 text-sm leading-relaxed text-helper">
                            {t("contact.asideDescription")}
                        </p>

                        <div className="mt-8 space-y-4">
                            <button
                                type="button"
                                onClick={() => void handleCopySupportEmail()}
                                title={t("contact.copyEmail")}
                                className="flex cursor-pointer items-center gap-3 text-left text-sm text-helper transition-colors hover:text-light"
                            >
                                <Mail className="h-5 w-5 shrink-0 text-light" />
                                <span className="min-w-0 truncate">{SUPPORT_EMAIL}</span>
                                <Copy className="h-4 w-4 shrink-0 text-helper" />
                            </button>
                            <a
                                href="https://www.instagram.com/bflow_studio?stkn=MXZvemE5cnh2NG1kMA=="
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-sm text-helper transition-colors hover:text-light"
                            >
                                <SiInstagram className="h-5 w-5 shrink-0 text-light" />
                                @bflow_studio
                            </a>
                            <a
                                href="https://github.com/DiazzzDev/BFlow-Financial-Engine"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-sm text-helper transition-colors hover:text-light"
                            >
                                <SiGithub className="h-5 w-5 shrink-0 text-light" />
                                {t("contact.github")}
                            </a>
                        </div>

                        <Link
                            to="/"
                            className="mt-auto pt-10 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                        >
                            ← {t("contact.backHome")}
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
};
