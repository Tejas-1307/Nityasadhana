/**
 * Navigation & Route type architecture.
 */

export interface NavItem {
  readonly title: string;
  readonly href: string;
  readonly iconName: string;
  readonly sanskritLabel?: string;
  readonly badge?: string;
  readonly exact?: boolean;
}

export interface NavSection {
  readonly title?: string;
  readonly sanskritTitle?: string;
  readonly items: readonly NavItem[];
}

export type RouteGroup = "public" | "auth" | "student" | "guru";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly active?: boolean;
}
