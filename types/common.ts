/**
 * Common technical and utility types for Nityasādhanā.
 * Strictly no `any` — strong type-checking primitives.
 */

export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T, E = string> {
  status: AsyncStatus;
  data: Nullable<T>;
  error: Nullable<E>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export type Result<T, E = Error> =
  { success: true; data: T; error?: never } | { success: false; data?: never; error: E };

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export type ComponentSize = "sm" | "default" | "lg";

export type VariantColor =
  "primary" | "secondary" | "saffron" | "neutral" | "destructive" | "success";

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}
