import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turn Visitors into Clients | LeadGen Pro",
  description:
    "A professional landing page backed by a smart lead capture system. No CMS, no third-party forms — just results.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
