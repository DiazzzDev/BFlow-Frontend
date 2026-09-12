import type {
    LegalDocument,
    LegalDocumentType,
    LegalLang,
} from "./interfaces/LegalDocument";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const API_URL = `${config.API_BASE_URL}/api/v1/legal`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getLegalDocument = async (
    documentType: LegalDocumentType,
    lang: LegalLang = "es",
): Promise<LegalDocument> => {
    return await apiRequest<LegalDocument>(
        `${API_URL}/${documentType}?lang=${lang}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el documento legal",
    );
};
