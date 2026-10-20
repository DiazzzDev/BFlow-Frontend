import type { WalletTypeFilter } from "./filters";

export const getEmptyTitle = (search: string, walletType: WalletTypeFilter) => {
    if (search.trim()) {
        return "Sin resultados";
    }
    if (walletType === "MINE") {
        return "No tienes billeteras aún";
    }
    return "No tienes billeteras compartidas";
};

export const getEmptyDescription = (search: string, walletType: WalletTypeFilter) => {
    if (search.trim()) {
        return "Prueba con otro término de búsqueda";
    }
    if (walletType === "MINE") {
        return "Crea tu primera billetera para empezar a gestionar tus finanzas";
    }
    return "Cuando alguien te invite a una billetera, aparecerá aquí";
};
