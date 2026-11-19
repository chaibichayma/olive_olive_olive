
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#285640]">
              {icon}
            </div>
          )}

          <h1 className="text-xl font-bold tracking-tight text-[#344238] sm:text-2xl">
            {title}
          </h1>
        </div>

        {description && (
          <p className="mt-1 text-[15px] font-semibold leading-5 text-[#7D8981]">
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
        "
      >
        Retour à la page
      </Button>

    </div>
  );
}
