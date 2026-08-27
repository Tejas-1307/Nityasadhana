import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type CardVariant =
  "default" | "elevated" | "sand" | "interactive" | "highlightSaffron" | "highlightBlue";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "default" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "default", children, ...props }, ref) => {
    const variantStyles: Record<CardVariant, string> = {
      default:
        "bg-white border border-[rgba(32,32,29,0.08)] shadow-[0_2px_8px_rgba(32,32,29,0.04)]",
      elevated:
        "bg-white border border-[rgba(32,32,29,0.08)] shadow-[0_8px_32px_rgba(32,32,29,0.08)]",
      sand: "bg-[#E8D9BF]/40 border border-[rgba(32,32,29,0.08)]",
      interactive:
        "bg-white border border-[rgba(32,32,29,0.08)] shadow-[0_2px_8px_rgba(32,32,29,0.04)] hover:border-[#2457A6]/50 hover:shadow-[0_4px_20px_rgba(36,87,166,0.08)] active:scale-[0.99] transition-all cursor-pointer",
      highlightSaffron:
        "bg-white border-l-4 border-l-[#D9822B] border-y border-r border-[rgba(32,32,29,0.08)] shadow-[0_2px_8px_rgba(32,32,29,0.04)]",
      highlightBlue:
        "bg-white border-l-4 border-l-[#2457A6] border-y border-r border-[rgba(32,32,29,0.08)] shadow-[0_2px_8px_rgba(32,32,29,0.04)]",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      default: "p-4 sm:p-5 md:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[16px] text-[#20201D] transition-colors",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 flex flex-col space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[17px] font-semibold leading-tight text-[#20201D] sm:text-[18px]",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[13px] text-[#66635D] sm:text-[14px]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between border-t border-[rgba(32,32,29,0.06)] pt-3 text-[13px] text-[#66635D]",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

/**
 * Metric Card (for Sadhana statistics and numbers)
 */
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  sanskritLabel?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: "default" | "krishna" | "saffron";
}

export function MetricCard({
  label,
  value,
  unit,
  sanskritLabel,
  icon,
  trend,
  variant = "default",
  className,
  ...props
}: MetricCardProps) {
  const iconColors = {
    default: "bg-[#E8D9BF]/50 text-[#20201D]",
    krishna: "bg-[#2457A6]/10 text-[#2457A6]",
    saffron: "bg-[#D9822B]/15 text-[#D9822B]",
  };

  return (
    <Card
      variant="default"
      padding="default"
      className={cn("flex flex-col justify-between", className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          {sanskritLabel && (
            <p className="font-serif text-[12px] text-[#D9822B]">{sanskritLabel}</p>
          )}
          <p className="text-[13px] font-medium text-[#66635D]">{label}</p>
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              iconColors[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[26px] font-bold tracking-tight text-[#20201D] sm:text-[30px]">
          {value}
        </span>
        {unit && <span className="text-[14px] font-medium text-[#66635D]">{unit}</span>}
      </div>

      {trend && <p className="mt-2 text-[12px] font-medium text-[#3D765B]">{trend}</p>}
    </Card>
  );
}

/**
 * Information Callout Card
 */
export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "neutral" | "saffron" | "krishna";
}

export function InfoCard({
  title,
  description,
  icon,
  variant = "neutral",
  className,
  ...props
}: InfoCardProps) {
  const variantStyles = {
    neutral: "bg-[#E8D9BF]/30 border-[rgba(32,32,29,0.08)]",
    saffron: "bg-[#D9822B]/10 border-[#D9822B]/20",
    krishna: "bg-[#2457A6]/5 border-[#2457A6]/15",
  };

  return (
    <div
      className={cn(
        "flex gap-3.5 rounded-[14px] border p-4 text-left transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <div className="shrink-0 pt-0.5">{icon}</div>}
      <div className="space-y-0.5">
        <h4 className="text-[14px] font-semibold text-[#20201D]">{title}</h4>
        <p className="text-[13px] leading-relaxed text-[#66635D]">{description}</p>
      </div>
    </div>
  );
}
