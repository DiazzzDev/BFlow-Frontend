import { config } from "../../../api/config.ts";
import { apiRequest } from "../../../utils/api.ts";

export type LegalDocumentType = "privacy" | "terms" | "cookies";
export type LegalLang = "es" | "en";

export interface LegalDocument {
    documentType: LegalDocumentType;
    language: LegalLang;
    lastUpdated: string;
    contactEmail: string;
    content: string;
}

const API_URL = `${config.API_BASE_URL}/api/v1/legal`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getLegalDocument = async (
    documentType: LegalDocumentType,
    lang: LegalLang = "es"
): Promise<LegalDocument> => {
    return await apiRequest<LegalDocument>(
        `${API_URL}/${documentType}?lang=${lang}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el documento legal"
    );
}; 
