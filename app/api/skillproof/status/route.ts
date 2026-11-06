import { NextRequest, NextResponse } from 'next/server';
import preauditsData from '@/public/skillproof/preaudits.json';

export const dynamic = 'force-dynamic';

const ED25519_PUBKEY_HEX = '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82';
const PUBKEY_WELL_KNOWN = 'https://www.nanoempireai.com/.well-known/skillproof-pubkey.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoParam = (searchParams.get('repo') || '').trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');

  const audits: any[] = (preauditsData as any).audits || [];

  // If no repo specified, return index summary + verification policy for calling A2A / ERC-8004 agents
  if (!repoParam) {
    return NextResponse.json(
      {
        schema: 'https://www.nanoempireai.com/schemas/skillproof-status-v1.json',
        updated_at: (preauditsData as any).updated_at || '2026-11-06',
        total_indexed_repos: audits.length,
        verification_authority: {
          issuer: 'Nano Empire AI',
          algorithm: 'Ed25519',
          kid: 'skillproof-2026-10',
          public_key_hex: ED25519_PUBKEY_HEX,
          pubkey_well_known: PUBKEY_WELL_KNOWN,
          verifier_script: 'https://www.nanoempireai.com/skillproof/verify_skillproof.py',
        },
        trust_guidance: {
          purpose:
            'Behavioral and static code-surface verification complementing ERC-8004 on-chain identities and A2A Agent Cards. Registration proves identity; SkillProof proves execution boundaries.',
          recommended_minimum_score: 75,
          halt_on_critical_findings: true,
        },
        usage: 'GET /api/skillproof/status?repo=owner/repo (e.g. ?repo=pydantic/pydantic-ai)',
        indexed_repos: audits.map((a) => ({
          repo: a.repo,
          skillproof_score: a.skillproof_score,
          preaudit_id: a.preaudit_id,
          tree_sha: a.tree_sha,
          critical_findings: a.surface_summary?.critical || 0,
          high_findings: a.surface_summary?.high || 0,
          scorecard_url: `https://www.nanoempireai.com/skillproof/repo/${a.repo}`,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-SkillProof-Pubkey': ED25519_PUBKEY_HEX,
          'X-SkillProof-Key-URI': PUBKEY_WELL_KNOWN,
        },
      }
    );
  }

  const match = audits.find((a) => a.repo.toLowerCase() === repoParam.toLowerCase());

  if (!match) {
    return NextResponse.json(
      {
        repo: repoParam,
        status: 'NOT_IN_PREAUDIT_INDEX',
        trust_decision: 'UNVERIFIED_REQUIRE_LIVE_SCAN',
        message:
          'Repository is not in the pre-computed corpus. Calling agents should invoke POST /api/skillproof/preaudit {"repo":"owner/repo"} before delegating credentials or execution authority.',
        live_scan_endpoint: 'https://www.nanoempireai.com/api/skillproof/preaudit',
        verification_authority: {
          kid: 'skillproof-2026-10',
          public_key_hex: ED25519_PUBKEY_HEX,
          pubkey_well_known: PUBKEY_WELL_KNOWN,
        },
      },
      { status: 404 }
    );
  }

  const critCount = match.surface_summary?.critical || 0;
  const highCount = match.surface_summary?.high || 0;
  const score = Number(match.skillproof_score || 0);

  let delegationRecommendation: 'ALLOW_BOUNDED' | 'CONDITIONAL_SANDBOX_ONLY' | 'HALT_HIGH_RISK' = 'ALLOW_BOUNDED';
  if (critCount > 0 || score < 60) {
    delegationRecommendation = 'HALT_HIGH_RISK';
  } else if (highCount > 0 || score < 75) {
    delegationRecommendation = 'CONDITIONAL_SANDBOX_ONLY';
  }

  return NextResponse.json(
    {
      schema: 'https://www.nanoempireai.com/schemas/skillproof-status-v1.json',
      repo: match.repo,
      status: 'INDEXED_PREAUDIT',
      preaudit_id: match.preaudit_id,
      tree_sha: match.tree_sha,
      branch: match.branch,
      skillproof_score: score,
      delegation_recommendation: delegationRecommendation,
      surface_summary: match.surface_summary,
      governance_gaps: match.governance_gaps || [],
      code_surface_findings: match.code_surface_findings || [],
      verification_authority: {
        issuer: 'Nano Empire AI',
        algorithm: 'Ed25519',
        kid: 'skillproof-2026-10',
        public_key_hex: ED25519_PUBKEY_HEX,
        pubkey_well_known: PUBKEY_WELL_KNOWN,
      },
      links: {
        human_scorecard: `https://www.nanoempireai.com/skillproof/repo/${match.repo}`,
        svg_badge: `https://www.nanoempireai.com/api/badge/${match.repo}.svg`,
        preaudits_registry: 'https://www.nanoempireai.com/skillproof/preaudits.json',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'X-SkillProof-ID': String(match.preaudit_id),
        'X-SkillProof-Score': String(score),
        'X-SkillProof-Tree-SHA': String(match.tree_sha),
        'X-SkillProof-Pubkey': ED25519_PUBKEY_HEX,
      },
    }
  );
}
