
import type { ReactNode } from "react";

interface FormHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function FormHeader({
  title,
  description,
  icon,
}: FormHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#285640]">
            {icon}
          </div>
        )}

        <h2 className="text-xl font-bold tracking-tight text-[#344238]">
          {title}
        </h2>
      </div>

      {description && (
        <p className="text-xs leading-5 text-[#7D8981]">
          {description}
        </p>
      )}
    </div>
  );
}
