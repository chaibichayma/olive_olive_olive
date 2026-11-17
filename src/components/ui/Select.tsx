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
            className="mb-1.5 block text-sm font-semibold text-[#344238]"
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
              ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-[#DCE3D8]"}
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
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#89948C]"
          />
        </div>

        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="mt-1 text-xs text-[#89948C]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;