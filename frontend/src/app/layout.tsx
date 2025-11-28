import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TealScan - Mutual Fund X-Ray Tool",
  description: "Discover hidden commissions in your mutual fund portfolio. Audit your investments in 30 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
