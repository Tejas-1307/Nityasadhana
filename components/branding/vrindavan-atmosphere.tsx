import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface VrindavanAtmosphereProps extends React.HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

/**
 * Subtle Ambient Vrindavan / Gurukul background atmosphere.
 * Designed with restrained opacity (2-4%) so it gives a warm tactile feel
 * without distracting from daily Sadhana entries.
 */
export function VrindavanAtmosphere({
  className,
  subtle = true,
  ...props
}: VrindavanAtmosphereProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0 select-none overflow-hidden", className)}
      {...props}
    >
      {/* Soft warm gradient glow in corners */}
      <div className="absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[#E8D9BF]/40 blur-[120px]" />
      <div className="absolute -right-[15%] top-[30%] h-[600px] w-[600px] rounded-full bg-[#2457A6]/[0.025] blur-[140px]" />
      <div className="absolute -bottom-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-[#D9822B]/[0.03] blur-[130px]" />

      {/* Ultra-subtle Kadamba leaf & Vrindavan sacred grove silhouette outlines */}
      <svg
        className={cn(
          "absolute bottom-0 right-0 h-[380px] w-[380px] sm:h-[500px] sm:w-[500px]",
          subtle ? "opacity-[0.035]" : "opacity-[0.06]"
        )}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Kadamba Branch Arc */}
        <path
          d="M400 400C300 350 200 280 150 150C120 70 80 20 0 0"
          stroke="#20201D"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Kadamba Foliage cluster */}
        <circle cx="280" cy="260" r="45" stroke="#3D765B" strokeWidth="1" />
        <circle cx="330" cy="220" r="55" stroke="#167D8D" strokeWidth="1" />
        <circle cx="240" cy="190" r="35" stroke="#3D765B" strokeWidth="1" />
        <circle cx="310" cy="140" r="40" stroke="#D9822B" strokeWidth="1" />
        {/* Sacred Feather Arc */}
        <path d="M200 320Q260 220 360 200" stroke="#2457A6" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
