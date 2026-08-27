import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  sanskritSubtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Your journey begins here",
  description = "No entries recorded yet. Begin your daily Sadhana practice with peaceful determination.",
  sanskritSubtitle = "आरम्भः शुभो भवतु",
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[rgba(32,32,29,0.15)] bg-[#F7F1E5]/60 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8D9BF]/60 text-[#2457A6]">
        {icon || <Compass className="h-7 w-7 stroke-[1.75]" />}
      </div>
      {sanskritSubtitle && (
        <p className="mb-1 font-serif text-[13px] font-medium text-[#D9822B]">{sanskritSubtitle}</p>
      )}
      <h4 className="text-[18px] font-semibold text-[#20201D]">{title}</h4>
      <p className="mt-1.5 max-w-sm text-[14px] text-[#66635D]">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="default" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
