import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "saffron" | "destructive" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold text-center select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#3F9495] text-white hover:bg-[#337B7C] active:bg-[#286364] focus-visible:ring-[#3F9495] shadow-sm",
      secondary:
        "bg-[#D8F1EE]/60 text-[#193B3B] border border-[rgba(63,148,149,0.22)] hover:bg-[#8ED9D5]/30 active:bg-[#8ED9D5]/50 focus-visible:ring-[#3F9495]",
      saffron:
        "bg-[#A9824D] text-white hover:bg-[#96723E] active:bg-[#826132] focus-visible:ring-[#A9824D] shadow-sm",
      destructive:
        "bg-[#B33927] text-white hover:bg-[#992E1E] active:bg-[#802517] focus-visible:ring-[#B33927]",
      ghost:
        "bg-transparent text-[#193B3B] hover:bg-[rgba(63,148,149,0.08)] active:bg-[rgba(63,148,149,0.14)] focus-visible:ring-[#3F9495]",
      outline:
        "bg-transparent text-[#3F9495] border border-[#3F9495]/35 hover:border-[#3F9495] hover:bg-[#3F9495]/10 active:bg-[#3F9495]/15 focus-visible:ring-[#3F9495]",
    };

    const sizeStyles = {
      default: "h-[52px] px-6 text-[15px] rounded-[12px] min-w-[48px] min-h-[48px]",
      sm: "h-[44px] px-4 text-[14px] rounded-[8px] min-w-[44px] min-h-[44px]",
      lg: "h-[56px] px-8 text-[16px] rounded-[14px] min-w-[52px] min-h-[52px]",
      icon: "h-[48px] w-[48px] p-0 rounded-[12px] min-w-[48px] min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
