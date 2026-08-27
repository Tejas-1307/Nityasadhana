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
        "bg-[#2457A6] text-white hover:bg-[#1D4685] active:bg-[#183B70] focus-visible:ring-[#2457A6] shadow-sm",
      secondary:
        "bg-[#F7F1E5] text-[#20201D] border border-[rgba(32,32,29,0.12)] hover:bg-[#E8D9BF]/40 active:bg-[#E8D9BF]/70 focus-visible:ring-[#2457A6]",
      saffron:
        "bg-[#D9822B] text-white hover:bg-[#C27222] active:bg-[#A95620] focus-visible:ring-[#D9822B] shadow-sm",
      destructive:
        "bg-[#B33927] text-white hover:bg-[#992E1E] active:bg-[#802517] focus-visible:ring-[#B33927]",
      ghost:
        "bg-transparent text-[#20201D] hover:bg-[rgba(32,32,29,0.05)] active:bg-[rgba(32,32,29,0.08)] focus-visible:ring-[#2457A6]",
      outline:
        "bg-transparent text-[#2457A6] border border-[#2457A6]/30 hover:border-[#2457A6] hover:bg-[#2457A6]/5 active:bg-[#2457A6]/10 focus-visible:ring-[#2457A6]",
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
