import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  sanskritHint?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, sanskritHint, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "mb-1.5 flex items-center justify-between text-[14px] font-medium text-[#193B3B]",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {required && <span className="text-[#A9824D]">*</span>}
        </span>
        {sanskritHint && (
          <span className="font-serif text-[13px] italic text-[#547070]">{sanskritHint}</span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
