
import ImageUploadField from "./ImageUploadField";

import type {
  FormField,
} from "../EntityForm";

// ==========================================
// STYLE DES INPUTS
// ==========================================

export const inputClassName = `
  !h-[40px]
  !w-full
  !min-w-0
  !rounded-[7px]
  !border
  !border-[#E1E5EA]
  !bg-white
  !px-3
  !py-0
  !text-[15px]
  !font-semibold
  !leading-normal
  !text-black
  !outline-none
  !shadow-none
  transition-all
  duration-200
  placeholder:!text-[15px]
  placeholder:!font-semibold
  placeholder:!text-[#A0AAA3]
  hover:!border-[#C6D0C9]
  focus:!border-[#6D9B82]
  focus:!ring-2
  focus:!ring-[#E8F1EB]
  disabled:!cursor-not-allowed
  disabled:!bg-[#F5F7F5]

  dark:!border-[#405247]
  dark:!bg-[#1C2921]
  dark:!text-[#E5EDE7]
  dark:placeholder:!text-[#89958C]
  dark:hover:!border-[#536B5B]
  dark:focus:!border-[#79A98A]
  dark:focus:!ring-[#79A98A]/15
  dark:disabled:!bg-[#26372C]
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

  return (
    <div className="min-w-0">

      {/* LABEL */}

      <label
        htmlFor={field.name}
        className="
          mb-1.5
          block
          !text-[15px]
          !font-semibold
          !leading-normal
          text-[#344238]
          transition-colors duration-200
          dark:text-[#E5EDE7]
        "
      >
        {field.label}

        {field.required && (
          <span className="ml-1 text-[18px] font-bold text-red-500">
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
          className={`
            ${inputClassName}
            !font-semibold
            ${
              value === ""
                ? "!text-[#A0AAA3] dark:!text-[#89958C]"
                : "!text-[#46534B] dark:!text-[#E5EDE7]"
            }
          `}
        >
          <option
            value=""
            className="bg-white font-semibold text-[#A0AAA3] dark:bg-[#1C2921] dark:text-[#89958C]"
          >
            {field.placeholder ?? "Sélectionner"}
          </option>

          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white font-semibold text-[#46534B] dark:bg-[#1C2921] dark:text-[#E5EDE7]"
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
            !text-[14px]
            !font-semibold
            placeholder:!font-semibold
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
