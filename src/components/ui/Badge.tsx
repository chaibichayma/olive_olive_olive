
import type { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

type BadgeAppearance = "light" | "solid";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const lightVariants: Record<BadgeVariant, string> = {
  success: "bg-[#E7F3EA] text-[#43845B]",
  warning: "bg-[#FFF1D9] text-[#A97922]",
  danger: "bg-[#FCE9E9] text-[#B94C4C]",
  info: "bg-[#EAF1F8] text-[#47749C]",
  neutral: "bg-[#EEF1EF] text-[#65736A]",
  primary: "bg-[#E8F1EB] text-[#285640]",
};

const darkVariants: Record<BadgeVariant, string> = {
  success: "dark:bg-[#263F30] dark:text-[#91C5A1]",
  warning: "dark:bg-[#3A3425] dark:text-[#E5C77C]",
  danger: "dark:bg-[#382526] dark:text-[#E5A0A0]",
  info: "dark:bg-[#283747] dark:text-[#A5C6E5]",
  neutral: "dark:bg-[#2B3830] dark:text-[#B8C5BB]",
  primary: "dark:bg-[#2B4434] dark:text-[#B9DEC4]",
};

const solidVariants: Record<BadgeVariant, string> = {
  success: "bg-[#43845B] text-white",
  warning: "bg-[#A97922] text-white",
  danger: "bg-[#B94C4C] text-white",
  info: "bg-[#47749C] text-white",
  neutral: "bg-[#65736A] text-white",
  primary: "bg-[#285640] text-white",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "neutral",
  appearance = "light",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const appearanceStyles =
    appearance === "light"
      ? `${lightVariants[variant]} ${darkVariants[variant]}`
      : solidVariants[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium whitespace-nowrap
        transition-colors duration-200
        ${appearanceStyles}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {children}
    </span>
  );
}
