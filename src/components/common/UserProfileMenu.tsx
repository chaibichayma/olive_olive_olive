
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Camera,
  Moon,
  Sun,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "../ui";

// ==================================================
// TYPES
// ==================================================

interface UserProfileMenuProps {
  userName?: string;
  email?: string;
  initials?: string;
  avatarUrl?: string;
  darkMode?: boolean;

  onLogout: () => void;
  onPhotoChange?: (file: File) => void;

  onChangePassword?: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void | Promise<void>;

  onToggleDarkMode?: (enabled: boolean) => void;
}

// ==================================================
// COMPONENT
// ==================================================

export default function UserProfileMenu({
  userName = "Utilisateur",
  email = "utilisateur@gmail.com",
  initials = "U",
  avatarUrl,
  darkMode = false,
  onLogout,
  onPhotoChange,
  onChangePassword,
  onToggleDarkMode,
}: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.classList.contains("dark") || darkMode
  );

  const [photoPreview, setPhotoPreview] = useState(avatarUrl ?? "");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isSaving, setIsSaving] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // ==================================================
  // THEME SYNCHRONIZATION
  // ==================================================

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

  useEffect(() => {
    setPhotoPreview(avatarUrl ?? "");
  }, [avatarUrl]);

  // Nettoyer les URLs temporaires des photos
  useEffect(() => {
    if (!photoPreview || photoPreview === avatarUrl) return;

    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview, avatarUrl]);

  // ==================================================
  // CLOSE MENU
  // ==================================================

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

  // ==================================================
  // PHOTO
  // ==================================================

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
    onPhotoChange?.(file);

    event.target.value = "";
  };

  // ==================================================
  // DARK MODE
  // ==================================================

  const handleToggleDarkMode = () => {
    const nextMode = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", nextMode);

    localStorage.setItem(
      "oliveapp_dark_mode",
      String(nextMode)
    );

    setIsDarkMode(nextMode);
    onToggleDarkMode?.(nextMode);
  };

  // ==================================================
  // PASSWORD
  // ==================================================

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessageType("error");
      setPasswordMessage("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword.length < 8) {
      setMessageType("error");
      setPasswordMessage(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setPasswordMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!onChangePassword) {
      setMessageType("error");
      setPasswordMessage(
        "La modification du mot de passe doit être connectée au backend."
      );
      return;
    }

    try {
      setIsSaving(true);

      await onChangePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessageType("success");
      setPasswordMessage(
        "Votre mot de passe a été modifié avec succès."
      );
    } catch {
      setMessageType("error");
      setPasswordMessage(
        "Impossible de modifier le mot de passe. Vérifiez votre ancien mot de passe."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("oliveapp_authenticated");
    sessionStorage.removeItem("oliveapp_authenticated");
    localStorage.removeItem("oliveapp_current_user");

    onLogout();
    setIsOpen(false);

    navigate("/auth/signin", { replace: true });
  };

  // ==================================================
  // PASSWORD FIELDS
  // ==================================================

  const passwordFields = [
    {
      label: "Ancien mot de passe",
      value: currentPassword,
      setValue: setCurrentPassword,
      visible: showCurrentPassword,
      setVisible: setShowCurrentPassword,
      placeholder: "Saisir l'ancien mot de passe",
    },
    {
      label: "Nouveau mot de passe",
      value: newPassword,
      setValue: setNewPassword,
      visible: showNewPassword,
      setVisible: setShowNewPassword,
      placeholder: "Saisir le nouveau mot de passe",
    },
    {
      label: "Confirmer le mot de passe",
      value: confirmPassword,
      setValue: setConfirmPassword,
      visible: showConfirmPassword,
      setVisible: setShowConfirmPassword,
      placeholder: "Confirmer le nouveau mot de passe",
    },
  ];

  const inputClassName =
    "h-10 w-full rounded-lg border border-[#DCE3DE] bg-white px-3 pr-10 text-[13px] text-[#38453D] outline-none transition placeholder:text-[#A0AAA3] focus:border-[#47785B] focus:ring-2 focus:ring-[#47785B]/10 dark:border-[#405247] dark:bg-[#1C2921] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#79A98A]";

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div ref={menuRef} className="relative shrink-0">

      {/* PROFILE BUTTON */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F2F6] text-[10px] font-bold text-[#344054]">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Photo de profil"
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
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

      {/* PROFILE DROPDOWN */}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Paramètres du profil"
          className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[85vh] w-[320px] overflow-y-auto rounded-xl border border-[#E9ECEF] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.13)] transition-colors duration-200 dark:border-[#35463B] dark:bg-[#1C2921]"
        >

          {/* PROFILE INFORMATION */}

          <div className="border-b border-[#F0F1F3] px-4 py-4 dark:border-[#35463B]">
            <div className="flex items-center gap-3">

              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#E8F1EB] text-base font-bold text-[#285640] dark:bg-[#2B4434] dark:text-[#B9DEC4]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Photo de profil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Modifier la photo"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#285640] text-white transition hover:bg-[#47785B] dark:border-[#1C2921]"
                >
                  <Camera size={12} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#30343B] dark:text-white">
                  {userName}
                </p>

                <p className="truncate text-[12px] text-[#9298A0] dark:text-gray-400">
                  {email}
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-[11px] font-semibold text-[#47785B] hover:underline dark:text-[#91C5A1]"
                >
                  Modifier la photo
                </button>
              </div>

            </div>
          </div>

          {/* APPEARANCE */}

          <div className="border-b border-[#F0F1F3] px-4 py-3 dark:border-[#35463B]">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#285640] dark:bg-[#2B4434] dark:text-[#B9DEC4]">
                  {isDarkMode ? (
                    <Moon size={17} />
                  ) : (
                    <Sun size={17} />
                  )}
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-[#38453D] dark:text-white">
                    Apparence
                  </p>

                  <p className="text-[11px] text-[#9298A0] dark:text-gray-400">
                    {isDarkMode ? "Mode sombre" : "Mode clair"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isDarkMode}
                onClick={handleToggleDarkMode}
                className={`relative h-6 w-11 rounded-full transition ${
                  isDarkMode ? "bg-[#285640]" : "bg-[#D5DBD7]"
                }`}
              >
                <span
                  className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
                    isDarkMode ? "left-[22px]" : "left-[3px]"
                  }`}
                />
              </button>

            </div>
          </div>

          {/* SECURITY ACCORDION */}

          <div className="border-b border-[#F0F1F3] dark:border-[#35463B]">

            <button
              type="button"
              onClick={() => {
                setIsSecurityOpen((previous) => !previous);
                setPasswordMessage("");
              }}
              aria-expanded={isSecurityOpen}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-[#F7F9F7] dark:hover:bg-[#26372C]"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#285640] dark:bg-[#2B4434] dark:text-[#B9DEC4]">
                  <LockKeyhole size={17} />
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-[#38453D] dark:text-white">
                    Sécurité
                  </p>

                  <p className="text-[11px] text-[#9298A0] dark:text-gray-400">
                    Modifier votre mot de passe
                  </p>
                </div>

              </div>

              <ChevronRight
                size={17}
                className={`text-[#9298A0] transition-transform duration-200 dark:text-gray-400 ${
                  isSecurityOpen ? "rotate-90" : ""
                }`}
              />

            </button>

            {/* PASSWORD FORM */}

            {isSecurityOpen && (
              <div className="px-4 pb-4">

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-3"
                >

                  {passwordFields.map((field) => (
                    <div key={field.label}>

                      <label className="mb-1.5 block text-[12px] font-semibold text-[#555F58] dark:text-gray-300">
                        {field.label}
                      </label>

                      <div className="relative">

                        <input
                          type={field.visible ? "text" : "password"}
                          value={field.value}
                          onChange={(event) => {
                            field.setValue(event.target.value);
                            setPasswordMessage("");
                          }}
                          placeholder={field.placeholder}
                          className={inputClassName}
                        />

                        <button
                          type="button"
                          onClick={() => field.setVisible(!field.visible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9298A0] transition hover:text-[#47785B] dark:text-gray-400 dark:hover:text-[#91C5A1]"
                          aria-label={
                            field.visible
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {field.visible ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                      </div>
                    </div>
                  ))}

                  {/* PASSWORD FEEDBACK */}

                  {passwordMessage && (
                    <div
                      className={`flex items-start gap-2 rounded-lg p-2.5 text-[11px] ${
                        messageType === "success"
                          ? "bg-[#EDF5EF] text-[#285640] dark:bg-[#263F30] dark:text-[#B9DEC4]"
                          : "bg-[#FFF1F0] text-[#B54745] dark:bg-[#482B2A] dark:text-[#FFB4AE]"
                      }`}
                    >
                      {messageType === "success" ? (
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0"
                        />
                      ) : (
                        <AlertCircle
                          size={15}
                          className="mt-0.5 shrink-0"
                        />
                      )}

                      <span>{passwordMessage}</span>
                    </div>
                  )}

                  {/* SUBMIT */}

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    fullWidth
                    disabled={isSaving}
                    className="!h-10 !text-[13px] !font-semibold"
                  >
                    {isSaving
                      ? "Modification..."
                      : "Modifier le mot de passe"}
                  </Button>

                </form>
              </div>
            )}

          </div>

          {/* LOGOUT */}

          <div className="p-3">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleLogout}
              leftIcon={<LogOut size={14} />}
              className="!h-10 !border-[#E5E7EB] !text-[13px] !font-semibold !text-[#40444B] hover:!bg-[#F7F8F9] dark:!border-[#405247] dark:!text-gray-200 dark:hover:!bg-[#26372C]"
            >
              Déconnexion
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}
