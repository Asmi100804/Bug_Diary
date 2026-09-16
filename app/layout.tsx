import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const geist = Geist({
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bug Diary — a debugging log that remembers for you",
  description:
    "Record how you solved the bug, so you never debug the same problem twice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
        <body>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
