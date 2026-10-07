import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Browser Extension — Nano Empire AI',
  description: 'Browser extension interface for managing agent wallets, x402 allowances, and API tollbooths.',
  alternates: {
    canonical: '/extension',
  },
};

export default function ExtensionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
