import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shield, AlertTriangle, ArrowLeft, ExternalLink, Check, FileCode } from 'lucide-react';
import preauditsData from '@/public/skillproof/preaudits.json';

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateStaticParams() {
  const audits = preauditsData?.audits || [];
  return audits.map((a: any) => {
    const parts = a.repo.split('/');
    return {
      owner: parts[0],
      repo: parts[1] || '',
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`.toLowerCase();
  const audits = preauditsData?.audits || [];
  const audit = audits.find((a: any) => a.repo.toLowerCase() === fullName);

  if (!audit) {
    return {
      title: 'SkillProof Audit Not Found',
    };
  }

  return {
    title: `${audit.repo} (${audit.skillproof_score}/100) — SkillProof Static Pre-Audit Scorecard`,
    description: `Automated zero-clone static pre-audit for ${audit.repo}. Pre-Audit ID: ${audit.preaudit_id}, Tree SHA: ${audit.tree_sha}. Score: ${audit.skillproof_score}/100.`,
    alternates: {
      canonical: `/skillproof/repo/${owner}/${repo}`,
    },
  };
}

export default async function RepoAuditDetailPage({ params }: Props) {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`.toLowerCase();
  const audits = preauditsData?.audits || [];
  const audit = audits.find((a: any) => a.repo.toLowerCase() === fullName);

  if (!audit) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: audit.repo,
    applicationCategory: 'SecuritySoftware',
    operatingSystem: 'Cross-platform',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: audit.skillproof_score,
      bestRating: '100',
      worstRating: '0',
      ratingCount: '1',
    },
  };

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link
            href="/skillproof"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8C92A4] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to SkillProof Index
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
          <Shield size={14} /> SKILLPROOF CRYPTOGRAPHIC AUDIT RECORD
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-mono flex items-center gap-3">
              {audit.repo}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8C92A4] mt-3">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#F4F1EA]">
                ★ {audit.stars.toLocaleString()}
              </span>
              <span>Commit SHA: {audit.tree_sha}</span>
              <span>·</span>
              <span>{audit.total_files_in_repo.toLocaleString()} files</span>
              <span>·</span>
              <span>License: {audit.license}</span>
              <span>·</span>
              <span className="border border-[#00B5E2]/40 text-[#00B5E2] px-2 py-0.5 rounded">
                {audit.preaudit_id}
              </span>
            </div>
          </div>

          <div className="text-left md:text-right bg-black/40 border border-white/10 p-5 rounded-xl">
            <span className="text-xs font-mono text-[#8C92A4] block">PRE-AUDIT SCORE</span>
            <span className="text-4xl font-extrabold font-mono text-[#A3FF00]">
              {audit.skillproof_score}/100
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-6">
            {/* Section 1: Governance */}
            <div className="rounded-xl border border-[#8C92A4]/20 bg-[#0f1423]/90 p-6">
              <h2 className="text-sm font-mono uppercase text-[#00B5E2] font-bold mb-4 flex items-center gap-2">
                <FileCode size={16} /> Governance &amp; Supply-Chain Hygiene
              </h2>
              {audit.governance_gaps && audit.governance_gaps.length > 0 ? (
                <div className="space-y-2">
                  {audit.governance_gaps.map((g: string, idx: number) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-[#FF7B00] bg-[#FF7B00]/10 border border-[#FF7B00]/30 px-3 py-2 rounded flex items-center gap-2"
                    >
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[#A3FF00]">
                  ✓ Full repository governance hygiene verified (SECURITY.md, lockfile, test suites present).
                </p>
              )}
            </div>

            {/* Section 2: Code Surface Scan */}
            <div className="rounded-xl border border-[#8C92A4]/20 bg-[#0f1423]/90 p-6">
              <h2 className="text-sm font-mono uppercase text-[#00B5E2] font-bold mb-4 flex items-center gap-2">
                <Shield size={16} /> Sampled Static Entrypoints &amp; Findings
              </h2>
              <div className="text-xs font-mono text-[#8C92A4] mb-4">
                Sampled Entrypoints: {audit.sampled_source_files?.join(', ') || 'N/A'}
              </div>

              {audit.code_surface_findings && audit.code_surface_findings.length > 0 ? (
                <div className="space-y-2">
                  {audit.code_surface_findings.map((fn: any, idx: number) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-[#8C92A4] bg-black/60 p-3 rounded border border-white/5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#FF7B00] font-bold">[{fn.severity}] {fn.title}</span>
                        <span className="text-white">{fn.file}:L{fn.line}</span>
                      </div>
                      <code className="text-[#00B5E2] block overflow-x-auto pt-1">
                        {fn.snippet}
                      </code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[#A3FF00]">
                  ✓ Zero high-risk shell, eval, or unvalidated filesystem mutation sinks detected in sampled files.
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Badge & Order */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[#00B5E2]/40 bg-[#0f1423] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold font-mono text-white">Embed Verification Badge</h3>
              <p className="text-xs text-[#8C92A4] leading-relaxed">
                Add this dynamic SVG badge to your GitHub README. It updates automatically when new audits pass.
              </p>
              <div className="bg-black/60 p-3 rounded border border-white/10 text-[11px] font-mono text-[#00B5E2] break-all select-all">
                {`[![SkillProof Score](https://img.shields.io/badge/SkillProof-${audit.skillproof_score}%2F100-${audit.skillproof_score >= 85 ? 'brightgreen' : 'orange'})](https://www.nanoempireai.com/skillproof/repo/${owner}/${repo})`}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#07090D] p-6 space-y-4 text-xs font-mono">
              <span className="text-white font-bold block">Need Full Cryptographic Certification?</span>
              <p className="text-[#8C92A4] leading-relaxed">
                SkillProof Adversarial Verification Sprint emits an offline-verifiable Ed25519 Trust Manifest pinned to your tree SHA.
              </p>
              <Link
                href={`mailto:rob@nanoempireai.com?subject=${encodeURIComponent(`SkillProof Certification Inquiry: ${audit.repo}`)}`}
                className="w-full bg-[#00B5E2] text-black font-bold py-2.5 rounded text-center block hover:bg-[#00B5E2]/90 transition-colors"
              >
                Inquire for Trust Manifest →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
