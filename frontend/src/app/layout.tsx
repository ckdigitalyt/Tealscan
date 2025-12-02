import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TealScan | Stop Losing 1% Wealth to Hidden Fees",
  description: "Free Mutual Fund X-Ray Tool. Analyze your portfolio in seconds. Find hidden charges, overlaps, and tax optimization opportunities. 100% privacy-guaranteed - your data never leaves your browser.",
  keywords: "mutual fund analyzer, portfolio analyzer, CAMS statement, direct vs regular, expense ratio calculator, CAS analyzer, Karvy statement, hidden fees, mutual fund charges",
  openGraph: {
    title: "TealScan - Free Mutual Fund Portfolio Analyzer",
    description: "Stop losing lakhs to hidden charges. Privacy-first portfolio analysis - your data never leaves your browser.",
    type: "website",
    siteName: "TealScan",
  },
  twitter: {
    card: "summary_large_image",
    title: "TealScan - Free Mutual Fund Portfolio Analyzer",
    description: "Stop losing lakhs to hidden charges. Privacy-first portfolio analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
