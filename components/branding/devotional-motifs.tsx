import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface MotifProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Sacred Lotus Motif
 * Symbol of purity, devotion, and daily awakening in Sādhanā.
 */
export function LotusMotif({ size = 32, className, ...props }: MotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("inline-block select-none", className)}
      {...props}
    >
      {/* Central Petal */}
      <path
        d="M24 6C24 6 18 18 18 28C18 34.6274 20.6863 38 24 38C27.3137 38 30 34.6274 30 28C30 18 24 6 24 6Z"
        fill="#2457A6"
        fillOpacity="0.12"
        stroke="#2457A6"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Left Petal */}
      <path
        d="M19 14C19 14 10 22 10 30C10 35.5228 14.4772 38 18 38C20 38 22 36 22 36"
        fill="#D9822B"
        fillOpacity="0.08"
        stroke="#D9822B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right Petal */}
      <path
        d="M29 14C29 14 38 22 38 30C38 35.5228 33.5228 38 30 38C28 38 26 36 26 36"
        fill="#D9822B"
        fillOpacity="0.08"
        stroke="#D9822B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Base Pedestal Line */}
      <path
        d="M12 41C16 43 32 43 36 41"
        stroke="#66635D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sacred Flute & Peacock Feather Motif
 * Symbol of Shri Krishna's divine melody and guidance.
 */
export function FluteMotif({ size = 36, className, ...props }: MotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("inline-block select-none", className)}
      {...props}
    >
      {/* Gentle angled flute */}
      <path
        d="M12 48L52 16"
        stroke="#D9822B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Flute Holes */}
      <circle cx="28" cy="35" r="1.5" fill="#20201D" />
      <circle cx="34" cy="30.5" r="1.5" fill="#20201D" />
      <circle cx="40" cy="25.5" r="1.5" fill="#20201D" />
      <circle cx="46" cy="20.5" r="1.5" fill="#20201D" />

      {/* Peacock Feather attached gracefully */}
      <path
        d="M48 19C52 12 56 10 58 12C60 14 58 18 51 22"
        fill="#2457A6"
        fillOpacity="0.15"
        stroke="#2457A6"
        strokeWidth="1.5"
      />
      <ellipse cx="55" cy="14" rx="2" ry="3" fill="#D9822B" transform="rotate(-30 55 14)" />
    </svg>
  );
}

export interface ShriKrishnaArtProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

/**
 * Editorial Shri Krishna Art Illustration (Classical Indian Line Work + Editorial Glow)
 * Dignified, sacred, peaceful posture with flute and peacock feather.
 */
export function ShriKrishnaEditorialArt({
  size = 120,
  className,
  ...props
}: ShriKrishnaArtProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Soft warm Vrindavan sunrise halo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(217,130,43,0.15)_0%,rgba(36,87,166,0.06)_50%,rgba(247,241,229,0)_75%)] blur-md" />

      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Sacred Aureole / Halo Ring */}
        <circle cx="60" cy="58" r="46" stroke="#E8D9BF" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="60" cy="58" r="42" stroke="#D9822B" strokeWidth="0.75" strokeOpacity="0.4" />

        {/* Serene Crown Silhouette & Peacock Feather */}
        <path
          d="M58 24C62 14 68 12 71 15C74 18 72 23 63 28Z"
          fill="#2457A6"
          fillOpacity="0.2"
          stroke="#2457A6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="67" cy="18" rx="2.5" ry="4" fill="#D9822B" transform="rotate(-25 67 18)" />

        {/* Mukut / Crown Profile */}
        <path
          d="M54 36L60 27L66 36H54Z"
          fill="#D9822B"
          fillOpacity="0.3"
          stroke="#D9822B"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* Divine Serene Facial Profile & Tilak */}
        <path
          d="M60 36V45C60 48 57 51 54 53"
          stroke="#2457A6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Tilak */}
        <path d="M59 34V39" stroke="#D9822B" strokeWidth="1.5" strokeLinecap="round" />

        {/* Divine Flute Posture (Venu) */}
        <path
          d="M40 68L80 44"
          stroke="#D9822B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Flute Ornaments */}
        <circle cx="56" cy="58" r="1.5" fill="#20201D" />
        <circle cx="63" cy="54" r="1.5" fill="#20201D" />
        <circle cx="70" cy="50" r="1.5" fill="#20201D" />

        {/* Gentle Sacred Lotus Bloom at the Base */}
        <path
          d="M60 88C60 88 53 96 53 103C53 107 56 109 60 109C64 109 67 107 67 103C67 96 60 88 60 88Z"
          fill="#2457A6"
          fillOpacity="0.15"
          stroke="#2457A6"
          strokeWidth="1.25"
        />
        <path
          d="M54 94C54 94 46 100 46 105C46 108 49 109 52 109C54 109 56 107 56 107"
          stroke="#D9822B"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M66 94C66 94 74 100 74 105C74 108 71 109 68 109C66 109 64 107 64 107"
          stroke="#D9822B"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
