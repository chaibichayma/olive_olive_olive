
import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = "Sélectionner une option",
      error,
      hint,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="
              mb-1.5 block text-sm font-semibold
              text-[#344238]
              dark:text-[#E5EDE7]
            "
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              h-10 w-full appearance-none rounded-lg border
              bg-white px-3 pr-10 text-sm text-[#344238]
              outline-none transition-all
              focus:border-[#556B2F] focus:ring-2
              focus:ring-[#556B2F]/15
              disabled:cursor-not-allowed disabled:bg-[#F2F4EF]
              disabled:text-[#89948C]

              dark:bg-[#1C2921]
              dark:text-[#E5EDE7]
              dark:border-[#405247]
              dark:focus:border-[#79A98A]
              dark:focus:ring-[#79A98A]/20
              dark:disabled:bg-[#26372C]
              dark:disabled:text-[#89958C]

              ${error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-[#A83F3F] dark:focus:border-[#BD4D4D] dark:focus:ring-red-900/30"
                : "border-[#DCE3D8]"
              }
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="dark:bg-[#1C2921] dark:text-[#E5EDE7]"
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none absolute right-3 top-1/2
              -translate-y-1/2
              text-[#89948C]
              dark:text-[#A8B8AC]
            "
          />
        </div>

        {error && (
          <p className="
            mt-1 text-xs font-medium
            text-red-500
            dark:text-[#E5A0A0]
          ">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="
            mt-1 text-xs
            text-[#89948C]
            dark:text-[#A8B8AC]
          ">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
