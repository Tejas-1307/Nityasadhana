import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "ghost" | "secondary" | "primary" | "saffron";
  size?: "default" | "sm";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "default",
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      ghost:
        "text-[#193B3B] hover:bg-[rgba(63,148,149,0.08)] active:bg-[rgba(63,148,149,0.14)] focus-visible:ring-[#3F9495]",
      secondary:
        "bg-white border border-[rgba(63,148,149,0.16)] text-[#193B3B] hover:bg-[#EAF7F4] active:bg-[#D8F1EE]/60 focus-visible:ring-[#3F9495]",
      primary:
        "bg-[#3F9495] text-white hover:bg-[#337B7C] active:bg-[#286364] focus-visible:ring-[#3F9495]",
      saffron:
        "bg-[#A9824D] text-white hover:bg-[#8A6635] active:bg-[#72532A] focus-visible:ring-[#A9824D]",
    };

    const sizeStyles = {
      default: "h-12 w-12 min-h-[48px] min-w-[48px] rounded-[12px]",
      sm: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-[10px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
