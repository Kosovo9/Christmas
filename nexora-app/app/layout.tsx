import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Christmas Studio | 10x Your Holiday Photos",
  description: "The world's first AI Christmas Studio with Voice Director. Create magical, moving holiday memories in seconds.",
};

import { ClerkProvider } from "@clerk/nextjs";
import AIHelpDesk from "./components/AIHelpDesk";

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <AIHelpDesk />
        </body>
      </html>
    </ClerkProvider>
  );
}
