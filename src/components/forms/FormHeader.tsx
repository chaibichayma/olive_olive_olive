
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "../../components/ui/Button";

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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

      {/* TITRE ET DESCRIPTION */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#285640] transition-colors duration-200 dark:bg-[#26372C] dark:text-[#91C5A1]">
              {icon}
            </div>
          )}

          <h1 className="text-xl font-bold tracking-tight text-[#344238] transition-colors duration-200 dark:text-[#E5EDE7] sm:text-2xl">
            {title}
          </h1>
        </div>

        {description && (
          <p className="mt-1 text-[15px] font-semibold leading-5 text-[#7D8981] transition-colors duration-200 dark:text-[#A8B8AC]">
            {description}
          </p>
        )}
      </div>

      {/* BOUTON RETOUR */}

      <Button
        type="button"
        variant="secondary"
        size="md"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        className="
          sm:mt-3
          shrink-0
          !rounded-lg
          !border
          !border-[#DCEADF]
          !bg-[#EDF5EF]
          !px-4
          !font-semibold
          !text-[#285640]
          shadow-none
          transition-all
          duration-200
          hover:!border-[#C8DDCE]
          hover:!bg-[#E2EFE5]
          dark:!border-[#405B49]
          dark:!bg-[#26372C]
          dark:!text-[#B9DEC4]
          dark:hover:!border-[#536B5B]
          dark:hover:!bg-[#2B4434]
        "
      >
        Retour à la page
      </Button>

    </div>
  );
}
