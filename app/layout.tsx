import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nanoempireai.com"),
  alternates: {
    canonical: "/",
  },
  title: "Nano Empire AI | Product Recall Screening & Federal RFP Compliance",
  description:
    "Automated US & Canadian product recall screening across 46,642 CPSC, FDA, and Health Canada records, inspection-ready facility equipment recall binders, and 19-column federal RFP compliance matrices.",
  keywords: [
    "Product Recall Screening",
    "CPSC Recall Check",
    "Health Canada Recalls",
    "FDA Medical Device Recalls",
    "Healthcare Equipment Recall Binder",
    "Federal RFP Compliance Matrix",
    "CanadaBuys BidShield",
    "Nano Empire AI",
  ],
  openGraph: {
    title: "Nano Empire AI — Product Recall Screening & Federal RFP Compliance",
    description:
      "Search 46,642 CPSC, FDA, and Health Canada recalls free, order a $30 signed inventory report, or get audit-ready healthcare equipment binders and federal RFP compliance matrices in under 24 hours.",
    url: "https://www.nanoempireai.com",
    siteName: "Nano Empire AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
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
        {/* Machine-First Discovery Links */}
        <link rel="agent-card" href="/.well-known/agent-card.json" type="application/json" />
        <link rel="llms-context" href="/llms.txt" type="text/plain" />
        <link rel="openapi" href="/openapi.json" type="application/json" />
        <meta name="nano-empire-gateway" content="v1.0.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#07090D] text-[#F4F1EA]`}>
        {children}
      </body>
    </html>
  );
}
