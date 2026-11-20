
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
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
          {leftIcon && (
            <div className="
              pointer-events-none absolute inset-y-0 left-3
              flex items-center
              text-[#89948C]
              dark:text-[#A8B8AC]
            ">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              h-10 w-full rounded-lg border
              bg-white text-sm text-[#344238]
              placeholder:text-[#A3ADA5]
              outline-none transition-all

              focus:border-[#556B2F]
              focus:ring-2
              focus:ring-[#556B2F]/15

              disabled:cursor-not-allowed
              disabled:bg-[#F2F4EF]
              disabled:text-[#89948C]

              dark:bg-[#1C2921]
              dark:text-[#E5EDE7]
              dark:placeholder:text-[#89958C]
              dark:disabled:bg-[#26372C]
              dark:disabled:text-[#89958C]

              dark:focus:border-[#79A98A]
              dark:focus:ring-[#79A98A]/20

              ${leftIcon ? "pl-10" : "px-3"}
              ${rightIcon ? "pr-10" : "pr-3"}

              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-[#A83F3F] dark:focus:border-[#BD4D4D] dark:focus:ring-red-900/30"
                  : "border-[#DCE3D8] dark:border-[#405247]"
              }

              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="
              absolute inset-y-0 right-3
              flex items-center
              text-[#89948C]
              dark:text-[#A8B8AC]
            ">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
