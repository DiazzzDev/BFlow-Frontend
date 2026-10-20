import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { LandingModuleId } from "../../utils/landingContent";

import { modulePanelClass, ModulePanelHeader } from "./ModulePanelHeader";

interface ModulePanelProps {
    number: string;
    id: LandingModuleId;
    Icon: LucideIcon;
    href: string;
    isActive: boolean;
    onSelect: () => void;
}

export const ModulePanel = ({
    number,
    id,
    Icon,
    href,
    isActive,
    onSelect,
}: ModulePanelProps) => {
    const { t } = useTranslation();
    const highlights = t(`home.modules.items.${id}.highlights`, {
        returnObjects: true,
    });

    return (
        <div className={modulePanelClass} style={{ flexGrow: isActive ? 6 : 1 }}>
            <button
                type="button"
                onClick={onSelect}
                aria-expanded={isActive}
                className="w-full cursor-pointer text-left"
            >
                <ModulePanelHeader
                    number={number}
                    label={t(`home.modules.items.${id}.name`)}
                    tagline={t(`home.modules.items.${id}.tagline`)}
                    isActive={isActive}
                />
            </button>

            <div
                className={`@container relative flex-1 overflow-hidden transition-[max-height,background-color] duration-500 lg:max-h-none ${
                    isActive
                        ? "max-h-150 bg-surface"
                        : "max-h-28 bg-surface group-hover/panel:bg-secondary-dark"
                }`}
            >
                <div
                    inert={!isActive}
                    className={`grid w-full grid-cols-1 gap-8 p-6 transition-[opacity,filter] duration-500 md:p-8 lg:h-full lg:min-w-120 @2xl:grid-cols-[1.15fr_1fr] ${
                        isActive
                            ? "opacity-100 blur-0"
                            : "select-none opacity-35 blur-[1.5px] group-hover/panel:opacity-60 group-hover/panel:blur-[0.5px]"
                    }`}
                >
                    <div className="flex flex-col">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-light-10 bg-surface-hard text-primary">
                            <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-5 text-xl font-semibold leading-snug tracking-tight text-light">
                            “{t(`home.modules.items.${id}.question`)}”
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-helper">
                            {t(`home.modules.items.${id}.answer`)}
                        </p>

                        <a
                            href={href}
                            className="group/cta mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-light px-4 py-2 text-sm font-medium text-surface-hard transition-colors hover:bg-primary hover:text-light lg:mt-auto"
                        >
                            {t("home.modules.viewModule")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                        </a>
                    </div>

                    <ul className="flex flex-col justify-center gap-2.5">
                        {highlights.map((highlight) => (
                            <li
                                key={highlight}
                                className="flex items-center gap-3 rounded-xl border border-light-10 bg-surface-hard/70 px-4 py-3 text-sm text-light"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-15 text-primary">
                                    <Check className="h-3 w-3" />
                                </span>
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </div>

                {!isActive ? (
                    <>
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-surface group-hover/panel:to-secondary-dark lg:bg-linear-to-r" />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden
                            onClick={onSelect}
                            className="absolute inset-0 cursor-pointer"
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
};
