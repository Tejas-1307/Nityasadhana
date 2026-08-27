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
        "mb-6 flex flex-col gap-4 border-b border-[rgba(32,32,29,0.06)] pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div>
        {sanskritSubtitle && (
          <p className="font-serif text-[13px] font-medium tracking-wide text-[#D9822B]">
            {sanskritSubtitle}
          </p>
        )}
        <h1 className="text-[26px] font-bold tracking-tight text-[#20201D] sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[14px] text-[#66635D] sm:text-[15px]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
