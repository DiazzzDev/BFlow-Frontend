import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    LANDING_MODULES,
    MODULES_PAGE_HREF,
    type LandingModuleId,
} from "../../utils/landingContent";

import { ModulePanel } from "./ModulePanel";
import { modulePanelClass, ModulePanelHeader } from "./ModulePanelHeader";

const formatNumber = (index: number) => String(index + 1).padStart(2, "0");

export const LandingModules = () => {
    const { t } = useTranslation();
    const [activeModule, setActiveModule] = useState<LandingModuleId>(
        LANDING_MODULES[0].id,
    );

    return (
        <section id="modules" className="px-8 pb-28 md:pb-36">
            <div className="mb-10 flex flex-col gap-4 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                    {t("home.modules.title")}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-helper md:text-base">
                    {t("home.modules.description")}
                </p>
            </div>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-light-10 lg:h-110 lg:flex-row">
                {LANDING_MODULES.map((module, index) => (
                    <ModulePanel
                        key={module.id}
                        number={formatNumber(index)}
                        id={module.id}
                        Icon={module.Icon}
                        href={MODULES_PAGE_HREF}
                        isActive={activeModule === module.id}
                        onSelect={() => setActiveModule(module.id)}
                    />
                ))}

                <a
                    href={MODULES_PAGE_HREF}
                    className={`${modulePanelClass} group`}
                    style={{ flexGrow: 1 }}
                >
                    <ModulePanelHeader
                        number={formatNumber(LANDING_MODULES.length)}
                        label={t("home.modules.more.label")}
                        isActive={false}
                    />
                    <span className="flex flex-1 flex-col items-center justify-center gap-3 bg-surface px-5 py-8 text-center transition-colors group-hover:bg-primary-15">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-light-25 text-light transition-all duration-300 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary">
                            <ArrowUpRight className="h-5 w-5" />
                        </span>
                        <span className="max-w-40 text-xs leading-relaxed text-helper transition-colors group-hover:text-label">
                            {t("home.modules.more.description")}
                        </span>
                    </span>
                </a>
            </div>
        </section>
    );
};
