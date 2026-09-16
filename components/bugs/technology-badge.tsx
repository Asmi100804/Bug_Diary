import Link from "next/link";
import { cn } from "@/lib/utils";

interface TechnologyBadgeProps {
  name: string;
  slug: string;
  kind?: "tag" | "technology";
  href?: string;
}

export function TechnologyBadge({
  name,
  slug,
  kind = "tag",
  href,
}: TechnologyBadgeProps) {
  return (
    <Link
      href={href ?? `/tags/${slug}`}
      className={cn(
        "inline-flex rounded-sm border px-2 py-0.5 font-mono text-xs transition-colors",
        kind === "technology"
          ? "border-slate/30 text-slate hover:bg-slate-soft"
          : "border-lime-400 text-lime-700 hover:bg-lime-100/75"
      )}
    >
      {name}
    </Link>
  );
}
