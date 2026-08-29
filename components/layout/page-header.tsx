import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  sanskritSubtitle?: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  className,
  title,
  sanskritSubtitle,
  description,
  action,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 border-b border-[rgba(63,148,149,0.12)] pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div>
        {sanskritSubtitle && (
          <p className="font-serif text-[13px] font-medium tracking-wide text-[#A9824D]">
            {sanskritSubtitle}
          </p>
        )}
        <h1 className="text-[26px] font-bold tracking-tight text-[#193B3B] sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[14px] text-[#547070] sm:text-[15px]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
