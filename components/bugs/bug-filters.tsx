"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { SORT_OPTIONS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { TagWithCount, TechnologyWithCount } from "@/types/tag";

const ALL = "all";

export function BugFilters({
  tags,
  technologies,
}: {
  tags: TagWithCount[];
  technologies: TechnologyWithCount[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const debouncedQuery = useDebounce(query, 300);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== ALL) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  useEffect(() => {
    updateParam("query", debouncedQuery || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
  <div className="flex flex-col gap-3 border-b border-ink/10 pb-4 md:flex-row md:items-end">
    <Input
      placeholder="Search error messages, titles…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="font-mono text-sm md:max-w-xs"
      aria-label="Search bugs"
    />

    <div className="flex w-full flex-col gap-1.5 md:w-44">
      <label className="font-mono text-xs text-ink-soft">
        Technology
      </label>
      <Select
        value={searchParams.get("technology") ?? ALL}
        onValueChange={(v) => updateParam("technology", v)}
      >
        <SelectTrigger className="w-full font-mono text-sm">
          <SelectValue placeholder="Technology" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All technologies</SelectItem>
          {technologies.map((t) => (
            <SelectItem key={t.id} value={t.slug}>
              {t.name} ({t.bugCount})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex w-full flex-col gap-1.5 md:w-44">
      <label className="font-mono text-xs text-ink-soft">
        Tag
      </label>
      <Select
        value={searchParams.get("tag") ?? ALL}
        onValueChange={(v) => updateParam("tag", v)}
      >
        <SelectTrigger className="w-full font-mono text-sm">
          <SelectValue placeholder="Tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All tags</SelectItem>
          {tags.map((t) => (
            <SelectItem key={t.id} value={t.slug}>
              {t.name} ({t.bugCount})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex w-full flex-col gap-1.5 md:w-44">
      <label className="font-mono text-xs text-ink-soft">
        Difficulty
      </label>
      <Select
        value={searchParams.get("difficulty") ?? ALL}
        onValueChange={(v) => updateParam("difficulty", v)}
      >
        <SelectTrigger className="w-full font-mono text-sm">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any difficulty</SelectItem>
          {[1, 2, 3, 4, 5].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} — {DIFFICULTY_LABELS[n]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex w-full flex-col gap-1.5 md:w-44">
      <label className="font-mono text-xs text-ink-soft">
        Sort
      </label>
      <Select
        value={searchParams.get("sort") ?? "newest"}
        onValueChange={(v) => updateParam("sort", v)}
      >
        <SelectTrigger className="w-full font-mono text-sm">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);
}
