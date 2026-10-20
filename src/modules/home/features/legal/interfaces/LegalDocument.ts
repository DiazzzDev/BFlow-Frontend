export const LEGAL_DOCUMENT_TYPE_VALUES = [
    "privacy",
    "terms",
    "cookies",
] as const;

export type LegalDocumentType = (typeof LEGAL_DOCUMENT_TYPE_VALUES)[number];

export const LEGAL_LANG_VALUES = ["es", "en"] as const;

export type LegalLang = (typeof LEGAL_LANG_VALUES)[number];

export interface LegalDocument {
    documentType: LegalDocumentType;
    language: LegalLang;
    lastUpdated: string;
    contactEmail: string;
    content: string;
}
