
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface ComboBoxColumn<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableComboBoxProps<T> {
  data: T[];
  columns: ComboBoxColumn<T>[];

  value: string;
  onChange: (value: string) => void;

  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;

  placeholder?: string;
  emptyMessage?: string;
  maxHeight?: number;
  width?: string;
  disabled?: boolean;
}

export default function DataTableComboBox<T>({
  data,
  columns,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  placeholder = "Sélectionner...",
  emptyMessage = "Aucun résultat trouvé",
  maxHeight = 260,
  width = "100%",
  disabled = false,
}: DataTableComboBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    getOptionLabel(item)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedItem = data.find(
    (item) => getOptionValue(item) === value
  );

  const handleSelect = (item: T) => {
    onChange(getOptionValue(item));
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      style={{ width }}
    >
      {/* Selected value */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((previous) => !previous)}
        className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 text-left text-sm outline-none transition-all
          ${
            isOpen
              ? "border-[#47785B] ring-2 ring-[#47785B]/20 dark:border-[#91C5A1] dark:ring-[#91C5A1]/20"
              : "border-[#DCE3DE] hover:border-[#47785B] dark:border-[#35463B] dark:hover:border-[#6FA982]"
          }
          bg-white dark:bg-[#26372C]
          ${
            disabled
              ? "cursor-not-allowed bg-gray-50 opacity-60 dark:bg-[#202D25]"
              : ""
          }
        `}
      >
        <span
          className={
            selectedItem
              ? "truncate text-[#38453D] dark:text-[#E5EDE7]"
              : "truncate text-[#89958C] dark:text-[#A8B8AC]"
          }
        >
          {selectedItem
            ? getOptionLabel(selectedItem)
            : placeholder}
        </span>

        <ChevronDown
          size={17}
          className={`ml-2 shrink-0 text-[#64736A] transition-transform dark:text-[#A8B8AC] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          <button
            type="button"
            aria-label="Fermer la liste"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#DCE3DE] bg-white shadow-lg dark:border-[#35463B] dark:bg-[#1C2921]">

            {/* Search */}
            <div className="border-b border-[#E9EDEB] bg-white p-3 dark:border-[#35463B] dark:bg-[#1C2921]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89958C] dark:text-[#A8B8AC]"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Rechercher par nom ou téléphone..."
                  className="h-10 w-full rounded-lg border border-[#DCE3DE] bg-white pl-9 pr-3 text-[14px] text-[#38453D] outline-none transition placeholder:text-[#A0AAA3] focus:border-[#47785B] focus:ring-2 focus:ring-[#47785B]/10 dark:border-[#35463B] dark:bg-[#26372C] dark:text-[#E5EDE7] dark:placeholder:text-[#829287] dark:focus:border-[#91C5A1] dark:focus:ring-[#91C5A1]/10"
                />
              </div>
            </div>

            {/* Table */}
            <div
              className="overflow-auto"
              style={{ maxHeight }}
            >
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-[#F3F6F3] dark:bg-[#26372C]">
                  <tr className="border-b border-[#DCE3DE] dark:border-[#35463B]">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`whitespace-nowrap px-3 py-3 font-semibold text-[#38453D] dark:text-[#D4E0D7] ${column.className ?? ""}`}
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const optionValue = getOptionValue(item);
                      const isSelected = optionValue === value;

                      return (
                        <tr
                          key={optionValue}
                          onClick={() => handleSelect(item)}
                          className={`cursor-pointer border-b border-[#E9EDEB] transition-colors dark:border-[#35463B]
                            ${
                              isSelected
                                ? "bg-[#285640] text-white dark:bg-[#47785B]"
                                : "text-[#38453D] hover:bg-[#EDF5EF] dark:text-[#D4E0D7] dark:hover:bg-[#26372C]"
                            }
                          `}
                        >
                          {columns.map((column) => {
                            const cellValue = (
                              item as Record<string, unknown>
                            )[column.key];

                            return (
                              <td
                                key={column.key}
                                className={`whitespace-nowrap px-3 py-2.5 ${
                                  column.className ?? ""
                                }`}
                              >
                                {column.render
                                  ? column.render(item)
                                  : String(cellValue ?? "")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-3 py-6 text-center text-sm text-[#89958C] dark:text-[#A8B8AC]"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
