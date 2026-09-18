import { dashboardCardClass } from "../utils/dashboardCard";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/controls/Button";

interface UpgradeProCardProps {
    onUpgrade?: () => void;
}

export const UpgradeProCard = ({ onUpgrade }: UpgradeProCardProps) => {
    const { t } = useTranslation();
    return (
        <div
            className={`${dashboardCardClass} justify-center gap-5 border-info-25`}
        >
            <p className="text-center text-xl font-semibold leading-snug text-light">
                {t("dashboard.upgradeTitle")}
            </p>
            <Button
                type="button"
                onClick={onUpgrade}
                text={t("dashboard.seeMore")}
                className="mx-auto w-fit"
            />
        </div>
    );
};
