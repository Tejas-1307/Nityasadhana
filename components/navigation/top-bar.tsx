import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/branding/logo";
import { Container } from "@/components/layout/container";

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function TopBar({ className, rightAction, transparent = false, ...props }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-200",
        transparent
          ? "bg-[#EAF7F4]/80 backdrop-blur-md"
          : "border-b border-[rgba(63,148,149,0.14)] bg-[#EAF7F4]/95 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <Container size="default">
        <div className="flex h-16 items-center justify-between">
          <Logo size="default" />
          {rightAction ? <div className="flex items-center gap-3">{rightAction}</div> : null}
        </div>
      </Container>
    </header>
  );
}
