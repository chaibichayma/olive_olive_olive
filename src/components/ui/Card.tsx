
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
}

const paddings = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-4 sm:p-6 lg:p-7",
};

export default function Card({
  children,
  title,
  description,
  headerAction,
  padding = "md",
  shadow = true,
  className = "",
  ...props
}: CardProps) {
  return (
    <section
      className={`
        w-full min-w-0 rounded-[11px]
        border border-[#E7ECE9]
        bg-white
        ${shadow ? "shadow-[0_2px_8px_rgba(31,55,43,0.10)]" : ""}
        ${className}
      `}
      {...props}
    >
      {(title || description || headerAction) && (
        <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-[13px] font-semibold text-[#26352D] sm:text-sm">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-[10px] leading-4 text-[#929B96] sm:text-[11px]">
                {description}
              </p>
            )}
          </div>

          {headerAction && (
            <div className="flex shrink-0 items-center gap-2">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={paddings[padding]}>
        {children}
      </div>
    </section>
  );
}
