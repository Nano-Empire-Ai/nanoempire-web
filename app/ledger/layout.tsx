import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cryptographic Yield & Settlement Ledger — Nano Empire AI',
  description: 'Dual-tier public settlement feed: Live B2B cryptographic settlements and verifiable system uptime proofs.',
  alternates: {
    canonical: '/ledger',
  },
};

export default function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
