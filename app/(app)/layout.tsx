import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="relative flex-1 overflow-y-auto pb-16 md:pb-0 bg-no-repeat bg-cover bg-center"
  style={{ backgroundImage: "url('/bg-bugs.svg')" }}>{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
