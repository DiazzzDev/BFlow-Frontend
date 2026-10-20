import type { LucideIcon } from "lucide-react";
import {
    Baby,
    Banknote,
    Beer,
    Book,
    Briefcase,
    Building2,
    Bus,
    Car,
    CircleDollarSign,
    Coffee,
    CreditCard,
    Dumbbell,
    Film,
    Fuel,
    Gamepad2,
    Gift,
    GraduationCap,
    Heart,
    Home,
    Hospital,
    Laptop,
    Music,
    PawPrint,
    PiggyBank,
    Pill,
    Pizza,
    Plane,
    Receipt,
    Shirt,
    ShoppingCart,
    Smartphone,
    Tag,
    Train,
    TrendingDown,
    TrendingUp,
    Utensils,
    Users,
    Wallet,
    Wifi,
    Zap,
} from "lucide-react";

export const categoryIcons = {
    shoppingCart: ShoppingCart,
    utensils: Utensils,
    coffee: Coffee,
    pizza: Pizza,
    beer: Beer,
    car: Car,
    bus: Bus,
    train: Train,
    plane: Plane,
    fuel: Fuel,
    home: Home,
    building: Building2,
    wifi: Wifi,
    zap: Zap,
    heart: Heart,
    hospital: Hospital,
    pill: Pill,
    dumbbell: Dumbbell,
    gamepad: Gamepad2,
    music: Music,
    film: Film,
    book: Book,
    graduationCap: GraduationCap,
    briefcase: Briefcase,
    laptop: Laptop,
    shirt: Shirt,
    gift: Gift,
    pawPrint: PawPrint,
    baby: Baby,
    users: Users,
    wallet: Wallet,
    creditCard: CreditCard,
    piggyBank: PiggyBank,
    banknote: Banknote,
    receipt: Receipt,
    circleDollarSign: CircleDollarSign,
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    smartphone: Smartphone,
    tag: Tag,
} as const;

export type CategoryIconKey = keyof typeof categoryIcons;

export const categoryIconKeys = Object.keys(categoryIcons) as CategoryIconKey[];

export const defaultCategoryIcon: CategoryIconKey = "tag";

export const isCategoryIconKey = (value: string): value is CategoryIconKey =>
    value in categoryIcons;

export const getCategoryIcon = (icon?: string | null): LucideIcon => {
    if (icon && isCategoryIconKey(icon)) {
        return categoryIcons[icon];
    }
    return categoryIcons[defaultCategoryIcon];
};
