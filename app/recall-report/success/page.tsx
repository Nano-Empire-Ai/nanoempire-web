"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Download, Printer, ExternalLink, Loader2, Lock } from 'lucide-react';

function SuccessReportView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState<any>(null);

  useEffect(() => {
    async function unlockReport() {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('recallradar_report_token') : '';
        const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('recallradar_email') : '';

        const res = await fetch('/api/recall-report/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            reportToken: storedToken || undefined,
            email: storedEmail || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || 'Payment verification required to unlock report.');
        } else {
          setUnlocked(data);
        }
      } catch (err: any) {
        setError('Unable to verify report session.');
      } finally {
        setLoading(false);
      }
    }
    unlockReport();
  }, [sessionId]);

  const handleDownloadCsv = () => {
    if (!unlocked?.reportData?.matchedItems) return;
    const rows = [
      ['Row', 'Brand', 'Product Name', 'UPC', 'Recall ID', 'Agency/Source', 'Severity', 'Hazard', 'Remedy / Action', 'Official URL']
    ];
    for (const item of unlocked.reportData.matchedItems) {
      const m = (item.matches && item.matches[0]) || {};
      rows.push([
        String(item.row || ''),
        String(item.input?.brand || ''),
        String(item.input?.name || ''),
        String(item.input?.upc || ''),
        String(m.recall_id || m.id || ''),
        String(m.source || 'CPSC/FDA'),
        String(m.severity || ''),
        String(m.hazard || '').replace(/\r?\n/g, ' '),
        String(m.remedy || '').replace(/\r?\n/g, ' '),
        String(m.url || ''),
      ]);
    }
    const csvContent = rows
      .map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${unlocked.certId || 'RecallRadar'}_Compliance_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold">Decrypting & Signing Compliance Certificate...</h1>
          <p className="text-sm text-slate-400 mt-1">Generating Ed25519 cryptographic attestation under 15 U.S.C. § 2068</p>
        </div>
      </main>
    );
  }

  if (error || !unlocked) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Lock className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Report Locked</h1>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <Link
            href="/recall-report"
            className="inline-block w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors"
          >
            ← Return to Scanner
          </Link>
        </div>
      </main>
    );
  }

  const { certId, issuedAt, email, reportData, attestation } = unlocked;
  const matchedItems = reportData?.matchedItems || [];

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10 print:p-0 print:bg-white text-slate-900">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 md:p-10 print:shadow-none print:rounded-none border border-slate-200">
        {/* Top Action Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 print:hidden">
          <Link href="/recall-report" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Scan Another Manifest
          </Link>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Full CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save Signed PDF
            </button>
          </div>
        </div>

        {/* Certificate Header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded mb-3">
              <ShieldCheck className="w-4 h-4" /> 15 U.S.C. § 2068 Statutory Screening Record
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              RecallRadar Certificate of Compliance & Manifest Audit
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Issued by Nano Empire AI • Federal CPSC & FDA Enforcement Registry Cross-Reference
            </p>
          </div>
          <div className="text-left md:text-right font-mono text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 shrink-0">
            <div className="font-bold text-slate-900 text-sm mb-1">CERT ID: {certId}</div>
            <div className="text-slate-600">Issued: {new Date(issuedAt).toUTCString()}</div>
            <div className="text-slate-600">Recipient: {email}</div>
            <div className="text-emerald-700 font-semibold mt-1">STATUS: VERIFIED & SIGNED (Ed25519)</div>
          </div>
        </header>

        {/* Executive Summary Metrics */}
        <section className="mb-8">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
            1. Executive Manifest Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-semibold">Total SKUs Scanned</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{reportData.totalScanned || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-800 uppercase font-semibold">Cleared SKUs</p>
              <p className="text-3xl font-extrabold text-emerald-900 mt-1">{reportData.clearedItems || 0}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800 uppercase font-semibold">Total Recall Hits</p>
              <p className="text-3xl font-extrabold text-amber-900 mt-1">{reportData.matchCount || 0}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="text-xs text-rose-800 uppercase font-semibold">Critical / High Severity</p>
              <p className="text-3xl font-extrabold text-rose-900 mt-1">{reportData.highSeverity || 0}</p>
            </div>
          </div>
        </section>

        {/* Detailed Unredacted Findings Table */}
        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
            2. Unredacted Violation Schedule ({matchedItems.length} Flagged Items)
          </h2>
          {matchedItems.length === 0 ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-sm">
              Zero active recall matches were detected across the submitted manifest items.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase font-mono text-[11px]">
                    <th className="p-3">Row</th>
                    <th className="p-3">Manifest Item (Brand / Title / UPC)</th>
                    <th className="p-3">Recall ID & Source</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Hazard & Mandatory Remedy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {matchedItems.map((item: any, idx: number) => {
                    const m = (item.matches && item.matches[0]) || {};
                    const isCritical = m.severity === 'critical' || m.severity === 'serious' || m.severity === 'class-i';
                    return (
                      <tr key={idx} className="hover:bg-slate-50 align-top">
                        <td className="p-3 font-mono font-bold text-slate-700">#{item.row || idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">
                            {item.input?.brand ? `${item.input.brand} — ` : ''}{item.input?.name || 'Unnamed SKU'}
                          </div>
                          {item.input?.upc && (
                            <div className="font-mono text-[11px] text-slate-500 mt-0.5">UPC: {item.input.upc}</div>
                          )}
                        </td>
                        <td className="p-3 font-mono">
                          <div className="font-bold text-slate-800">{m.recall_id || m.id || 'N/A'}</div>
                          <div className="text-[11px] text-slate-500 uppercase">{m.source || 'CPSC / FDA'}</div>
                          {m.url && (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-rose-600 hover:underline mt-1 print:hidden"
                            >
                              Official Filing <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {m.severity || 'RECALLED'}
                          </span>
                        </td>
                        <td className="p-3 max-w-md">
                          {m.hazard && (
                            <div className="text-slate-800 mb-1">
                              <strong className="text-rose-700">Hazard:</strong> {m.hazard}
                            </div>
                          )}
                          {m.remedy && (
                            <div className="text-slate-600 text-[11px]">
                              <strong>Remedy:</strong> {m.remedy}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cryptographic Proof Footer */}
        <footer className="pt-6 border-t border-slate-300 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-[11px] mb-4 break-all">
            <div className="font-bold text-slate-800 mb-1">CRYPTOGRAPHIC ATTESTATION (Ed25519)</div>
            <div>Public Key: {attestation?.publicKey}</div>
            <div>Signature: {attestation?.signature}</div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Statutory Notice (15 U.S.C. § 2068):</strong> Under the Consumer Product Safety Act, it is unlawful to sell, offer for sale, manufacture for sale, distribute in commerce, or import into the United States any consumer product that is subject to a voluntary corrective action or mandatory recall notice. Retain this signed audit certificate for marketplace compliance, supplier chargeback claims, and commercial liability documentation.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading certificate...</div>}>
      <SuccessReportView />
    </Suspense>
  );
}
