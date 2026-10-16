"use client";

import { useState } from 'react';
import { UploadCloud, AlertTriangle, CheckCircle, Lock, ShieldAlert, FileText, ChevronRight, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import Link from 'next/link';

type ScanResult = {
  totalScanned: number;
  matchCount: number;
  highSeverity: number;
  teaserItems?: {
    row: number;
    maskedItem: string;
    severity: string;
    hazardPreview: string;
  }[];
  reportToken?: string;
};

export default function RecallReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [email, setEmail] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email address to receive the report.');
      return;
    }
  
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/recall-report/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scanResults: results, 
          email 
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k?prefilled_email=${encodeURIComponent(email)}`;
      }
    } catch (error: any) {
      console.error('Checkout error, redirecting to payment link:', error);
      window.location.href = `https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k?prefilled_email=${encodeURIComponent(email)}`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/sample_inventory.csv');
      const csvText = await res.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (parsed) => {
          try {
            const scanRes = await fetch('/api/recall-report/scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: parsed.data.slice(0, 5000) })
            });
            const data = await scanRes.json();
            setResults(data);
          } catch (err) {
            console.error(err);
            alert("Failed to scan sample pallet");
          } finally {
            setIsScanning(false);
          }
        }
      });
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      alert("Failed to load sample pallet");
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        try {
          const res = await fetch('/api/recall-report/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: parsed.data.slice(0, 5000) }) // limit for MVP
          });
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error(err);
          alert("Failed to scan inventory");
        } finally {
          setIsScanning(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-rose-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium mb-6 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
            North American Safety Registry (CPSC & FDA)
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Check your inventory against <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">21,812 recalls</span>.
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Upload your inventory CSV. We instantly cross-reference UPCs, brands, and product titles against 21,812 verified official US (CPSC, FDA) safety enforcement notices.
          </p>
        </div>

        {!results ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <div className="border-2 border-dashed border-neutral-700 hover:border-rose-500/50 transition-colors rounded-xl p-12 text-center relative group cursor-pointer">
              <input 
                type="file" 
                accept=".csv" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-rose-400 transition-colors" />
                </div>
                <div>
                  <p className="text-lg font-medium text-neutral-200">
                    {file ? file.name : "Drag & drop your inventory CSV"}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Should contain columns like UPC, Brand, Title, or Description. <br/>
                    <a href="/sample_inventory.csv" download className="text-rose-400 hover:underline">Download sample CSV</a> to test the scanner.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-2 relative z-10">
                <span className="text-xs text-neutral-400">Want to test immediately?</span>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  disabled={isScanning}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-rose-300 border border-rose-500/30 hover:border-rose-500/60 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  ⚡ Test with $10,480 Sample Pallet (50 SKUs)
                </button>
              </div>
            </div>

            <button 
              onClick={handleScan}
              disabled={!file || isScanning}
              className="w-full mt-6 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {isScanning ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Scanning 21,812 records...</>
              ) : (
                <>Run Compliance Scan <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-center">
              {results.matchCount > 0 ? (
                <>
                  <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-rose-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {results.matchCount} recalled items detected!
                  </h2>
                  <p className="text-neutral-400 text-lg mb-6">
                    We scanned {results.totalScanned} items from your manifest.
                    {results.highSeverity > 0 && (
                      <span className="block mt-2 text-rose-400 font-medium">
                        🚨 {results.highSeverity} High Severity (Class I / Fatal / Laceration) hazards detected.
                      </span>
                    )}
                  </p>

                  {/* Flagged Items Teaser */}
                  {results.teaserItems && results.teaserItems.length > 0 && (
                    <div className="mb-8 text-left bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3 flex items-center justify-between">
                        <span>Sample Flagged Violations ({results.matchCount} Total Detected)</span>
                        <span className="text-rose-400 text-[11px] font-mono">15 U.S.C. § 2068 NOTICE</span>
                      </div>
                      <div className="space-y-2">
                        {results.teaserItems.map((item, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded bg-neutral-900 border border-neutral-800">
                            <div className="truncate max-w-[70%]">
                              <span className="font-semibold text-neutral-200 block truncate">
                                Row #{item.row}: {item.maskedItem}
                              </span>
                              <p className="text-[11px] text-rose-400/90 truncate">{item.hazardPreview}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {item.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Zero recalled items found.</h2>
                  <p className="text-neutral-400 text-lg mb-8">
                    We scanned {results.totalScanned} items from your inventory and found no matches in the database.
                  </p>
                </>
              )}

              {/* 3 Commercial Tiers */}
              <div className="grid md:grid-cols-3 gap-4 text-left">
                {/* Tier 1: Instant Report */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <FileText className="w-6 h-6 text-neutral-400 mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Pallet Taint Report</h3>
                    <p className="text-neutral-400 text-xs mb-4">Complete PDF + CSV export of all matches, official recall IDs, and manufacturer remedy links.</p>
                    <div className="text-2xl font-bold mb-4">$30 <span className="text-xs text-neutral-500 font-normal">USD</span></div>
                    <input 
                      type="email" 
                      placeholder="Enter email for report"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-xs px-3 py-2 rounded-lg mb-3 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    disabled={isCheckingOut}
                    className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Unlock Report ($30)
                  </button>
                </div>
                
                {/* Tier 2: Continuous Monitoring */}
                <div className="bg-gradient-to-b from-rose-950/40 to-neutral-950 border border-rose-500/30 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                  <div>
                    <ShieldAlert className="w-6 h-6 text-rose-400 mb-3" />
                    <h3 className="text-lg font-semibold mb-1 text-rose-100">Continuous Radar</h3>
                    <p className="text-neutral-400 text-xs mb-4">Daily automated sync across US & Canada safety registries. Instant alert webhooks on new bans.</p>
                    <div className="text-2xl font-bold mb-4 text-white">$99 <span className="text-xs text-neutral-500 font-normal">USD /mo</span></div>
                  </div>
                  <a 
                    href="https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-rose-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    Start Protection
                  </a>
                </div>

                {/* Tier 3: Data License & Daily API Sync */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <CheckCircle className="w-6 h-6 text-emerald-400 mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Annual Data License</h3>
                    <p className="text-neutral-400 text-xs mb-4">Complete enterprise export + daily automated sync. Full programmatic access across US & Canada registries.</p>
                    <div className="text-2xl font-bold mb-4">$2,400 <span className="text-xs text-neutral-500 font-normal">USD /yr</span></div>
                  </div>
                  <a 
                    href="mailto:licensing@nanoempireai.com?subject=RecallRadar%20Enterprise%20Data%20License%20Inquiry"
                    className="w-full border border-neutral-700 hover:border-neutral-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    Contact Licensing ($2,400/yr)
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800/80">
                <button
                  onClick={() => { setResults(null); setFile(null); }}
                  className="text-xs text-neutral-400 hover:text-white underline transition-colors"
                >
                  ← Scan another catalog or pallet manifest
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
