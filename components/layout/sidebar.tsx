"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden bg-amber-50 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:justify-between md:border-r md:border-ink/10 md:px-5 md:py-6">
      <div>
        <Link href="/dashboard" className="mt-3 mb-6 flex items-center gap-2"
        >
          <img src="/bug.svg" alt="" className="h-6 w-6"/>

          <span className="font-display text-xl font-medium tracking-tight">
            {APP_NAME}
          </span>
        </Link>
        <nav
          className="flex flex-col gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 font-mono text-sm transition-colors",
                  "hover:bg-ink/5",
                  active
                    ? "bg-ink text-paper hover:bg-ink"
                    : "text-ink-soft"
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 border-t border-ink/10 pt-4">
        <UserButton />
        <span className="text-ink-soft text-xs">Account</span>
      </div>
    </aside>
  );
}
