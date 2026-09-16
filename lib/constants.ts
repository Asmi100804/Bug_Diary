import { SquareText, LayoutDashboard, Tags } from "lucide-react";
export const APP_NAME = "Bug Diary";

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Trivial",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Brutal",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Bugs", href: "/bugs", icon: SquareText },
  { label: "Tags", href: "/tags", icon: Tags },
] as const;

export const BUGS_PER_PAGE = 20;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "difficulty-desc", label: "Hardest first" },
  { value: "difficulty-asc", label: "Easiest first" },
] as const;
