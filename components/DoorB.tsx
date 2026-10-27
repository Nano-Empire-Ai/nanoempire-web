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
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Adversarial prompt injection resistance, schema bounds, and Ed25519-signed Trust Manifests for production MCP servers and agent skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/skillproof" className="w-full sm:w-auto">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white w-full sm:w-auto">
                Explore Trust Manifests →
              </Button>
            </Link>
            <Link href="/grok-mcp/" className="w-full sm:w-auto">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-[#A3FF00] w-full sm:w-auto">
                Run Grok MCP Audit →
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