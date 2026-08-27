"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  spiritualName?: string;
  size?: "sm" | "default" | "lg";
}

export function Avatar({
  className,
  src,
  alt,
  name,
  spiritualName,
  size = "default",
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const getInitials = (displayName?: string) => {
    if (!displayName) return "";
    const parts = displayName.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = spiritualName || name;
  const initials = getInitials(displayName);

  const sizeStyles = {
    sm: "h-9 w-9 min-h-[36px] min-w-[36px] text-xs",
    default: "h-11 w-11 min-h-[44px] min-w-[44px] text-sm",
    lg: "h-14 w-14 min-h-[56px] min-w-[56px] text-base",
  };

  return (
    <div
      className={cn(
        "relative inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-[rgba(32,32,29,0.10)] bg-[#E8D9BF] font-semibold text-[#20201D]",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || displayName || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : initials ? (
        <span className="font-medium text-[#20201D]">{initials}</span>
      ) : (
        <User className="h-5 w-5 text-[#66635D]" />
      )}
    </div>
  );
}
