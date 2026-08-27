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
          "mb-1.5 flex items-center justify-between text-[14px] font-medium text-[#20201D]",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {required && <span className="text-[#D9822B]">*</span>}
        </span>
        {sanskritHint && (
          <span className="font-serif text-[13px] italic text-[#66635D]/80">{sanskritHint}</span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
