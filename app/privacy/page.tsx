import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <a href="/" className="text-xs font-mono text-[#00B5E2] hover:underline">← Back to Nano Empire AI</a>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono uppercase mt-4">Privacy &amp; Zero-Egress Data Policy</h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-2">Effective Date: October 25, 2026 · PIPEDA / GDPR / HIPAA Safe-Harbor Aligned</p>
        </div>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">1. Client-Side &amp; Zero-Retention Architecture</h2>
          <p>
            BidShield Free Triage executes locally in your browser without uploading proprietary tender documents. For server-side RecallRadar CSV scans and ClaimShield EOB audits, uploaded files are processed in ephemeral memory to compute SHA-256 witness hashes and compliance matches, and are never used to train foundation models.
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">2. PHI / PII Redaction Guarantee</h2>
          <p>
            Our ingestion kernel automatically strips and masks Protected Health Information (PHI) and Personally Identifiable Information (SSN, SIN, DOB, patient identifiers, phone numbers, email addresses) prior to generating external diagnostic reports.
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">3. Payment &amp; Onchain Telemetry</h2>
          <p>
            Fiat payments are processed directly by Stripe, Inc.; Nano Empire never stores raw payment card numbers. Machine-to-machine x402 settlements on Base Mainnet record public wallet addresses and transaction hashes on the public blockchain ledger by protocol design.
          </p>
        </section>

        <section className="space-y-3 text-sm text-[#8C92A4] leading-relaxed">
          <h2 className="text-lg font-bold text-white font-mono uppercase">4. Contact &amp; Data Deletion Requests</h2>
          <p>
            For data deletion, security disclosures, or enterprise DPA inquiries, contact <a href="mailto:rob@nanoempireai.com" className="text-[#00B5E2] hover:underline">rob@nanoempireai.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
