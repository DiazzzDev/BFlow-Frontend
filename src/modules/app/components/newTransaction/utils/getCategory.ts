import { Category } from "@/modules/app/interfaces/Category";

export const getCategory = (list: Category[], id: string): Category | null => {
    const item = list.find(category => category.id === id);

    return item || null
}