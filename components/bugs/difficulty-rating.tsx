"use client";

import { DIFFICULTY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DifficultyRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

/** Read-only display: five ticks, filled up to the difficulty. */
export function DifficultyRating({ value, size = "sm" }: DifficultyRatingProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={`Difficulty: ${DIFFICULTY_LABELS[value] ?? value} (${value}/5)`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              size === "sm" ? "h-2.5 w-1" : "h-3.5 w-1.5",
              n <= value ? "bg-red" : "bg-ink/15"
            )}
          />
        ))}
      </span>
      <span className="font-mono text-xs text-ink-soft">
        {DIFFICULTY_LABELS[value] ?? value}
      </span>
    </span>
  );
}

/** Interactive selector used inside the bug form. */
export function DifficultyPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Difficulty"
      className="flex items-center gap-1.5"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-sm border font-mono text-sm transition-colors",
            n <= value
              ? "border-red bg-red text-paper"
              : "border-ink/20 text-ink-soft hover:border-ink/40"
          )}
        >
          {n}
        </button>
      ))}
      <span className="ml-2 font-mono text-xs text-ink-soft">
        {DIFFICULTY_LABELS[value]}
      </span>
    </div>
  );
}
