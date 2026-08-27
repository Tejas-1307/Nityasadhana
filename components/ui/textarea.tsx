import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  maxCharacters?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, helperText, maxCharacters, value, defaultValue, onChange, id, ...props },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState<number>(
      String(value || defaultValue || "").length
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full">
        <textarea
          id={id}
          className={cn(
            "min-h-[100px] w-full rounded-[12px] border bg-white p-4 text-[15px] text-[#20201D] transition-colors placeholder:text-[#66635D]/60 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[#E8D9BF]/20 disabled:opacity-60",
            error
              ? "border-[#B33927] focus:border-[#B33927] focus:ring-[#B33927]/20"
              : "border-[rgba(32,32,29,0.12)] hover:border-[rgba(32,32,29,0.25)] focus:border-[#2457A6] focus:ring-[#2457A6]/20",
            className
          )}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          {error ? (
            <p id={`${id}-error`} className="text-[13px] font-medium text-[#B33927]">
              {error}
            </p>
          ) : helperText ? (
            <p id={`${id}-helper`} className="text-[13px] text-[#66635D]">
              {helperText}
            </p>
          ) : (
            <div />
          )}

          {maxCharacters && (
            <span className="text-[12px] text-[#66635D]">
              {charCount}/{maxCharacters}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
