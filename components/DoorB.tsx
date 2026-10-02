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
              <h3 className="text-lg font-semibold text-white mb-2">SkillProof Sprint</h3>
              <p className="text-slate-400 mb-4">$500 CAD — 48h injection-resistance battery</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• 180 adversarial ops across 5 categories</li>
                <li>• Per-category block rates</li>
                <li>• Ed25519 Trust Manifest</li>
              </ul>
              <Link href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c" target="_blank" rel="noopener">
                <Button variant="outline" className="w-full">Buy Sprint →</Button>
              </Link>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">MCP Verification</h3>
              <p className="text-slate-400 mb-4">$800 — Identity + Injection + Exposure</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• OAuth/credential leak test</li>
                <li>• 5-category injection battery</li>
                <li>• File/shell exposure audit</li>
              </ul>
              <Button variant="outline" className="w-full" disabled>Contact for Access</Button>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Marketplace Badge</h3>
              <p className="text-slate-400 mb-4">Verified-MCP for Smithery/Glama</p>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>• Pre-listing verification</li>
                <li>• Badge embed for listings</li>
                <li>• Continuous monitoring</li>
              </ul>
              <Button variant="outline" className="w-full" disabled>Apply for Beta</Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/skillproof" className="w-full sm:w-auto">
              <Button variant="default" className="w-full sm:w-auto">
                View All SkillProof Products
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
  );
}