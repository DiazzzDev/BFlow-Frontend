import { dashboardCardClass } from "../utils/dashboardCard";

import { Button } from "@/components/controls/Button";

interface UpgradeProCardProps {
    onUpgrade?: () => void;
}

export const UpgradeProCard = ({ onUpgrade }: UpgradeProCardProps) => {
    return (
        <div
            className={`${dashboardCardClass} justify-center gap-5 border-info-25`}
        >
            <p className="text-center text-xl font-semibold leading-snug text-light">
                Mejora tu experiencia con Bflow Pro
            </p>
            <Button
                type="button"
                onClick={onUpgrade}
                text="Ver más"
                className="mx-auto w-fit"
            />
        </div>
    );
};
