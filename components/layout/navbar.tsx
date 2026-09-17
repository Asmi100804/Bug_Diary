import { UserButton } from "@clerk/nextjs";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="flex bg-amber-50 items-center justify-between border-b border-ink/10 px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <img
          src="/bug.svg"
          alt={`${APP_NAME} logo`}
          className="h-6 w-6 shrink-0"
        />
        <span className="font-display text-lg font-medium leading-none">
          {APP_NAME}
        </span>
      </div>
      <UserButton />
    </header>
  );
}
