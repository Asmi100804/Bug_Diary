import Link from "next/link";
import { notFound } from "next/navigation";
import { getBugsBySlug } from "@/actions/tag-actions";
import { BugList } from "@/components/bugs/bug-list";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  const result = await getBugsBySlug(slug);

  if (!result.kind) notFound();

  return (
    <div className="px-6 py-8 md:px-10">
      <Link href="/tags" className="font-mono text-xs text-ink-soft hover:underline">
        ← all tags
      </Link>
      <h1 className="mb-6 mt-2 font-display text-2xl font-medium">
        {result.name}
      </h1>
      <BugList bugs={result.bugs} hasActiveFilters />
    </div>
  );
}
