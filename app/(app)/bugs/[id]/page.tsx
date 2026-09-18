import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getBugById } from "@/actions/bug-actions";
import { BugDetails } from "@/components/bugs/bug-details";
import { BugDetailSkeleton } from "@/components/bugs/bug-detail-skeleton";

export default async function BugPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bugId = Number(id);
  if (!Number.isInteger(bugId)) notFound();

  return (
    <div className="px-6 py-8 md:px-10">
      <Suspense fallback={<BugDetailSkeleton />}>
        <BugContent bugId={bugId} />
      </Suspense>
    </div>
  );
}

async function BugContent({ bugId }: { bugId: number }) {
  const bug = await getBugById(bugId);
  if (!bug) notFound();
  return <BugDetails bug={bug} />;
}
