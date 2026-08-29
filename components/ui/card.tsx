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
        "bg-white border border-[rgba(63,148,149,0.14)] shadow-[0_2px_8px_rgba(25,59,59,0.04)]",
      elevated:
        "bg-white border border-[rgba(63,148,149,0.14)] shadow-[0_8px_32px_rgba(25,59,59,0.08)]",
      sand: "bg-[#D8F1EE]/40 border border-[rgba(63,148,149,0.14)]",
      interactive:
        "bg-white border border-[rgba(63,148,149,0.14)] shadow-[0_2px_8px_rgba(25,59,59,0.04)] hover:border-[#3F9495]/50 hover:shadow-[0_4px_20px_rgba(63,148,149,0.10)] active:scale-[0.99] transition-all cursor-pointer",
      highlightSaffron:
        "bg-white border-l-4 border-l-[#A9824D] border-y border-r border-[rgba(63,148,149,0.14)] shadow-[0_2px_8px_rgba(25,59,59,0.04)]",
      highlightBlue:
        "bg-white border-l-4 border-l-[#3F9495] border-y border-r border-[rgba(63,148,149,0.14)] shadow-[0_2px_8px_rgba(25,59,59,0.04)]",
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
          "rounded-[16px] text-[#193B3B] transition-colors",
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
        "text-[17px] font-semibold leading-tight text-[#193B3B] sm:text-[18px]",
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
  return <p className={cn("text-[13px] text-[#547070] sm:text-[14px]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between border-t border-[rgba(63,148,149,0.12)] pt-3 text-[13px] text-[#547070]",
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
    default: "bg-[#D8F1EE] text-[#193B3B]",
    krishna: "bg-[#3F9495]/12 text-[#3F9495]",
    saffron: "bg-[#A9824D]/15 text-[#A9824D]",
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
            <p className="font-serif text-[12px] text-[#A9824D]">{sanskritLabel}</p>
          )}
          <p className="text-[13px] font-medium text-[#547070]">{label}</p>
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
        <span className="text-[26px] font-bold tracking-tight text-[#193B3B] sm:text-[30px]">
          {value}
        </span>
        {unit && <span className="text-[14px] font-medium text-[#547070]">{unit}</span>}
      </div>

      {trend && <p className="mt-2 text-[12px] font-medium text-[#328A7A]">{trend}</p>}
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
    neutral: "bg-[#D8F1EE]/40 border-[rgba(63,148,149,0.16)]",
    saffron: "bg-[#A9824D]/10 border-[#A9824D]/25",
    krishna: "bg-[#3F9495]/8 border-[#3F9495]/20",
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
        <h4 className="text-[14px] font-semibold text-[#193B3B]">{title}</h4>
        <p className="text-[13px] leading-relaxed text-[#547070]">{description}</p>
      </div>
    </div>
  );
}
