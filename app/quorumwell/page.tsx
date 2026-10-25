"use client";

import { useState, useEffect } from 'react';
import { FileText, Calendar, CheckCircle, AlertTriangle, Lock, ArrowRight, ShieldCheck, Building2, Clock, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type GeneratedPack = {
  orgName: string;
  corpNumber: string;
  anniversaryMonth: string;
  fiscalYearEnd: string;
  meetingDate: string;
  attendees: string;
  motionsPreview: string[];
  form4022Window: string;
  craDeadline: string;
};

type NfpItem = {
  id: string;
  name: string;
  date: string;
  lastFiling: string;
  city: string;
  isOtt: boolean;
};

type NewCorpItem = {
  date: string;
  name: string;
  type: string;
  street: string;
  postal: string;
};

export default function QuorumWellPage() {
  const [orgName, setOrgName] = useState('');
  const [corpNumber, setCorpNumber] = useState('');
  const [anniversaryMonth, setAnniversaryMonth] = useState('October');
  const [fiscalYearEnd, setFiscalYearEnd] = useState('December 31');
  const [rawNotes, setRawNotes] = useState('');
  const [email, setEmail] = useState('');
  const [pack, setPack] = useState<GeneratedPack | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Search & Public Dataset State
  const [nfpList, setNfpList] = useState<NfpItem[]>([]);
  const [newCorpsList, setNewCorpsList] = useState<NewCorpItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOttawa, setFilterOttawa] = useState(false);
  const [activeTab, setActiveTab] = useState<'lookup' | 'newcorps'>('lookup');

  useEffect(() => {
    fetch('/quorumwell/nfp_data.json')
      .then(res => res.json())
      .then(data => setNfpList(data))
      .catch(() => {});

    fetch('/quorumwell/new_corps.json')
      .then(res => res.json())
      .then(data => setNewCorpsList(data))
      .catch(() => {});
  }, []);

  const filteredNfp = nfpList.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.includes(searchQuery) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOttawa = !filterOttawa || item.isOtt;
    return matchesSearch && matchesOttawa;
  });

  const selectNfpForBuilder = (item: NfpItem) => {
    setOrgName(item.name);
    setCorpNumber(item.id);
    if (item.date) {
      const monthIdx = parseInt(item.date.split('-')[1], 10) - 1;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (months[monthIdx]) {
        setAnniversaryMonth(months[monthIdx]);
      }
    }
    const builderEl = document.getElementById('governance-builder');
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadSampleNonprofit = () => {
    setOrgName('Ottawa Community Heritage & Arts Association');
    setCorpNumber('1184920-4');
    setAnniversaryMonth('November');
    setFiscalYearEnd('March 31');
    setRawNotes(
      `Meeting called to order at 7:04 PM on Zoom. Present: Sarah Jenkins (Chair), Marc Leblanc (Treasurer), Priya Patel (Secretary), David Chen (Director). Quorum confirmed.\n` +
      `1. Approval of prior meeting minutes (moved by Marc, seconded by David - carried).\n` +
      `2. Treasurer report: Bank balance C$18,420. Annual financial statements reviewed.\n` +
      `3. Corporations Canada Form 4022 Annual Return is overdue — board passed resolution authorizing Secretary to file Form 4022 and update Director Register (Form 4006) immediately to maintain active status under CNCA s. 222.\n` +
      `4. Next AGM scheduled for November 18 at 7:00 PM.\n` +
      `Adjourned at 8:02 PM.`
    );
  };

  const handleGeneratePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrg = orgName.trim() || 'Federal Non-Profit Corporation';
    const cleanCorp = corpNumber.trim() || 'CNCA-PENDING';
    const lines = rawNotes
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedMotions =
      lines.length > 0
        ? lines
        : [
            'RESOLVED THAT the financial statements for the completed fiscal year be approved as presented.',
            'RESOLVED THAT any Officer or Director of the Corporation is hereby authorized and directed to execute and file Form 4022 (Annual Return) and Form 4006 (Changes Regarding Directors) with Corporations Canada.',
            'RESOLVED THAT the public accountant / financial reviewer appointment be confirmed until the next Annual Meeting of Members.'
          ];

    setPack({
      orgName: cleanOrg,
      corpNumber: cleanCorp,
      anniversaryMonth,
      fiscalYearEnd,
      meetingDate: new Date().toISOString().split('T')[0],
      attendees: 'Board of Directors (Quorum Verified pursuant to By-Law No. 1)',
      motionsPreview: parsedMotions,
      form4022Window: `Within 60 days following ${anniversaryMonth} incorporation anniversary (CNCA s. 279)`,
      craDeadline: `Within 6 months following ${fiscalYearEnd} fiscal year-end (T3010 / T1044)`
    });
  };

  const handleUnlockCheckout = () => {
    if (!email) {
      alert('Please enter your board or secretary email address to receive the governance pack.');
      return;
    }
    setIsCheckingOut(true);
    const checkoutUrl = `https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k?prefilled_email=${encodeURIComponent(email)}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong className="text-slate-200">QuorumWell™ by NanoEmpire AI</strong> — Canadian Board Minutes &amp; CNCA Filing Calendar
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">
              ← NanoEmpire Home
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>737 Ontario Federal Nonprofits Currently Flagged for Overdue Filings</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Board Minutes &amp; CNCA Good-Standing Shield in 60 Seconds
          </h1>
          <p className="text-lg text-slate-300">
            Turn Zoom notes or raw agendas into <strong className="text-white">ready-to-approve board minute drafts</strong> structured for Robert&apos;s Rules &amp; CNCA workflows, plus an automated <strong className="text-white">Form 4022 annual filing calendar</strong> to help your nonprofit or community association stay ahead of filing deadlines.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
            <FileText className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">1. Instant Minute Drafts</h3>
            <p className="text-sm text-slate-400">
              Structured for Canada Not-for-profit Corporations Act (CNCA) &amp; Ontario ONCA board review: quorum records, motions, seconders, and action registers ready for board approval and signature.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
            <Calendar className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">2. Form 4022 &amp; AGM Calendar</h3>
            <p className="text-sm text-slate-400">
              Track your 60-day Corporations Canada Form 4022 window, Form 4006 director updates, and CRA T3010 / T1044 deadlines even when volunteer board members rotate.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
            <Building2 className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">3. Good-Standing Catch-Up Templates</h3>
            <p className="text-sm text-slate-400">
              Behind on annual returns? Draft the standard board and member catch-up resolution templates for your board to review, adopt, and file.
            </p>
          </div>
        </div>

        {/* Public Good Lookup & Registry Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Open Government Data Explorer</span>
              </div>
              <h2 className="text-xl font-bold text-white">Ontario Federal Nonprofit Compliance Lookup</h2>
              <p className="text-sm text-slate-400">
                Search Corporations Canada&apos;s published record of 737 Ontario nonprofits currently flagged &quot;Active - Dissolution Pending (non-compliance)&quot;.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('lookup')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === 'lookup' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                737 At-Risk Nonprofits
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('newcorps')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === 'newcorps' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                57 New Ottawa Corps
              </button>
            </div>
          </div>

          {activeTab === 'lookup' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by organization name, corporation #, or city..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
                <button
                  type="button"
                  onClick={() => setFilterOttawa(!filterOttawa)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${filterOttawa ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                >
                  {filterOttawa ? 'Showing Ottawa Area Only (75)' : 'Filter Ottawa Area (75)'}
                </button>
              </div>

              <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Corp #</th>
                      <th className="py-2.5 px-3">Organization Name</th>
                      <th className="py-2.5 px-3">City</th>
                      <th className="py-2.5 px-3">Anniversary</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredNfp.slice(0, 50).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2 px-3 text-blue-400 font-bold">
                          <a
                            href={`https://ised-isde.canada.ca/cc/lgcy/fdrlCrpDtls.html?corpId=${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            <span>{item.id}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                          </a>
                        </td>
                        <td className="py-2 px-3 font-sans text-white font-medium">{item.name}</td>
                        <td className="py-2 px-3">{item.city}</td>
                        <td className="py-2 px-3 text-slate-400">{item.date}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => selectNfpForBuilder(item)}
                            className="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-xs font-sans font-medium transition-colors cursor-pointer"
                          >
                            Build Pack
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredNfp.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                          No organizations found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2 px-1">
                <span>Showing {Math.min(50, filteredNfp.length)} of {filteredNfp.length} results</span>
                <span>Source: Corporations Canada Open Data (Weekly Refresh)</span>
              </div>
            </div>
          )}

          {activeTab === 'newcorps' && (
            <div>
              <p className="text-xs text-slate-400 mb-3">
                Weekly compilation of newly registered federal corporations in the Ottawa area (Oct 10–16, 2026). Sourced under Open Government Licence – Canada.
              </p>
              <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs">
                <table className="w-full text-left text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Corporate Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Address</th>
                      <th className="py-2.5 px-3">Postal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {newCorpsList.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 text-slate-400">{c.date}</td>
                        <td className="py-2 px-3 font-sans text-white font-medium">{c.name}</td>
                        <td className="py-2 px-3 text-blue-400">{c.type}</td>
                        <td className="py-2 px-3">{c.street}</td>
                        <td className="py-2 px-3">{c.postal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Generator */}
        <div id="governance-builder" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-12 scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">Interactive Minute &amp; Filing Schedule Builder</h2>
              <p className="text-sm text-slate-400">
                Enter your organization details or load our Ottawa community association example to preview your governance pack.
              </p>
            </div>
            <button
              type="button"
              onClick={loadSampleNonprofit}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-slate-700 transition-colors cursor-pointer"
            >
              Load Sample Ottawa Nonprofit
            </button>
          </div>

          <form onSubmit={handleGeneratePreview} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Organization / Corporation Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g., Glebe Community & Youth Association"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Federal Corporation Number (Optional)
                </label>
                <input
                  type="text"
                  value={corpNumber}
                  onChange={(e) => setCorpNumber(e.target.value)}
                  placeholder="e.g., 1184920-4"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Incorporation Anniversary Month (Form 4022 Trigger)
                </label>
                <select
                  value={anniversaryMonth}
                  onChange={(e) => setAnniversaryMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fiscal Year-End Date
                </label>
                <input
                  type="text"
                  value={fiscalYearEnd}
                  onChange={(e) => setFiscalYearEnd(e.target.value)}
                  placeholder="e.g., December 31 or March 31"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Raw Meeting Notes, Zoom Transcript Excerpt, or Catch-Up Items
              </label>
              <textarea
                rows={5}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Paste rough bullet points from your board meeting, or leave blank to generate a standard CNCA Annual General Meeting & Form 4022 Good-Standing Resolution draft..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Generate Board Minute Draft &amp; Filing Schedule Preview</span>
            </button>
          </form>

          {/* Preview Output */}
          {pack && (
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>Governance &amp; Filing Pack Drafted for {pack.orgName}</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                  Corp #{pack.corpNumber}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-slate-100 font-bold text-sm border-b border-slate-800 pb-2">
                  DRAFT MINUTES OF A MEETING OF THE BOARD OF DIRECTORS OF {pack.orgName.toUpperCase()}
                </div>
                <div>
                  <strong>DATE:</strong> {pack.meetingDate} | <strong>FRAMEWORK:</strong> Canada Not-for-profit Corporations Act (CNCA)
                </div>
                <div>
                  <strong>QUORUM &amp; ATTENDANCE:</strong> {pack.attendees}
                </div>
                <div className="pt-2">
                  <strong className="text-blue-400">DRAFT RECORD OF RESOLUTIONS &amp; MOTIONS (FOR BOARD REVIEW):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {pack.motionsPreview.slice(0, 3).map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-800/80 grid sm:grid-cols-2 gap-3 text-amber-300">
                  <div>
                    <strong>📅 Form 4022 Annual Return Window:</strong>
                    <div className="text-slate-300 mt-0.5">{pack.form4022Window}</div>
                  </div>
                  <div>
                    <strong>📅 Financial &amp; Information Return Deadline:</strong>
                    <div className="text-slate-300 mt-0.5">{pack.craDeadline}</div>
                  </div>
                </div>
                <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-slate-400 flex items-center justify-between">
                  <span>
                    🔒 Full Editable DOCX/PDF Minute Book Draft + Form 4022 Catch-Up Resolution Template + 12-Month .ICS Board Reminder Feed
                  </span>
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                </div>
              </div>

              {/* Unlock Box */}
              <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">
                  Unlock Full Board Governance &amp; Filing Pack — $30 USD
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  Includes your editable meeting minute drafts, CNCA Form 4022 &amp; Form 4006 director catch-up resolution templates for board signature, and your 12-month filing calendar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter board chair or secretary email..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleUnlockCheckout}
                    disabled={isCheckingOut}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{isCheckingOut ? 'Redirecting to Stripe...' : 'Unlock Full Governance Pack ($30)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Independent Service & CASL Compliance Footer */}
        <footer className="border-t border-slate-900 pt-8 text-xs text-slate-500 space-y-2 text-center">
          <p>
            <strong>Independent Governance Service &amp; Non-Legal Advice Disclaimer:</strong> QuorumWell™ is a private software and administrative drafting tool operated by NanoEmpire AI. It is not affiliated with, endorsed by, or part of Corporations Canada, Innovation, Science and Economic Development Canada (ISED), or the Government of Canada. QuorumWell does not provide legal, tax, or accounting advice; all generated drafts must be reviewed, approved, and signed by your corporation&apos;s authorized directors or officers.
          </p>
          <p>
            Corporations Canada public registry data is sourced under the Open Government Licence – Canada. Questions or board support: <a href="mailto:rob@nanoempireai.com" className="text-slate-400 underline">rob@nanoempireai.com</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
