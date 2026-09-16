import { BugListSkeleton } from "@/components/bugs/bug-list-skeleton";

export default function Loading() {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 h-8 w-24 animate-pulse bg-ink/10" />
      <div className="mb-6 h-10 w-full animate-pulse bg-ink/10" />
      <BugListSkeleton />
    </div>
  );
}
