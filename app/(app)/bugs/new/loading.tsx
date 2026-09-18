import { BugFormSkeleton } from "@/components/bugs/bug-form-skeleton";

export default function Loading() {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 h-8 w-48 animate-pulse bg-ink/10" />
      <BugFormSkeleton />
    </div>
  );
}