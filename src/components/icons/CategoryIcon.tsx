import { createElement } from "react";
import type { LucideProps } from "lucide-react";

import { getCategoryIcon } from "@/utils/categoryIcons";

// Renders the Lucide icon for a category key (falls back via getCategoryIcon)
interface CategoryIconProps extends Omit<LucideProps, "ref"> {
    icon?: string | null;
}

export const CategoryIcon = ({ icon, ...props }: CategoryIconProps) =>
    createElement(getCategoryIcon(icon), props);
