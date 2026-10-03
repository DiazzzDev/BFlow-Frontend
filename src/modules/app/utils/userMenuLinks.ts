import { BookOpen, Cookie, FileText, ShieldCheck, type LucideIcon } from "lucide-react";

import { DOCS_BASE_PATH } from "@/modules/home/features/docs/utils/docsContent";

interface UserMenuResourceLink {
    to: string;
    labelKey: "home.navDocs" | "home.termsTitle" | "home.privacyTitle" | "home.cookiesTitle";
    icon: LucideIcon;
}

export const USER_MENU_RESOURCE_LINKS: UserMenuResourceLink[] = [
    { to: DOCS_BASE_PATH, labelKey: "home.navDocs", icon: BookOpen },
    { to: "/terms", labelKey: "home.termsTitle", icon: FileText },
    { to: "/privacy", labelKey: "home.privacyTitle", icon: ShieldCheck },
    { to: "/cookies", labelKey: "home.cookiesTitle", icon: Cookie },
];
