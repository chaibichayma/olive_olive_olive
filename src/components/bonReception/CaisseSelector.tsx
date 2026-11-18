
import { useEffect, useState } from "react";
import { Grid3X3 } from "lucide-react";

interface CaisseSelectorProps {
  selectedCaisses?: string[];
  onChange?: (values: string[]) => void;
}

export default function CaisseSelector({
  selectedCaisses,
  onChange,
}: CaisseSelectorProps) {
  const [selected, setSelected] = useState<string[]>(
    selectedCaisses ?? []
  );

  useEffect(() => {
    setSelected(selectedCaisses ?? []);
  }, [selectedCaisses]);

  const caisses = Array.from(
    { length: 91 },
    (_, index) => index + 1
  );

  const handleSelect = (caisse: number) => {
    const value = caisse.toString();

    const updatedSelection = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    setSelected(updatedSelection);
    onChange?.(updatedSelection);
  };

  return (
    <div className="rounded-xl border border-[#E5EBE6] bg-white p-4">

      {/* HEADER */}
      <div className="mb-3 flex items-center gap-2">
        <Grid3X3
          size={16}
          className="text-[#47785B]"
        />

        <h3 className="text-sm font-semibold text-[#38453D]">
          Sélectionnez les caisses
        </h3>

        <span className="ml-auto rounded-full bg-[#EDF5EF] px-2.5 py-1 text-[10px] font-semibold text-[#285640]">
          {selected.length} sélectionnée(s)
        </span>
      </div>

      {/* CAISSES */}
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 md:grid-cols-14">
        {caisses.map((caisse) => {
          const isSelected = selected.includes(caisse.toString());

          return (
            <button
              key={caisse}
              type="button"
              onClick={() => handleSelect(caisse)}
              aria-pressed={isSelected}
              className={`
                flex h-7 items-center justify-center
                rounded-[4px]
                text-[10px] font-semibold
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#285640] text-white ring-2 ring-[#A9C7B2] ring-offset-1"
                    : "bg-[#75B58A] text-white hover:bg-[#568F6B]"
                }
              `}
            >
              {caisse}
            </button>
          );
        })}
      </div>
    </div>
  );
}
