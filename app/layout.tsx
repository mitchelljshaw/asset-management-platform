import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import "./globals.css";

export const metadata: Metadata = { // Metadata for pages
  title: "Asset Manager",
  description: "Internal IT asset tracking for laptops, monitors, phones, and more.",
};

export default function RootLayout({ // Main page layout
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans antialiased">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
