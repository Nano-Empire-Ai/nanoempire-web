"use client";

import { useState } from 'react';
import { UploadCloud, AlertTriangle, CheckCircle, Lock, ShieldAlert, FileText, ChevronRight, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import Link from 'next/link';

type ScanResult = {
  totalScanned: number;
  matchCount: number;
  highSeverity: number;
  matchedItems: Record<string, unknown>[];
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
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Error initiating checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
            FDA & CPSC Recall Database Synced
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Check your inventory against <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">21,812 recalls</span>.
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Upload your inventory CSV. We instantly cross-reference UPCs, brand names, and descriptions against the canonical federal recall database.
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
                    Should contain columns like UPC, Brand, Name, or Description. <br/>
                    <a href="/sample_inventory.csv" download className="text-rose-400 hover:underline">Download a sample CSV</a> to test the scanner.
                  </p>
                </div>
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
                    {results.matchCount} recalled items found.
                  </h2>
                  <p className="text-neutral-400 text-lg mb-8">
                    We scanned {results.totalScanned} items from your inventory.
                    {results.highSeverity > 0 && <span className="block mt-2 text-rose-400 font-medium">{results.highSeverity} High Severity (Class I / Serious) hazards detected.</span>}
                  </p>
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

              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                  <FileText className="w-6 h-6 text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">One-Time Report</h3>
                  <p className="text-neutral-400 text-sm mb-6">Full PDF & CSV export of all matches, hazard severity, and next steps for removal.</p>
                  <div className="text-3xl font-bold mb-4">$30</div>
                  <input 
                    type="email" 
                    placeholder="Enter your email to receive the report"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:border-rose-500"
                    required
                  />
                  <button 
                    onClick={handleCheckout} 
                    disabled={isCheckingOut}
                    className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Unlock Report
                  </button>
                </div>
                
                <div className="bg-gradient-to-b from-rose-950/50 to-neutral-950 border border-rose-500/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                  <ShieldAlert className="w-6 h-6 text-rose-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-rose-100">Continuous Monitoring</h3>
                  <p className="text-neutral-400 text-sm mb-6">Daily automated checks. We email you immediately when a new recall hits your inventory.</p>
                  <div className="text-3xl font-bold mb-6 text-white">$99 <span className="text-lg text-neutral-500 font-normal">/mo</span></div>
                  <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                    Start Protection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
