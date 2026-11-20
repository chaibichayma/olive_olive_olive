
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "inverse"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-[#285640] text-white
    border border-[#285640]
    hover:bg-[#204832]
    dark:bg-[#47785B]
    dark:text-white
    dark:border-[#47785B]
    dark:hover:bg-[#568B69]
  `,

  secondary: `
    bg-[#E8F1EB] text-[#285640]
    border border-[#E0EAE3]
    hover:bg-[#DCEAE0]
    dark:bg-[#2B4434]
    dark:text-[#B9DEC4]
    dark:border-[#405B47]
    dark:hover:bg-[#354F3E]
  `,

  outline: `
    bg-white text-[#285640]
    border border-[#CBD5CE]
    hover:bg-[#F5F8F6]
    dark:bg-[#1C2921]
    dark:text-[#B9DEC4]
    dark:border-[#536B5B]
    dark:hover:bg-[#26372C]
  `,

  ghost: `
    bg-transparent text-gray-600
    border border-transparent
    hover:bg-gray-100
    dark:text-[#A8B8AC]
    dark:hover:bg-[#26372C]
    dark:hover:text-[#E5EDE7]
  `,

  inverse: `
    bg-white text-[#285640]
    border border-white
    hover:bg-gray-100
    dark:bg-[#E5EDE7]
    dark:text-[#1C2921]
    dark:border-[#E5EDE7]
    dark:hover:bg-[#C9D8CD]
  `,

  danger: `
    bg-red-600 text-white
    border border-red-600
    hover:bg-red-700
    dark:bg-[#A83F3F]
    dark:text-white
    dark:border-[#A83F3F]
    dark:hover:bg-[#BD4D4D]
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[29px] px-3 text-[10px] gap-1.5",
  md: "min-h-[34px] px-3.5 text-[11px] gap-2",
  lg: "min-h-[42px] px-5 text-sm gap-2",
};

export default function Button({
  asChild = false,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...(!asChild
        ? {
            type,
            disabled: disabled || loading,
          }
        : {})}
      className={`
        inline-flex items-center justify-center
        rounded-[6px] font-semibold
        whitespace-nowrap
        transition-colors duration-200

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#285640]/20
        dark:focus-visible:ring-[#91C5A1]/30

        disabled:cursor-not-allowed
        disabled:opacity-50

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : "w-auto max-w-full"}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </Comp>
  );
}
