import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Raize Stream — Watch Anime. Rise Higher.",
  description:
    "Dark, cinematic, and energetic premium anime streaming platform.",
  openGraph: {
    title: "Raize Stream — Watch Anime. Rise Higher.",
    description:
      "Dark, cinematic, and energetic premium anime streaming platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-midnight text-white antialiased flex flex-col min-h-screen font-inter"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
