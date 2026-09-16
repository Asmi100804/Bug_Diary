"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DifficultyPicker } from "@/components/bugs/difficulty-rating";
import { createBug, updateBug } from "@/actions/bug-actions";
import { cn } from "@/lib/utils";
import type { BugWithRelations } from "@/types/bug";
import { Check } from "lucide-react";

interface BugFormProps {
  mode: "create" | "edit";
  bug?: BugWithRelations;
}

interface AttemptDraft {
  key: string;
  description: string;
  worked: boolean;
}

function ChipInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div>
      <Label className="font-mono text-xs text-ink-soft">{label}</Label>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-sm border border-ink/20 px-2 py-1.5 focus-within:border-ink/40">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 rounded-sm border border-ink/20 px-2 py-0.5 font-mono text-xs text-ink-soft"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              aria-label={`Remove ${v}`}
              className="text-ink-soft hover:text-red"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-24 flex-1 bg-transparent py-0.5 font-mono text-sm outline-none"
        />
      </div>
    </div>
  );
}

export function BugForm({ mode, bug }: BugFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(bug?.title ?? "");
  const [errorMessage, setErrorMessage] = useState(bug?.errorMessage ?? "");
  const [rootCause, setRootCause] = useState(bug?.rootCause ?? "");
  const [solution, setSolution] = useState(bug?.solution ?? "");
  const [difficulty, setDifficulty] = useState(bug?.difficulty ?? 3);
  const [tags, setTags] = useState<string[]>(bug?.tags.map((t) => t.name) ?? []);
  const [technologies, setTechnologies] = useState<string[]>(
    bug?.technologies.map((t) => t.name) ?? []
  );
  const [attempts, setAttempts] = useState<AttemptDraft[]>(
    bug?.attempts.map((a) => ({
      key: String(a.id),
      description: a.description,
      worked: Boolean(a.worked),
    })) ?? []
  );

  function addAttempt() {
    setAttempts((prev) => [
      ...prev,
      { key: crypto.randomUUID(), description: "", worked: false },
    ]);
  }

  function updateAttempt(key: string, patch: Partial<AttemptDraft>) {
    setAttempts((prev) => prev.map((a) => (a.key === key ? { ...a, ...patch } : a)));
  }

  function removeAttempt(key: string) {
    setAttempts((prev) => prev.filter((a) => a.key !== key));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const values = {
      title,
      errorMessage,
      rootCause,
      solution,
      difficulty,
      tags,
      technologies,
      attempts: attempts
        .filter((a) => a.description.trim().length > 0)
        .map((a) => ({ description: a.description, worked: a.worked })),
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBug(values)
          : await updateBug(bug!.id, values);

      if (!result.success) {
        setError(result.error ?? "Something went wrong. Try again.");
        return;
      }

      toast.success(mode === "create" ? "Bug logged." : "Bug updated.");
      router.push(`/bugs/${result.bugId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p
          role="alert"
          className="border border-red/30 bg-red-soft px-3 py-2 font-mono text-sm text-red"
        >
          {error}
        </p>
      )}

      <div>
        <Label htmlFor="title" className="font-mono text-xs text-ink-soft">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Stale data after optimistic update rollback"
          required
          minLength={3}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="errorMessage" className="font-mono text-xs text-ink-soft">
          Error / symptoms
        </Label>
        <Textarea
          id="errorMessage"
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          placeholder="Paste the stack trace or describe exactly what you saw."
          required
          rows={4}
          className="mt-1.5 font-mono text-sm"
        />
      </div>

      <div>
        <Label className="font-mono text-xs text-ink-soft">Difficulty</Label>
        <div className="mt-1.5">
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChipInput
          label="Technologies"
          placeholder="Next.js, Postgres…"
          values={technologies}
          onChange={setTechnologies}
        />
        <ChipInput
          label="Tags"
          placeholder="race-condition, off-by-one…"
          values={tags}
          onChange={setTags}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="font-mono text-xs text-ink-soft">What I tried</Label>
          <button
            type="button"
            onClick={addAttempt}
            className="font-mono text-xs text-slate hover:underline"
          >
            + add attempt
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {attempts.length === 0 && (
            <p className="font-mono text-xs text-ink-soft">
              Nothing logged yet — add each thing you tried, in order.
            </p>
          )}
          {attempts.map((attempt) => (
            <div key={attempt.key} className="flex items-start gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={attempt.worked}
                aria-label="This attempt worked"
                onClick={() =>
                  updateAttempt(attempt.key, { worked: !attempt.worked })
                }
                className={cn(
                  "mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                  attempt.worked
                    ? "border-slate bg-slate text-white"
                    : "border-ink/30"
                )}
              >
                {attempt.worked && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
              <Textarea
                value={attempt.description}
                onChange={(e) => updateAttempt(attempt.key, { description: e.target.value })}
                placeholder="What did you try?"
                rows={2}
                className="flex-1 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => removeAttempt(attempt.key)}
                aria-label="Remove attempt"
                className="mt-1.5 text-ink-soft hover:text-red"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="rootCause" className="font-mono text-xs text-ink-soft">
          Root cause
        </Label>
        <Textarea
          id="rootCause"
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          placeholder="Why did this actually happen?"
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="solution" className="font-mono text-xs text-ink-soft">
          Solution
        </Label>
        <Textarea
          id="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="The exact fix."
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : mode === "create" ? "Save entry" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
