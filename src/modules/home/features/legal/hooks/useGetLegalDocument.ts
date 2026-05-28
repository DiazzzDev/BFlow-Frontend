import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    getLegalDocument,
    type LegalDocumentType,
    type LegalLang,
} from "../../legal.service.ts";

export const useGetLegalDocument = (documentType: LegalDocumentType) => {
    const [lang, setLang] = useState<LegalLang>("es");

    const query = useQuery({
        queryKey: ["legal", documentType, lang],
        queryFn: () => getLegalDocument(documentType, lang),
        staleTime: 1000 * 60 * 10,
        retry: 2,
    });

    return { ...query, lang, setLang };
}; 
