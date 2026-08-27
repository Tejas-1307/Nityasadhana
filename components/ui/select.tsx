import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  sanskritLabel?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, helperText, placeholder, id, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          <select
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(
              "h-[52px] w-full appearance-none rounded-[12px] border bg-white pl-4 pr-11 text-[15px] text-[#20201D] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[#E8D9BF]/20 disabled:opacity-60",
              error
                ? "border-[#B33927] focus:border-[#B33927] focus:ring-[#B33927]/20"
                : "border-[rgba(32,32,29,0.12)] hover:border-[rgba(32,32,29,0.25)] focus:border-[#2457A6] focus:ring-[#2457A6]/20",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled selected>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label} {opt.sanskritLabel ? `(${opt.sanskritLabel})` : ""}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 text-[#66635D]">
            <ChevronDown className="h-4 w-4 stroke-[2]" />
          </div>
        </div>
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-[#B33927]">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${id}-helper`} className="mt-1.5 text-[13px] text-[#66635D]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
