
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
  className?: string;
  addLabel?: string;
  onAdd?: () => void;
}

export default function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className = "",
  addLabel,
  onAdd,
}: PageHeaderProps) {
  return (
    <div
      className={`
        mb-5 flex flex-col justify-between gap-4
        sm:flex-row sm:items-center
        ${className}
      `}
    >
      {/* INFORMATIONS DE LA PAGE */}

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-[#344238] sm:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#7D8981]">
            {description}
          </p>
        )}
      </div>

      {/* ACTIONS DE LA PAGE */}

      {(actions || (addLabel && onAdd)) && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {actions}

          {addLabel && onAdd && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={15} />}
              onClick={onAdd}
              className="h-[38px] rounded-lg px-4 text-[11px]"
            >
              {addLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
