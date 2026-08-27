import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something paused our path",
  message = "An unexpected error occurred. Please try again with patience.",
  retryLabel = "Try Again",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[16px] border border-[#B33927]/20 bg-[#B33927]/5 p-8 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#B33927]/15 text-[#B33927]">
        <AlertCircle className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h4 className="text-[17px] font-semibold text-[#20201D]">{title}</h4>
      <p className="mt-1 max-w-sm text-[14px] text-[#66635D]">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4"
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
