import { cn } from "@/lib/utils";
import type { Attempt } from "@/types/bug";

export function BugAttempts({ attempts }: { attempts: Attempt[] }) {
  if (attempts.length === 0) {
    return (
      <p className="font-mono text-sm text-ink-soft">
        No attempts logged before landing on the fix.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {attempts.map((attempt, i) => (
        <li key={attempt.id} className="flex gap-3">
          <span className="mt-0.5 font-mono text-xs text-ink-soft">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p
            className={cn(
              "text-sm",
              attempt.worked
                ? "text-ink"
                : "text-ink-soft line-through decoration-2 decoration-red/50"
            )}
          >
            {attempt.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
