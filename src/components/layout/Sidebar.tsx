
import { useEffect } from "react";
import type { ElementType } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Droplets,
  ReceiptText,
  X,
} from "lucide-react";

import logo from "../../assets/olive_app.png";

// ==================================================
// TYPES
// ==================================================

type MenuItem = {
  label: string;
  path: string;
  icon: ElementType;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ==================================================
// MENU ITEMS
// ==================================================

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Saisons",
    path: "/saisons",
    icon: CalendarDays,
  },
  {
    label: "Utilisateurs",
    path: "/utilisateurs",
    icon: Users,
  },
  {
    label: "Comptes",
    path: "/comptes",
    icon: Wallet,
  },
  {
    label: "Citernes",
    path: "/citernes",
    icon: Droplets,
  },
  {
  label: "Bons de réception",
  path: "/bons-reception",
  icon: ReceiptText,
},
];

// ==================================================
// SIDEBAR
// ==================================================

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  // Fermer le menu mobile après navigation
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Empêcher le défilement lorsque le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ==========================================
          OVERLAY MOBILE
      ========================================== */}

      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300 lg:hidden
          ${
            isOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-[255px] shrink-0 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:h-screen lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="relative flex shrink-0 flex-col items-center border-b border-gray-100 px-3 pb-4 pt-5">

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="absolute right-3 top-3 rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 lg:hidden"
          >
            <X size={19} />
          </button>

          <img
            src={logo}
            alt="Logo"
            className="h-[90px] w-[150px] object-contain"
          />

          

        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-4">


          <div className="space-y-1.5">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3
                    rounded-md border-l-[3px]
                    px-3 py-2.5
                    transition-all duration-200
                    ${
                      isActive
                        ? "border-[#6D9B82] bg-[#E8F1EB] text-[#24563F]"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >

                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={1.9}
                        className={`shrink-0 ${
                          isActive
                            ? "text-[#47785B]"
                            : "text-gray-500"
                        }`}
                      />

                      <span className="text-[12px] font-semibold leading-5">
                        {item.label}
                      </span>
                    </>
                  )}

                </NavLink>
              );
            })}

          </div>
        </nav>

      </aside>
    </>
  );
}
