import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LandingBrand } from "./LandingBrand";

import { useLandingNav } from "../hooks/useLandingNav";

import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { UserAvatar } from "@/modules/app/components/UserAvatar";

const REPOSITORY_URL = "https://github.com/DiazzzDev/BFlow-Financial-Engine";
const REPOSITORY_API_URL =
  "https://api.github.com/repos/DiazzzDev/BFlow-Financial-Engine";
const formatStars = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const GitHubStarsLink = ({ mobile = false }: { mobile?: boolean }) => {
  const [stars, setStars] = useState<number | null>(29);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(REPOSITORY_API_URL, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json()) as { stargazers_count?: unknown };
        return typeof data.stargazers_count === "number"
          ? data.stargazers_count
          : null;
      })
      .then(setStars)
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const label =
    stars === null ? "GitHub" : `GitHub: ${stars.toLocaleString()} estrellas`;

  return (
    <a
      href={REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={
        mobile
          ? "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light"
          : "hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light lg:inline-flex"
      }
    >
      <SiGithub className="h-4 w-4" aria-hidden="true" />
      <span className="tabular-nums">
        {stars === null ? "—" : formatStars.format(stars)}
      </span>
    </a>
  );
};

export const LandingNavbar = () => {
  const { navLinks, handleNavClick, isLinkActive } = useLandingNav();
  const { isAuthenticated, isChecking } = useAuth();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onNavClick = (id: string) => {
    handleNavClick(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-light-10 bg-surface-hard/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <LandingBrand onClick={() => setMobileOpen(false)} />

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ id, labelKey }) => {
              const isActive = isLinkActive(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavClick(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-light-10 hover:text-light ${
                    isActive ? "text-light" : "text-helper"
                  }`}
                >
                  {t(labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GitHubStarsLink />
          {isChecking ? null : isAuthenticated ? (
            <>
              <Button
                to="/app/dashboard"
                text={t("home.dashboard")}
                className="rounded-md px-3 py-2"
              />
              <Link
                to="/app/settings"
                aria-label={t("settings.profile")}
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <UserAvatar
                  user={user}
                  className="h-9 w-9 border border-light-10"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="hidden text-sm font-medium text-helper transition-colors hover:text-light sm:inline"
              >
                {t("home.signIn")}
              </Link>
              <Button
                to="/auth/register"
                text={t("home.plans.startFree")}
                className="rounded-md px-3 py-2"
              />
            </>
          )}

          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-helper hover:bg-light-10 hover:text-light md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-light-10 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavClick(id)}
                aria-current={isLinkActive(id) ? "page" : undefined}
                className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-light-10 hover:text-light ${
                  isLinkActive(id) ? "text-light" : "text-helper"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
            {!isAuthenticated && !isChecking && (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light sm:hidden"
              >
                {t("home.signIn")}
              </Link>
            )}
            <GitHubStarsLink mobile />
          </div>
        </div>
      )}
    </header>
  );
};
