import { BugForm } from "@/components/bugs/bug-form";

export default function NewBugPage() {
  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="mb-6 font-display text-2xl font-medium">Log a new bug</h1>
      <BugForm mode="create" />
    </div>
  );
}
