import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type {
    LegalDocumentType,
    LegalLang,
} from "../interfaces/LegalDocument";
import { getLegalDocument } from "../legal.service";

export const useGetLegalDocument = (documentType: LegalDocumentType) => {
    const [lang, setLang] = useState<LegalLang>("es");

    const query = useQuery({
        queryKey: ["legal", documentType, lang],
        queryFn: () => getLegalDocument(documentType, lang),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    return { ...query, lang, setLang };
};
