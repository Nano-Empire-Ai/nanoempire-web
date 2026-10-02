import re
from pathlib import Path

NANOEMPIRE_WEB = Path(r"C:\Users\robla\empire\nanoempire-web")
PUBLIC = NANOEMPIRE_WEB / "public"
PAGES = NANOEMPIRE_WEB / "app"

def read_file(path):
    return path.read_text(encoding="utf-8")

def write_file(path, content):
    path.write_text(content, encoding="utf-8")
    print(f"✅ Written: {path}")

# ============================================================
# 1. TWO DOORS HOMEPAGE SPLIT
# ============================================================

# Create Door A: For AI Agents & Devs (RecallGuard)
DOOR_A_CONTENT = '''import Link from 'next/link'
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
            Build your agent\'s billing in 5 minutes. x402 on Base. No signup, no API keys — just USDC.
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
)'''

# Create Door B: For Human Founders & Enterprise (SkillProof)
DOOR_B_CONTENT = '''import Link from 'next/link'
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
)'''

# Update homepage with Two Doors split
HOMEPAGE_PATH = PAGES / "page.tsx"
if HOMEPAGE_PATH.exists():
    homepage = read_file(HOMEPAGE_PATH)
    # This is a placeholder - actual integration would replace the hero section
    print(f"✅ Homepage exists at {HOMEPAGE_PATH}")
    print("📝 Two Doors components ready for integration")

# Write Door components
(PAGES / "components").mkdir(exist_ok=True)
write_file(PAGES / "components" / "DoorA.tsx", DOOR_A_CONTENT)
write_file(PAGES / "components" / "DoorB.tsx", DOOR_B_CONTENT)

print("✅ Two Doors components created at app/components/DoorA.tsx and DoorB.tsx")
print("📝 Next: Import and render in page.tsx hero section")