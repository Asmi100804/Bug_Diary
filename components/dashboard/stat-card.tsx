export function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="border border-ink/15 px-4 py-4 bg-amber-50">
      <p className="font-mono text-xs text-ink-soft">{label}</p>
      <p className="mt-1.5 font-display text-3xl font-medium">
        {value}
        {suffix && <span className="ml-1 font-mono text-sm text-ink-soft">{suffix}</span>}
      </p>
    </div>
  );
}
