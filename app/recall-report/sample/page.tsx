'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Printer, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function AutomotiveSampleReport() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      
      {/* Print / Top Bar (hidden on print) */}
      <div className="bg-neutral-900 text-white p-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-400" />
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

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header Section */}
        <header className="border-b-4 border-neutral-900 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold mb-4 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Recall Exposure Report — SAMPLE
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Vehicle Risk Assessment</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <div>
              <p><span className="font-semibold text-neutral-500">Vehicle:</span> 2022 Ford F-150 (VIN on file)</p>
              <p><span className="font-semibold text-neutral-500">Prepared by:</span> RecallGuard · {new Date().toISOString().split('T')[0]}</p>
            </div>
            <div>
              <p><span className="font-semibold text-neutral-500">Source:</span> U.S. National Highway Traffic Safety Administration (NHTSA) recall database, checked today.</p>
            </div>
          </div>
        </header>

        {/* Executive Summary (Bottom Line) */}
        <section className="mb-10 bg-neutral-50 border border-neutral-200 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" /> Bottom Line
          </h2>
          <p className="text-lg leading-relaxed text-neutral-800">
            <strong>23 open recall campaigns</strong> match this vehicle&apos;s make, model, and model year. Three are safety-critical — a driveshaft fracture risk, a trailer-brake software fault, and a steering-column wiring fault. All three are repaired free of charge by a Ford dealer.
          </p>
        </section>

        {/* Priority Recalls */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-neutral-200 pb-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" /> 
            Priority Recalls <span className="text-sm font-normal text-neutral-500">(Act on these first)</span>
          </h2>
          
          <div className="space-y-6">
            
            {/* Priority 1 */}
            <div className="border-l-4 border-rose-600 pl-4">
              <h3 className="text-xl font-bold mb-2">1. Driveshaft fracture — Campaign <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">21V986000</span></h3>
              <div className="space-y-2 text-neutral-700">
                <p><strong className="text-neutral-900">What it means:</strong> The driveshaft can break while driving. If it does, you can lose drive power or vehicle control.</p>
                <p><strong className="text-neutral-900">Fix:</strong> Dealer inspects and repairs the driveshaft and re-attaches underbody insulators. Free.</p>
                <p className="bg-rose-50 text-rose-900 p-3 rounded-md mt-2 inline-block">
                  <strong>Action:</strong> Call your Ford dealer, reference campaign 21V986000, book the inspection.
                </p>
              </div>
            </div>

            {/* Priority 2 */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-xl font-bold mb-2">2. Trailer brake control fault — Campaign <span className="font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded">22V193000</span></h3>
              <div className="space-y-2 text-neutral-700">
                <p><strong className="text-neutral-900">What it means:</strong> The integrated trailer brake can stop working, which lengthens stopping distance when towing.</p>
                <p><strong className="text-neutral-900">Fix:</strong> Dealer updates the brake control module software. Free.</p>
                <p className="bg-orange-50 text-orange-900 p-3 rounded-md mt-2 inline-block">
                  <strong>Action:</strong> Reference campaign 22V193000 at your next service visit.
                </p>
              </div>
            </div>

            {/* Priority 3 */}
            <div className="border-l-4 border-rose-600 pl-4">
              <h3 className="text-xl font-bold mb-2">3. Steering column wiring — Campaign <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">22V253000</span></h3>
              <div className="space-y-2 text-neutral-700">
                <p><strong className="text-neutral-900">What it means:</strong> Damaged wiring can keep the steering column from moving as designed in a crash, raising injury risk.</p>
                <p><strong className="text-neutral-900">Fix:</strong> Dealer inspects and repairs the wiring harness. Free.</p>
                <p className="bg-rose-50 text-rose-900 p-3 rounded-md mt-2 inline-block">
                  <strong>Action:</strong> Reference campaign 22V253000, book the inspection.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* All Campaigns Table */}
        <section className="mb-12 break-inside-avoid">
          <h2 className="text-2xl font-bold mb-4 border-b border-neutral-200 pb-2">All 23 Matching Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600 text-sm uppercase tracking-wider">
                  <th className="p-3 border-b border-neutral-200">Campaign</th>
                  <th className="p-3 border-b border-neutral-200">System</th>
                  <th className="p-3 border-b border-neutral-200">Announced</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                <tr className="border-b border-neutral-100">
                  <td className="p-3 font-mono">21V986000</td>
                  <td className="p-3 font-medium">Driveshaft</td>
                  <td className="p-3 text-neutral-500">Dec 2021</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="p-3 font-mono">22V193000</td>
                  <td className="p-3 font-medium">Trailer brake control</td>
                  <td className="p-3 text-neutral-500">Mar 2022</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="p-3 font-mono">22V253000</td>
                  <td className="p-3 font-medium">Steering column</td>
                  <td className="p-3 text-neutral-500">Apr 2022</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="p-3 font-mono">22V623000</td>
                  <td className="p-3 font-medium">Driveshaft</td>
                  <td className="p-3 text-neutral-500">Aug 2022</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="p-3 font-mono">22V675000</td>
                  <td className="p-3 font-medium">Wheel lugs/nuts</td>
                  <td className="p-3 text-neutral-500">Sep 2022</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-4 text-center text-neutral-500 italic bg-neutral-50">
                    ... (18 additional campaigns omitted) ...<br/>
                    <span className="text-sm">Full list with official remedy text available on request.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What to do next */}
        <section className="mb-12 bg-blue-50 border border-blue-200 p-6 rounded-xl break-inside-avoid">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
            <CheckCircle2 className="w-5 h-5" /> What to do next
          </h2>
          <ul className="space-y-3 text-blue-900 list-disc list-inside">
            <li>Call your Ford dealer with the three priority campaign numbers above.</li>
            <li>All recall repairs are free by law — never pay for one.</li>
            <li>Confirm your specific VIN at nhtsa.gov/recalls or with the dealer, since some campaigns cover only certain build dates.</li>
          </ul>
        </section>

        {/* Honesty Caveat & Footer */}
        <footer className="mt-8 pt-8 border-t border-neutral-200 text-neutral-500 text-sm leading-relaxed">
          <p className="mb-4">
            <strong>How this report was made:</strong> your VIN was decoded to its make/model/year and checked against every NHTSA campaign for that vehicle — 21,812 recall records in the current database. A match means your vehicle is in a recalled group ("potentially affected"); the dealer confirms whether your specific VIN is included. This report is informational, not legal advice.
          </p>
          <div className="bg-neutral-100 p-3 rounded font-mono text-xs text-center">
            SAMPLE REPORT — generated from a test VIN pattern to demonstrate format. Not a real vehicle assessment.
          </div>
        </footer>

      </div>
    </div>
  );
}
