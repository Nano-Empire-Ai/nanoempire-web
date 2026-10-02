import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DoorA() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
            Door A: For AI Agents & Developers
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Build your agent's billing in 5 minutes. x402 on Base. No signup, no API keys — just USDC.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">RecallGuard Feed</h3>
              <p className="text-slate-400 mb-4">$0.05/call — 21,812 US recalls (CPSC + FDA)</p>
              <code className="text-xs text-slate-300 bg-slate-800 p-2 rounded block mb-4">
GET /api/v1/feed?limit=50
              </code>
              <Link href="/docs/recallguard" className="text-sm text-blue-400 hover:text-blue-300">
                View API Docs →
              </Link>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">RecallGuard Match</h3>
              <p className="text-slate-400 mb-4">$0.10/call — Batch inventory matching</p>
              <code className="text-xs text-slate-300 bg-slate-800 p-2 rounded block mb-4">
POST /api/v1/match
              </code>
              <Link href="/docs/recallguard" className="text-sm text-blue-400 hover:text-blue-300">
                View API Docs →
              </Link>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Free Trial</h3>
              <p className="text-slate-400 mb-4">50 credits, 24h TTL, then x402</p>
              <code className="text-xs text-slate-300 bg-slate-800 p-2 rounded block mb-4">
POST /v1/trial
              </code>
              <Link href="/docs/trial" className="text-sm text-blue-400 hover:text-blue-300">
                Claim Trial →
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://nanoempireai.com/openapi.json" target="_blank" rel="noopener">
              <Button variant="outline" className="w-full sm:w-auto">
                OpenAPI 3.1 Spec
              </Button>
            </Link>
            <Link href="https://npmjs.com/package/@nanoempire/x402-client" target="_blank" rel="noopener">
              <Button variant="outline" className="w-full sm:w-auto">
                TypeScript SDK
              </Button>
            </Link>
            <Link href="https://pypi.org/project/nano-empire-tollbooth/" target="_blank" rel="noopener">
              <Button variant="outline" className="w-full sm:w-auto">
                Python SDK
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
)