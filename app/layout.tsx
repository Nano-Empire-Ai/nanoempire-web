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
  title: "Nano Empire AI | Compliance Reports, Recall Screening & AI Security Audits",
  description:
    "Deterministic US & Canadian product recall screening (46,642 CPSC, FDA & Health Canada records), Zero-PHI clinic equipment binders, 19-column federal RFP compliance matrices, and 4-hour AI/Next.js/Stripe security audits.",
  keywords: [
    "Product Recall Screening",
    "CPSC eFiling Compliance",
    "Health Canada Recalls",
    "Healthcare Equipment Recall Binder",
    "Federal RFP Compliance Matrix",
    "AI Security Audit",
    "MCP Server Security",
    "Stripe Webhook Audit",
    "Nano Empire AI",
  ],
  openGraph: {
    title: "Nano Empire AI — Deterministic Compliance & AI Security Audits ($30–$750)",
    description:
      "Flat-price recall reports ($30), federal RFP matrices ($299), Zero-PHI clinic binders ($499), and 4-hour AI/Next.js/Stripe pre-launch security audits ($750). Built for humans and AI agents (MCP / x402).",
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
        <link rel="mcp-server" href="/.well-known/mcp.json" type="application/json" />
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
