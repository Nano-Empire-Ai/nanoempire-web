import { AlertTriangle, ShieldAlert, FileText, CheckCircle, Printer } from 'lucide-react';
import Link from 'next/link';

export default function RecallReportSample() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-rose-500/30 print:bg-white print:text-black">
      
      {/* Print / Top Bar (hidden on print) */}
      <div className="bg-neutral-900 text-white p-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span className="font-semibold">RecallGuard Compliance</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/recall-report" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Back to Scanner
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header Section */}
        <header className="border-b-4 border-neutral-900 pb-8 mb-8 flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-bold mb-4 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Official Compliance Report
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Inventory Recall Audit</h1>
            <p className="text-xl text-neutral-600">Generated for <span className="font-semibold text-neutral-900">Sample Retailer LLC</span></p>
          </div>
          <div className="text-right text-sm text-neutral-500">
            <p className="font-mono">ID: RG-AUDIT-8921-X</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Scanned Items: 1,500</p>
            <p>Database: FDA, CPSC (21,812 records)</p>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl">
              <div className="text-rose-600 text-sm font-bold uppercase mb-2">Total Recalls Found</div>
              <div className="text-5xl font-black text-rose-700">3</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
              <div className="text-orange-600 text-sm font-bold uppercase mb-2">High Severity (Class I)</div>
              <div className="text-5xl font-black text-orange-700">1</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
              <div className="text-emerald-600 text-sm font-bold uppercase mb-2">Cleared Items</div>
              <div className="text-5xl font-black text-emerald-700">1,497</div>
            </div>
          </div>
        </section>

        {/* Detailed Findings */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Detailed Findings</h2>
          <div className="space-y-6">
            
            {/* Finding 1 */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm break-inside-avoid">
              <div className="bg-rose-600 text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold">CRITICAL SEVERITY (FDA Class I)</span>
                </div>
                <span className="text-sm opacity-80 uppercase tracking-wider">Immediate Action Required</span>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Boppy Newborn Lounger</h3>
                    <p className="text-neutral-500">Brand: The Boppy Company</p>
                  </div>
                  <div className="text-left md:text-right mt-4 md:mt-0">
                    <div className="text-sm text-neutral-500 uppercase font-bold tracking-wider mb-1">Matched UPC</div>
                    <div className="font-mono text-lg bg-neutral-100 px-3 py-1 rounded inline-block">00041808401345</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-neutral-100">
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Hazard / Defect</h4>
                    <p className="text-neutral-700">Infants can suffocate if they roll, move, or are placed on the lounger in a position that obstructs breathing.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Required Action</h4>
                    <p className="text-neutral-700">Stop selling immediately. Isolate inventory and contact the manufacturer for a refund or safe disposal instructions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Finding 2 */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm break-inside-avoid">
              <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold">MODERATE SEVERITY (CPSC)</span>
                </div>
                <span className="text-sm opacity-80 uppercase tracking-wider">Pull from Shelves</span>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Mainstays Electric Mini Chopper</h3>
                    <p className="text-neutral-500">Brand: Walmart / Mainstays</p>
                  </div>
                  <div className="text-left md:text-right mt-4 md:mt-0">
                    <div className="text-sm text-neutral-500 uppercase font-bold tracking-wider mb-1">Matched Item Name</div>
                    <div className="font-mono text-lg bg-neutral-100 px-3 py-1 rounded inline-block">Mainstays Mini Food Chopper</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-neutral-100">
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Hazard / Defect</h4>
                    <p className="text-neutral-700">The chopper's blade can operate unexpectedly during assembly or when not enclosed in the bowl, posing a laceration hazard.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Required Action</h4>
                    <p className="text-neutral-700">Remove from retail shelves and e-commerce listings. Customers may return to store for full refund.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-neutral-200 text-center text-neutral-500 text-sm">
          <p className="font-bold text-neutral-900 mb-2 flex justify-center items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            RecallGuard Compliance Audits
          </p>
          <p>This report is cryptographically sealed and verified against official FDA and CPSC databases.</p>
          <p className="mt-1">Generated by Nano Empire AI • nanoempireai.com</p>
        </footer>

      </div>
    </div>
  );
}
