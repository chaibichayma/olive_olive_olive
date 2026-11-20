
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "../ui";

interface FilterActionsProps {
  onReset: () => void;
}

export default function FilterActions({
  onReset,
}: FilterActionsProps) {
  return (
    <div
      className="
        flex shrink-0 items-center gap-2
        border-l border-[#E2E8E3] pl-4
        dark:border-[#35463B]
        max-sm:w-full
        max-sm:border-l-0
        max-sm:pl-0
      "
    >
      {/* BOUTON FILTRER */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        leftIcon={<Filter size={14} />}
        className="
          h-[39px] rounded-lg px-5
          text-[16px] font-semibold
          shadow-sm
          active:scale-[0.98]
        "
      >
        Filtrer
      </Button>

      {/* BOUTON RÉINITIALISER */}
      <Button
        type="button"
        variant="outline"
        size="md"
        leftIcon={<RotateCcw size={14} />}
        onClick={onReset}
        className="
          h-[39px] rounded-lg px-4
          border-[#47785B]
          text-[16px] font-semibold
          dark:border-[#6FA982]
          dark:text-[#B9DEC4]
          dark:hover:bg-[#26372C]
          active:scale-[0.98]
        "
      >
        Réinitialiser
      </Button>
    </div>
  );
}
