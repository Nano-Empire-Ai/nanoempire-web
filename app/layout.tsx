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
  title: "Nano Empire | Machine Economy API Gateway",
  description: "The API Gateway for the Autonomous Machine Economy. Pay-per-call x402 endpoints, Cerberus MAB routing, and instant Stripe AgentFi virtual cards.",
  keywords: ["AI Agents", "MCP", "x402", "Solana", "Base", "Machine Economy", "API Gateway", "Cerberus"],
  openGraph: {
    title: "Nano Empire AI",
    description: "The autonomous machine economy gateway. Execute API calls via stablecoin micropayments.",
    url: "https://nanoempireai.com",
    siteName: "Nano Empire AI",
    images: [
      {
        url: "https://nanoempireai.com/og.png",
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
