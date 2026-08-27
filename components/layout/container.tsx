import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "form" | "reading" | "full";
  as?: React.ElementType;
}

export function Container({
  className,
  size = "default",
  as: Component = "div",
  children,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    default: "max-w-[1200px]",
    form: "max-w-[560px]",
    reading: "max-w-[760px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 md:px-8", sizeStyles[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
