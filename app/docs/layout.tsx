import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API & Protocol Documentation — Nano Empire AI',
  description: 'Interactive documentation for x402 payment rails, Cerberus routing, and autonomous agent endpoints.',
  alternates: {
    canonical: '/docs',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
