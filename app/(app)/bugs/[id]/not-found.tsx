import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-6 py-16 text-center md:px-10">
      <p className="font-mono text-sm text-ink-soft">404</p>
      <h1 className="mt-2 font-display text-2xl font-medium">
        That entry doesn&apos;t exist
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        It may have been deleted, or the link is wrong.
      </p>
      <Link
        href="/bugs"
        className="mt-5 inline-block font-mono text-sm text-slate hover:underline"
      >
        Back to all bugs
      </Link>
    </div>
  );
}
