import { notFound } from "next/navigation";
import { getBugById } from "@/actions/bug-actions";
import { formatBugNumber} from "@/lib/utils";
import { BugForm } from "@/components/bugs/bug-form";

export default async function EditBugPage({
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
      <h1 className="mb-6 font-display text-2xl font-medium">
        Edit {formatBugNumber(bug.bugNumber)}
      </h1>
      <BugForm mode="edit" bug={bug} />
    </div>
  );
}
