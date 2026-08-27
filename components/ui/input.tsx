import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon ? (
            <div className="pointer-events-none absolute left-4 text-[#66635D]">{leftIcon}</div>
          ) : null}
          <input
            id={id}
            type={type}
            className={cn(
              "h-[52px] w-full rounded-[12px] border bg-white px-4 text-[15px] text-[#20201D] transition-colors placeholder:text-[#66635D]/60 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[#E8D9BF]/20 disabled:opacity-60",
              leftIcon ? "pl-11" : "pl-4",
              rightIcon ? "pr-11" : "pr-4",
              error
                ? "border-[#B33927] focus:border-[#B33927] focus:ring-[#B33927]/20"
                : "border-[rgba(32,32,29,0.12)] hover:border-[rgba(32,32,29,0.25)] focus:border-[#2457A6] focus:ring-[#2457A6]/20",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />
          {rightIcon ? <div className="absolute right-4 text-[#66635D]">{rightIcon}</div> : null}
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

Input.displayName = "Input";
