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
        "text-[#20201D] hover:bg-[rgba(32,32,29,0.06)] active:bg-[rgba(32,32,29,0.10)] focus-visible:ring-[#2457A6]",
      secondary:
        "bg-white border border-[rgba(32,32,29,0.10)] text-[#20201D] hover:bg-[#F7F1E5] active:bg-[#E8D9BF]/60 focus-visible:ring-[#2457A6]",
      primary:
        "bg-[#2457A6] text-white hover:bg-[#1D4685] active:bg-[#183B70] focus-visible:ring-[#2457A6]",
      saffron:
        "bg-[#D9822B] text-white hover:bg-[#C27222] active:bg-[#A95620] focus-visible:ring-[#D9822B]",
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
