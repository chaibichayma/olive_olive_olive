
import ImageUploadField from "./ImageUploadField";

import type {
  FormField,
} from "../EntityForm";

// ==========================================
// STYLE DES INPUTS
// ==========================================

export const inputClassName = `
  !h-[34px]
  !w-full
  !min-w-0
  !rounded-[7px]
  !border
  !border-[#E1E5EA]
  !bg-white
  !px-2.5
  !py-0
  !text-[10px]
  !font-normal
  !leading-normal
  !text-[#46534B]
  !outline-none
  !shadow-none
  transition-all
  duration-200
  placeholder:!text-[10px]
  placeholder:!text-[#A0AAA3]
  hover:!border-[#C6D0C9]
  focus:!border-[#6D9B82]
  focus:!ring-2
  focus:!ring-[#E8F1EB]
  disabled:!cursor-not-allowed
  disabled:!bg-[#F5F7F5]
`;

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface FormFieldRendererProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
}

// ==========================================
// RENDERER DES CHAMPS
// ==========================================

export default function FormFieldRenderer({
  field,
  value,
  onChange,
}: FormFieldRendererProps) {

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="min-w-0">

      {/* LABEL */}

      <label
        htmlFor={field.name}
        className="
          mb-1.5
          block
          !text-[9px]
          !font-semibold
          !leading-normal
          text-[#344238]
        "
      >
        {field.label}

        {field.required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {/* IMAGE */}

      {field.type === "image" ? (

        <ImageUploadField
          name={field.name}
          value={value}
          accept={field.accept}
          disabled={field.disabled}
          onChange={onChange}
        />

      ) : field.type === "select" ? (

        /* SELECT */

        <select
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={field.disabled}
          value={value}
          onChange={(event) =>
            onChange(field.name, event.target.value)
          }
          dir={field.direction}
          className={inputClassName}
        >
          <option value="">
            {field.placeholder ?? "Sélectionner"}
          </option>

          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

      ) : field.type === "textarea" ? (

        /* TEXTAREA */

        <textarea
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={field.disabled}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) =>
            onChange(field.name, event.target.value)
          }
          dir={field.direction ?? "auto"}
          className={`
            ${inputClassName}
            !h-auto
            !min-h-[75px]
            !py-2
            resize-y
          `}
        />

      ) : (

        /* INPUT CLASSIQUE */

        <input
          id={field.name}
          name={field.name}
          type={field.type ?? "text"}
          required={field.required}
          disabled={field.disabled}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) =>
            onChange(field.name, event.target.value)
          }
          dir={field.direction ?? "auto"}
          className={inputClassName}
        />

      )}

    </div>
  );
}
