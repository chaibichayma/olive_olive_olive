
import { useEffect, useState } from "react";
import {
  PanelLeft,
  Search,
  Sun,
  Moon,
  History,
  Bell,
  ChevronRight,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import UserProfileMenu from "../common/UserProfileMenu";

// ==================================================
// TYPES
// ==================================================

type HeaderProps = {
  onMenuClick: () => void;
};

// ==================================================
// PAGE NAMES
// ==================================================

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/saisons": "Saisons",
  "/utilisateurs": "Utilisateurs",
  "/comptes": "Comptes",
  "/citernes": "Citernes",
  "/bons-reception": "Bons de réception",
  "/traitement-base": "Traitement de base",
};

// ==================================================
// HEADER
// ==================================================

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const currentPage =
    pageNames[location.pathname] ?? "Dashboard";

  // Synchroniser le thème avec UserProfileMenu
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(
        document.documentElement.classList.contains("dark")
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Changer le thème
  const handleToggleTheme = () => {
    const nextMode = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", nextMode);

    localStorage.setItem(
      "oliveapp_dark_mode",
      String(nextMode)
    );

    setIsDarkMode(nextMode);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[58px] w-full shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#285640] px-3 text-white shadow-sm transition-colors duration-200 sm:px-5">

      {/* LEFT SECTION */}

      <div className="flex min-w-0 items-center gap-3 sm:gap-5">

        {/* Sidebar toggle */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10"
        >
          <PanelLeft size={18} strokeWidth={1.8} />
        </button>

        {/* Breadcrumb */}

        <div className="flex min-w-0 items-center gap-2 text-xs sm:gap-2.5">

          <span className="hidden whitespace-nowrap text-white/70 sm:inline">
            Gestion
          </span>

          <ChevronRight
            size={13}
            className="hidden shrink-0 text-white/50 sm:block"
          />

          <span className="truncate font-semibold text-white">
            {currentPage}
          </span>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">

        {/* Search */}

        <div className="flex h-[34px] w-[115px] items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-2.5 transition focus-within:border-white/50 sm:w-[170px] md:w-[190px]">

          <Search
            size={15}
            className="shrink-0 text-white/80"
          />

          <input
            type="search"
            placeholder="Rechercher"
            aria-label="Rechercher"
            className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-white/70"
          />

        </div>

        {/* Theme */}

        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label={
            isDarkMode
              ? "Activer le mode clair"
              : "Activer le mode sombre"
          }
          title={
            isDarkMode
              ? "Mode clair"
              : "Mode sombre"
          }
          className="hidden h-8 w-8 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10 sm:flex"
        >
          {isDarkMode ? (
            <Moon size={18} strokeWidth={1.8} />
          ) : (
            <Sun size={18} strokeWidth={1.8} />
          )}
        </button>

        {/* History */}

        <button
          type="button"
          aria-label="Historique"
          className="hidden h-8 w-8 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10 md:flex"
        >
          <History size={18} strokeWidth={1.8} />
        </button>

        {/* Notifications */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-[5px] top-[4px] h-[7px] w-[7px] rounded-full border border-[#285640] bg-red-400" />
        </button>

        {/* USER PROFILE */}

        <UserProfileMenu
          userName="Foulen ben foulen"
          email="foulen@gmail.com"
          initials="FA"
          onLogout={() => {
            console.log("Déconnexion");
          }}
        />

      </div>

    </header>
  );
}
