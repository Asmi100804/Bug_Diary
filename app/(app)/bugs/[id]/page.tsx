import { notFound } from "next/navigation";
import { getBugById } from "@/actions/bug-actions";
import { BugDetails } from "@/components/bugs/bug-details";

export default async function BugPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bugId = Number(id);
  if (!Number.isInteger(bugId)) notFound();

  const bug = await getBugById(bugId);
  if (!bug) notFound();

  return (
    <div className="px-6 py-8 md:px-10">
      <BugDetails bug={bug} />
    </div>
  );
}
