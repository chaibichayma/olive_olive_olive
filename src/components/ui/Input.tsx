

import * as React from "react";
import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* =====================================================
   INPUT VARIANTS
===================================================== */

const inputVariants = cva(
  `
    flex w-full border border-input bg-background
    text-foreground placeholder:text-muted-foreground/80
    shadow-xs shadow-black/5 transition-[color,box-shadow]
    outline-none

    focus-visible:border-ring
    focus-visible:ring-[3px]
    focus-visible:ring-ring/30

    disabled:cursor-not-allowed
    disabled:opacity-50
    [&[readonly]]:opacity-70

    file:h-full file:border-0 file:border-e
    file:border-solid file:border-input
    file:bg-transparent file:p-0
    file:font-medium file:text-foreground

    aria-invalid:border-destructive/60
    aria-invalid:ring-destructive/10

    dark:bg-[#1C2921]
    dark:border-[#405247]
    dark:text-[#E5EDE7]
    dark:placeholder:text-[#89958C]
    dark:shadow-[0_1px_3px_rgba(0,0,0,0.15)]

    dark:focus-visible:border-[#79A98A]
    dark:focus-visible:ring-[#79A98A]/20

    dark:disabled:bg-[#26372C]
    dark:disabled:text-[#89958C]

    dark:file:border-[#405247]
    dark:file:text-[#E5EDE7]

    dark:aria-invalid:border-[#A83F3F]
    dark:aria-invalid:ring-red-900/30
  `,
  {
    variants: {
      size: {
        lg: "h-10 px-4 text-sm rounded-lg file:pe-4 file:me-4",
        md: "h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md file:pe-3 file:me-3",
        sm: "h-7 px-2.5 text-xs rounded-md file:pe-2.5 file:me-2.5",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);

/* =====================================================
   INPUT ADDON VARIANTS
===================================================== */

const inputAddonVariants = cva(
  `
    flex shrink-0 items-center justify-center
    border border-input bg-muted
    text-secondary-foreground
    shadow-xs shadow-[rgba(0,0,0,0.05)]

    dark:bg-[#26372C]
    dark:border-[#405247]
    dark:text-[#B8C8BC]
    dark:shadow-[0_1px_3px_rgba(0,0,0,0.15)]
  `,
  {
    variants: {
      size: {
        sm: "h-7 min-w-7 rounded-md px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5",
        md: "h-8.5 min-w-8.5 rounded-md px-3 text-[0.8125rem] [&_svg:not([class*=size-])]:size-4",
        lg: "h-10 min-w-10 rounded-md px-4 text-sm [&_svg:not([class*=size-])]:size-4.5",
      },
      mode: {
        default: "",
        icon: "justify-center px-0",
      },
    },
    defaultVariants: {
      size: "md",
      mode: "default",
    },
  },
);

/* =====================================================
   INPUT GROUP VARIANTS
===================================================== */

const inputGroupVariants = cva(
  `
    flex items-stretch

    [&_[data-slot=input]]:grow

    [&_[data-slot=input-addon]:has(+[data-slot=input])]:rounded-e-none
    [&_[data-slot=input-addon]:has(+[data-slot=input])]:border-e-0

    [&_[data-slot=input]+[data-slot=input-addon]]:rounded-s-none
    [&_[data-slot=input]+[data-slot=input-addon]]:border-s-0

    [&_[data-slot=input-addon]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]+[data-slot=button]]:rounded-s-none
    [&_[data-slot=button]+[data-slot=input]]:rounded-s-none

    [&_[data-slot=input-addon]+[data-slot=input]]:rounded-s-none

    [&_[data-slot=input]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]:has(+[data-slot=input-addon])]:rounded-e-none
  `,
  {
    variants: {},
    defaultVariants: {},
  },
);

/* =====================================================
   INPUT WRAPPER VARIANTS
===================================================== */

const inputWrapperVariants = cva(
  `
    flex items-center gap-1.5

    has-[:focus-visible]:border-ring
    has-[:focus-visible]:outline-none
    has-[:focus-visible]:ring-[3px]
    has-[:focus-visible]:ring-ring/30

    [&>[data-slot=input]]:flex
    [&>[data-slot=input]]:w-full
    [&>[data-slot=input]]:h-auto
    [&>[data-slot=input]]:border-0
    [&>[data-slot=input]]:bg-transparent
    [&>[data-slot=input]]:p-0
    [&>[data-slot=input]]:shadow-none
    [&>[data-slot=input]]:outline-none
    [&>[data-slot=input]]:text-foreground
    [&>[data-slot=input]]:placeholder:text-muted-foreground
    [&>[data-slot=input]]:transition-colors
    [&>[data-slot=input]]:focus-visible:ring-0
    [&>[data-slot=input]]:disabled:cursor-not-allowed
    [&>[data-slot=input]]:disabled:opacity-50

    [&>svg]:text-muted-foreground

    dark:has-[:focus-visible]:border-[#79A98A]
    dark:has-[:focus-visible]:ring-[#79A98A]/20

    dark:[&>[data-slot=input]]:text-[#E5EDE7]
    dark:[&>[data-slot=input]]:placeholder:text-[#89958C]
    dark:[&>svg]:text-[#A8B8AC]
  `,
  {
    variants: {
      size: {
        sm: "gap-1.25 [&_svg:not([class*=size-])]:size-3.5",
        md: "gap-1.5 [&_svg:not([class*=size-])]:size-4",
        lg: "gap-1.5 [&_svg:not([class*=size-])]:size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* =====================================================
   MAIN INPUT
===================================================== */

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size"
    >,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      size,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (label
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="
              mb-1.5 block text-sm font-semibold
              text-[#344238]
              dark:text-[#E5EDE7]
            "
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="
                pointer-events-none absolute inset-y-0 left-3
                flex items-center
                text-[#89948C]
                dark:text-[#A8B8AC]
              "
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            data-slot="input"
            required={required}
            aria-invalid={!!error}
            className={cn(
              inputVariants({ size }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-100 dark:border-[#A83F3F] dark:focus-visible:border-[#BD4D4D] dark:focus-visible:ring-red-900/30",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className="
                pointer-events-none absolute inset-y-0 right-3
                flex items-center
                text-[#89948C]
                dark:text-[#A8B8AC]
              "
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs font-medium text-red-500 dark:text-[#E5A0A0]">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="mt-1 text-xs text-[#89948C] dark:text-[#A8B8AC]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/* =====================================================
   INPUT ADDON
===================================================== */

export interface InputAddonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputAddonVariants> {}

function InputAddon({
  className,
  size,
  mode,
  ...props
}: InputAddonProps) {
  return (
    <div
      data-slot="input-addon"
      className={cn(
        inputAddonVariants({ size, mode }),
        className,
      )}
      {...props}
    />
  );
}

export default Input;