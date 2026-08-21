import type { LucideProps } from "lucide-react";

import { getCategoryIcon } from "@/utils/categoryIcons";

interface CategoryIconProps extends Omit<LucideProps, "ref"> {
    icon?: string | null;
}

export const CategoryIcon = ({ icon, ...props }: CategoryIconProps) => {
    const Icon = getCategoryIcon(icon);
    return <Icon {...props} />;
};
