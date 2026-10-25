import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <a href="/" className="text-xs font-mono text-[#00B5E2] hover:underline">← Back to Nano Empire AI</a>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono uppercase mt-4">Terms of Service &amp; Data License</h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-2">Effective Date: October 25, 2026 · Version 1.4</p>
        </div>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">1. Scope of Services</h2>
          <p>
            Nano Empire AI Inc. (&quot;Nano Empire&quot;) provides machine-payable product recall data APIs (RecallGuard via HTTP 402 on Base), self-serve inventory compliance reports (RecallRadar via Stripe), adversarial MCP verification manifests (SkillProof), and deterministic solicitation/claim audit reports (BidShield &amp; ClaimShield).
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">2. Data Provenance &amp; Sovereign License ($2,400/yr)</h2>
          <p>
            Underlying federal recall records originate from public-domain U.S. CPSC, U.S. FDA, NHTSA, Health Canada, and Transport Canada enforcement disclosures. Nano Empire&apos;s proprietary normalization, GTIN/UPC cross-walking, severity scoring, and cryptographic SHA-256/Ed25519 attestation wrappers are licensed per seat or per enterprise entity. Sovereign Data License holders receive commercial catalog vetting rights and daily delta feeds.
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">3. No Legal or Medical Advice &amp; Liability Cap</h2>
          <p>
            All RecallRadar, SkillProof, BidShield, and ClaimShield outputs are deterministic engineering and regulatory triage artifacts. They do not constitute formal legal representation or medical advice. Every citation is bound to a verbatim source span and SHA-256 document hash so human operators can verify primary sources before filing or shipping. Total cumulative liability under any tier is strictly capped at the fees paid by the customer in the preceding twelve (12) months.
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">4. Service Level Agreement (SLA) &amp; x402 Finality</h2>
          <p>
            Onchain x402 settlements on Base Mainnet are final upon block confirmation. If a paid API call fails due to a server-side 5xx error after valid x402 payment header submission, Nano Empire issues 10x replacement execution credits upon presentation of the transaction hash to <a href="mailto:rob@nanoempireai.com" className="text-[#00B5E2] hover:underline">rob@nanoempireai.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
