
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        ${compact ? "py-7" : "py-12"}
      `}
    >
      {icon && (
        <div className="mb-3 flex items-center justify-center text-[#AAB8AE] dark:text-[#718A78]">
          {icon}
        </div>
      )}

      <p className="text-[15px] font-semibold text-[#38453D] dark:text-[#E5EDE7]">
        {title}
      </p>

      {description && (
        <p className="mt-1 max-w-[350px] text-[13px] font-semibold leading-5 text-[#8A948D] dark:text-[#A8B8AC]">
          {description}
        </p>
      )}
    </div>
  );
}
