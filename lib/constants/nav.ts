export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  sanskritLabel?: string;
  badge?: string;
}

export const STUDENT_NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    href: "/student",
    iconName: "Home",
    sanskritLabel: "अद्य",
  },
  {
    title: "Journey",
    href: "/student/journey",
    iconName: "Compass",
    sanskritLabel: "साधना",
  },
  {
    title: "Report",
    href: "/student/report",
    iconName: "ClipboardCheck",
    sanskritLabel: "प्रतिवेदन",
  },
  {
    title: "Profile",
    href: "/student/profile",
    iconName: "User",
    sanskritLabel: "परिचय",
  },
];

export const GURU_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/guru",
    iconName: "LayoutDashboard",
    sanskritLabel: "अवलोकन",
  },
  {
    title: "Shishyas",
    href: "/guru/shishyas",
    iconName: "Users",
    sanskritLabel: "शिष्याः",
  },
  {
    title: "Guidance",
    href: "/guru/guidance",
    iconName: "BookOpen",
    sanskritLabel: "मार्गदर्शन",
  },
  {
    title: "Profile",
    href: "/guru/profile",
    iconName: "User",
    sanskritLabel: "परिचय",
  },
];
