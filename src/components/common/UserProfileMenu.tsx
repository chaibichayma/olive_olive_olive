
import { useState, useEffect, useRef } from "react";
import {
  CircleUserRound,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  IdCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui";

interface UserProfileMenuProps {
  userName?: string;
  email?: string;
  plan?: string;
  initials?: string;
  onLogout: () => void;
  onPublicProfile?: () => void;
  onMyProfile?: () => void;
  onMyAccount?: () => void;
  onDevForum?: () => void;
  onToggleDarkMode?: (enabled: boolean) => void;
}

export default function UserProfileMenu({
  userName = "Utilisateur",
  email = "utilisateur@gmail.com",
  initials = "U",
  onPublicProfile,
  onMyProfile,
  onMyAccount,
}: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fermer le menu en cliquant à l'extérieur ou avec Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Déconnexion et redirection vers Sign In
  const handleLogout = () => {
    localStorage.removeItem("oliveapp_authenticated");
    sessionStorage.removeItem("oliveapp_authenticated");
    localStorage.removeItem("oliveapp_current_user");

    setIsOpen(false);
    navigate("/auth/signin", { replace: true });
  };

  return (
    <div ref={menuRef} className="relative shrink-0">
      {/* Bouton du profil */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-[#F1F2F6] text-[10px] font-bold text-[#344054]">
          {initials}
        </div>

        <div className="hidden min-w-0 text-left sm:block">
          <p className="max-w-[130px] truncate text-[11px] font-semibold leading-4 text-white">
            {userName}
          </p>
          <p className="text-[10px] leading-3 text-white/70">
            Administrateur
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`hidden text-white/70 transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[256px] overflow-hidden rounded-lg border border-[#E9ECEF] bg-white shadow-[0_3px_12px_rgba(0,0,0,0.10)]"
        >
          {/* Informations utilisateur */}
          <div className="flex items-center gap-3 border-b border-[#F0F1F3] px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F1EB] text-sm font-bold text-[#285640]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#30343B]">
                {userName}
              </p>
              <p className="truncate text-xs text-[#9A9DA5]">
                {email}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-[#F0F1F3] py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onPublicProfile?.();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] text-[#555960] transition hover:bg-[#F7F8F9]"
            >
              <IdCard size={16} className="text-[#858A91]" />
              <span>Profil public</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onMyProfile?.();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] text-[#555960] transition hover:bg-[#F7F8F9]"
            >
              <CircleUserRound size={16} className="text-[#858A91]" />
              <span>Mon profil</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onMyAccount?.();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] text-[#555960] transition hover:bg-[#F7F8F9]"
            >
              <Settings size={16} className="text-[#858A91]" />
              <span className="flex-1">Mon compte</span>
              <ChevronRight size={15} className="text-[#999DA4]" />
            </button>
          </div>

          {/* Déconnexion */}
          <div className="p-3">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleLogout}
              leftIcon={<LogOut size={14} />}
              className="!border-[#E5E7EB] !text-[#40444B] hover:!bg-[#F7F8F9]"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
