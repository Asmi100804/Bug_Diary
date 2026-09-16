import { auth } from "@clerk/nextjs/server";

export default async function BugsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return <>{children}</>;
}
