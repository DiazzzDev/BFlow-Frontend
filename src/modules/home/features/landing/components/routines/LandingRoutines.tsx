import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ThoughtLine } from "@/components/ThoughtLine";

const ROUTINE_KEYS = ["context", "answer"] as const;

export const LandingRoutines = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % ROUTINE_KEYS.length), 4500);
    return () => window.clearInterval(interval);
  }, []);

  const key = ROUTINE_KEYS[active];

  return (
    <section className="w-full max-w-7xl px-4 pb-20 pt-8 sm:px-8 md:pb-28" aria-labelledby="routines-title">
      <div className="grid gap-10 rounded-[2rem] border border-light-10 bg-surface/45 p-7 sm:p-10 lg:grid-cols-[0.78fr_1.22fr] lg:p-14">
        <div className="max-w-xl">
          <h2 id="routines-title" className="text-3xl font-bold tracking-tight text-light md:text-5xl">{t("home.routines.title")}</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-helper md:text-base">{t("home.routines.description")}</p>
        </div>
        <div className="rounded-2xl border border-light-10 bg-surface-hard/70 p-6 sm:p-8">
          <ThoughtLine
            key={key}
            label={t(`home.routines.ai.${key}.label`)}
            doneLabel={t(`home.routines.ai.${key}.done`)}
            working={active === 0}
            steps={[
              t("home.routines.ai.steps.transactions"),
              t("home.routines.ai.steps.budgets"),
              t("home.routines.ai.steps.receipts"),
            ]}
          />
          <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-light">{t(`home.routines.ai.${key}.description`)}</p>
        </div>
      </div>
    </section>
  );
};
