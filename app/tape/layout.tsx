import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real-Time Audit Tape — Nano Empire AI',
  description: 'Cryptographic immutable transaction tape of x402 payment settlements and signed receipts.',
  alternates: {
    canonical: '/tape',
  },
};

export default function TapeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
