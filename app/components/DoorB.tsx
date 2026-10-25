import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DoorB() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
            Door B: For Founders, VCs & Marketplaces
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Is your agent actually secure? Prove it with a signed Trust Manifest. Behavioral verification, not claims.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Compliance Report</h3>
              <p className="text-slate-400 mb-4">$30 USD — One-Time Inventory Audit</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• 46,642 CPSC & FDA recall records</li>
                <li>• Automated UPC / SKU cross-reference</li>
                <li>• Signed PDF & CSV compliance audit</li>
              </ul>
              <Link href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" target="_blank" rel="noopener">
                <Button variant="outline" className="w-full">Unlock Report ($30) →</Button>
              </Link>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">RecallGuard Match API</h3>
              <p className="text-slate-400 mb-4">$0.10 USDC — x402 on Base</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• Machine-native HTTP 402 paywall</li>
                <li>• Micro-settlement in USDC on Base</li>
                <li>• Live on PyPI & npm</li>
              </ul>
              <Link href="/recall-report">
                <Button variant="outline" className="w-full">Test Scanner →</Button>
              </Link>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Sovereign Data License</h3>
              <p className="text-slate-400 mb-4">$2,400 / yr — Enterprise Feed Sync</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• Daily automated safety feed sync</li>
                <li>• Complete enterprise export (CSV/JSON)</li>
                <li>• Commercial catalog vetting license</li>
              </ul>
              <Link href="mailto:licensing@nanoempireai.com?subject=RecallRadar%20Enterprise%20Data%20License%20Inquiry">
                <Button variant="outline" className="w-full">Contact Licensing ($2,400/yr)</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recall-report" className="w-full sm:w-auto">
              <Button variant="default" className="w-full sm:w-auto">
                Launch Live Compliance Scanner
              </Button>
            </Link>
            <Link href="/case-studies" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                View Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
)