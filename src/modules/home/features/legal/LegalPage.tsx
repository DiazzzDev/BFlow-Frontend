import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { LegalDocumentType, LegalLang } from "./interfaces/LegalDocument";
import { useGetLegalDocument } from "./hooks/useGetLegalDocument";
import { LegalMarkdown } from "./components/LegalMarkdown";
import { LegalSkeleton } from "./components/LegalSkeleton";
import { LegalError } from "./components/LegalError";
import { LegalScrollProgress } from "./components/LegalScrollProgress";
import { normalizeLegalContent } from "./utils/normalizeLegalContent";

interface LegalPageProps {
  documentType: LegalDocumentType;
}

const documentCopy = {
  privacy: { title: "home.privacyTitle", description: "home.privacyDescription" },
  terms: { title: "home.termsTitle", description: "home.termsDescription" },
  cookies: { title: "home.cookiesTitle", description: "home.cookiesDescription" },
} as const;

export const LegalPage = ({ documentType }: LegalPageProps) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, lang, setLang } =
    useGetLegalDocument(documentType);

  const copy = documentCopy[documentType];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [documentType, lang]);

  return (
    <>
      <LegalScrollProgress />

      <div className="min-h-screen bg-surface-hard text-light">
        <div className="border-b border-light-10 px-6 py-7 md:py-9">
          <div className="mx-auto flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {t(copy.title, { lng: lang })}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-helper">
                {t(copy.description, { lng: lang })}
              </p>
            </div>

            <div className="shrink-0">
              <select
                className="bg-surface border border-light-10 text-light rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-light-25 transition-colors outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value as LegalLang)}
              >
                <option value="es">{t("home.spanish", { lng: lang })}</option>
                <option value="en">{t("home.english", { lng: lang })}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <main className="min-w-0">
            {isLoading && <LegalSkeleton />}
            {isError && (
              <LegalError
                onRetry={() => {
                  void refetch();
                }}
              />
            )}
            {data && (
              <LegalMarkdown content={normalizeLegalContent(data.content)} />
            )}
          </main>
        </div>
      </div>
    </>
  );
};
