"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DifficultyRating } from "@/components/bugs/difficulty-rating";
import { TechnologyBadge } from "@/components/bugs/technology-badge";
import { BugAttempts } from "@/components/bugs/bug-attempts";
import { deleteBug } from "@/actions/bug-actions";
import { formatBugNumber, formatDate } from "@/lib/utils";
import type { BugWithRelations } from "@/types/bug";

export function BugDetails({ bug }: { bug: BugWithRelations }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBug(bug.id);
      if (!result.success) {
        toast.error(result.error ?? "Couldn't delete that bug.");
        return;
      }
      toast.success("Bug deleted.");
      router.push("/bugs");
      router.refresh();
    });
  }

  return (
    <article className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-ink-soft">
          {formatBugNumber(bug.bugNumber)}
        </span>
        <DifficultyRating value={bug.difficulty} size="md" />
      </div>

      <h1 className="mt-2 font-display text-3xl font-medium leading-tight">
        {bug.title}
      </h1>

      <p className="mt-2 font-mono text-xs text-ink-soft">
        logged {formatDate(bug.createdAt)} · updated {formatDate(bug.updatedAt)}
      </p>

      {(bug.technologies.length > 0 || bug.tags.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {bug.technologies.map((t) => (
            <TechnologyBadge key={`t-${t.id}`} name={t.name} slug={t.slug} kind="technology" />
          ))}
          {bug.tags.map((t) => (
            <TechnologyBadge key={`g-${t.id}`} name={t.name} slug={t.slug} kind="tag" />
          ))}
        </div>
      )}

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-mono text-xs text-ink-soft">Error / symptoms</h2>
          <pre className="mt-2 whitespace-pre-wrap border border-ink/15 bg-paper-dim px-4 py-3 font-mono text-sm">
            {bug.errorMessage}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-xs text-ink-soft">What I tried</h2>
          <div className="mt-2">
            <BugAttempts attempts={bug.attempts} />
          </div>
        </section>

        {bug.rootCause && (
          <section>
            <h2 className="font-mono text-xs text-slate">Root cause</h2>
            <p className="mt-2 text-sm text-ink">{bug.rootCause}</p>
          </section>
        )}

        {bug.solution && (
          <section>
            <h2 className="font-mono text-xs text-slate">Solution</h2>
            <p className="mt-2 text-sm text-ink">{bug.solution}</p>
          </section>
        )}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-ink/10 pt-5">
        <Button>
          <Link href={`/bugs/${bug.id}/edit`} className={buttonVariants({ variant: "default", size: "default" })}>Edit</Link>
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
              <Button variant="outline" className="border-red/40 text-red hover:bg-red-soft">
                Delete
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {formatBugNumber(bug.bugNumber)}?</DialogTitle>
              <DialogDescription>
                This removes the entry and everything logged under it — the
                error, attempts, root cause, and solution. This can&apos;t be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red text-paper hover:bg-red/90"
              >
                {isPending ? "Deleting…" : "Delete entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}
