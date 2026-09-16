export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 md:px-10">
      <div className="h-4 w-16 animate-pulse bg-ink/10" />
      <div className="mt-3 h-8 w-2/3 animate-pulse bg-ink/10" />
      <div className="mt-6 h-24 w-full animate-pulse bg-ink/10" />
      <div className="mt-4 h-24 w-full animate-pulse bg-ink/10" />
    </div>
  );
}
