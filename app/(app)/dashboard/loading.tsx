export default function Loading() {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 h-8 w-32 animate-pulse bg-ink/10" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse border border-ink/10 bg-ink/5" />
        ))}
      </div>
      <div className="mt-10 h-64 animate-pulse bg-ink/5" />
    </div>
  );
}
