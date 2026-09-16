import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ExampleBug } from "@/components/landing/example-bug";
import { MotionProvider } from "@/components/landing/motion-provider";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <MotionProvider>
      <main>
        <Hero />
        <Features />
        <ExampleBug />
      </main>
    </MotionProvider>
  );
}
