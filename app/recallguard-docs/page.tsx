import Link from "next/link";
import { ShieldCheck, Terminal, Database, Cpu, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";

export const metadata = {
  title: "RecallGuard API Documentation | Nano Empire",
  description: "Machine-readable vehicle & product recall detection endpoints. x402 settlement on Base.",
};

export default function RecallGuardDocs() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white">
      {/* Navigation */}
      <header className="border-b border-gray-800 bg-[#0B0F17]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono text-lg tracking-wider text-white font-bold flex items-center gap-2">
            <span className="text-blue-500">⚡</span> NANO EMPIRE
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/manifests.html" className="hover:text-white transition">Manifests</Link>
            <Link href="/recall-roulette.html" className="hover:text-white transition">Recall Roulette</Link>
            <Link href="/offers.json" className="hover:text-white transition font-mono">offers.json</Link>
            <Link href="/llms.txt" className="hover:text-white transition font-mono">llms.txt</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> API Specification · As of October 2026
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">RecallGuard Technical Docs</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Machine-to-machine recall verification endpoints. Automated campaign matching across NHTSA vPIC, CPSC, and FDA enforcement feeds with x402 micro-settlement.
          </p>
        </div>

        {/* Volume & Status Hygiene Card */}
        <div className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-sm space-y-2">
          <div className="font-semibold text-yellow-400 flex items-center gap-2">
            <span>⚠️</span> Protocol & Volume Disclosure (Honest Telemetry)
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            Endpoints operate with fail-closed security. The VIN decode endpoint supports both paper-mode receipts (<code className="text-yellow-300">paper_mode: true</code>) and live Base USDC x402 settlement. We report verified cryptographic receipts only—no inflated volume counters.
          </p>
        </div>

        {/* Endpoint 1: VIN Decode & Recall Match */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-mono text-xs font-bold">POST</span>
            <code className="text-lg font-mono text-white">/api/vin/decode</code>
            <span className="text-xs text-gray-500 font-mono">$0.03 USDC / call</span>
          </div>
          <p className="text-gray-400 text-sm">
            Validates 17-character VIN, retrieves vehicle specifications from NHTSA vPIC, queries active safety recall campaigns, and caches result for 24 hours.
          </p>

          <div className="bg-[#131B2B] rounded-xl border border-gray-800 overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between">
              <span>Request Format</span>
              <span>application/json</span>
            </div>
            <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto">
{`curl -X POST https://www.nanoempireai.com/api/vin/decode \\
  -H "Content-Type: application/json" \\
  -H "X-Payment-Receipt: <signed_receipt_nonce>" \\
  -d '{"vin": "1FTFW1E5XMFA12345"}'`}
            </pre>
          </div>

          <div className="bg-[#131B2B] rounded-xl border border-gray-800 overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between">
              <span>402 Challenge (When No Receipt Attached)</span>
              <span>HTTP 402 Payment Required</span>
            </div>
            <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">
{`{
  "error": "Payment Required",
  "price_usd": 0.03,
  "currency": "USDC",
  "chain": "base",
  "wallet": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "nonce": "bedeba7f-eac",
  "expires_in": 300,
  "paper_mode": true
}`}
            </pre>
          </div>
        </section>

        {/* Endpoint 2: Product Catalog Scan */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-mono text-xs font-bold">POST</span>
            <code className="text-lg font-mono text-white">/api/recall-report/scan</code>
            <span className="text-xs text-gray-500 font-mono">Catalog Batch Verification</span>
          </div>
          <p className="text-gray-400 text-sm">
            Accepts an array of merchant catalog items with UPC, GTIN, brand, and description. Returns matching CPSC and FDA hazard bulletins with hazard severity levels.
          </p>

          <div className="bg-[#131B2B] rounded-xl border border-gray-800 overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between">
              <span>Request Format</span>
              <span>application/json</span>
            </div>
            <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto">
{`curl -X POST https://www.nanoempireai.com/api/recall-report/scan \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      { "upc": "012345678905", "brand": "BrandName", "name": "Item Description" }
    ]
  }'`}
            </pre>
          </div>
        </section>

        {/* Machine Discovery Surfaces */}
        <section className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white">Machine Discovery Specifications</h2>
          <p className="text-gray-400 text-sm">
            Autonomous agent fleets discover, negotiate, and execute RecallGuard capabilities via standardized agent protocols:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/offers.json" className="p-4 rounded-xl border border-gray-800 bg-[#131B2B] hover:border-gray-700 transition flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-white font-bold">/offers.json</div>
                <div className="text-xs text-gray-400">Full machine-readable SKU catalog with Stripe price IDs & x402 rails</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Link>

            <Link href="/llms.txt" className="p-4 rounded-xl border border-gray-800 bg-[#131B2B] hover:border-gray-700 transition flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-white font-bold">/llms.txt</div>
                <div className="text-xs text-gray-400">Context specification for autonomous LLM agent discovery</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Link>

            <Link href="/.well-known/agent-card.json" className="p-4 rounded-xl border border-gray-800 bg-[#131B2B] hover:border-gray-700 transition flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-white font-bold">/.well-known/agent-card.json</div>
                <div className="text-xs text-gray-400">A2A protocol agent discovery manifest & verification signature</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Link>

            <Link href="/manifests.html" className="p-4 rounded-xl border border-gray-800 bg-[#131B2B] hover:border-gray-700 transition flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-white font-bold">/manifests.html</div>
                <div className="text-xs text-gray-400">Verified directory of Ed25519-signed trust attestations</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
