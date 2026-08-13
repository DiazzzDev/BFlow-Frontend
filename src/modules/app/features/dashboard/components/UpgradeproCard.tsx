import { Button } from "@/components/controls/Button";

interface UpgradeProCardProps {
    onUpgrade?: () => void;
}

export const UpgradeProCard = ({ onUpgrade }: UpgradeProCardProps) => {
    return (
        <div className="flex flex-col justify-center gap-3 rounded-lg border border-primary-25 bg-primary-15 p-5">
            <p className="text-lg font-semibold text-light">
                Mejora tu experiencia con Bflow Pro
            </p>
            <Button
                type="button"
                onClick={onUpgrade}
                text="Ver más"
                className="w-fit"
            />
        </div>
    );
};