import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RecallGuard Hazard & Compliance Scanner — Nano Empire AI',
  description: 'Sub-50ms NHTSA & CPSC safety hazard detection and instant signed compliance certificates for automotive and product inventory.',
  alternates: {
    canonical: '/recall-report',
  },
};

export default function RecallReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
