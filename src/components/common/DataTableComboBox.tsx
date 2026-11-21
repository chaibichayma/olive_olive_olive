
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
      {/* Search / Selected value */}
      <div className={`relative flex h-10 w-full items-center rounded-lg border bg-white transition-all dark:bg-[#26372C]
        ${
          isOpen
            ? "border-[#47785B] ring-2 ring-[#47785B]/20 dark:border-[#91C5A1] dark:ring-[#91C5A1]/20"
            : "border-[#DCE3DE] hover:border-[#47785B] dark:border-[#35463B] dark:hover:border-[#6FA982]"
        }
        ${
          disabled
            ? "cursor-not-allowed bg-gray-50 opacity-60 dark:bg-[#202D25]"
            : ""
        }
      `}>
        <Search
          size={16}
          className="ml-3 shrink-0 text-[#89958C] dark:text-[#A8B8AC]"
        />

        <input
          type="text"
          disabled={disabled}
          value={isOpen ? searchTerm : ""}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder={
            selectedItem
              ? getOptionLabel(selectedItem)
              : placeholder
          }
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-[#38453D] outline-none placeholder:text-[#89958C] disabled:cursor-not-allowed dark:text-[#E5EDE7] dark:placeholder:text-[#A8B8AC]"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setIsOpen((previous) => !previous);
            setSearchTerm("");
          }}
          className="flex h-full items-center px-3 text-[#64736A] dark:text-[#A8B8AC]"
        >
          <ChevronDown
            size={17}
            className={`shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          <button
            type="button"
            aria-label="Fermer la liste"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />

          <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#DCE3DE] bg-white shadow-lg dark:border-[#35463B] dark:bg-[#1C2921]">

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
