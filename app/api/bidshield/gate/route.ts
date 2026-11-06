import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { NAICS_DATA } from '@/lib/recall-data';

export const dynamic = 'force-dynamic';

interface DisqualifierRule {
  id: string;
  severity: 'FATAL' | 'HIGH' | 'MEDIUM';
  clause_type: string;
  pattern: RegExp;
  exposure_usd: number;
  remediation: string;
}

const DISQUALIFIER_RULES: DisqualifierRule[] = [
  {
    id: 'TRAP-SITE-VISIT',
    severity: 'FATAL',
    clause_type: 'Mandatory Site Visit / Bidders Conference',
    pattern: /\b(mandatory\s+(site\s+visit|walk[- ]?through|bidders?\s+conference|pre[- ]?bid\s+meeting)|attendance\s+is\s+mandatory)\b/i,
    exposure_usd: 15000,
    remediation: 'Verify signed attendance sheet receipt before allocating bid preparation labor; absence is an automatic administrative rejection.',
  },
  {
    id: 'TRAP-SECURITY-CLEARANCE',
    severity: 'FATAL',
    clause_type: 'Facility / Personnel Security Clearance Gate',
    pattern: /\b(secret\s+clearance|top\s+secret|facility\s+security\s+clearance|fsc|reliability\s+status|cismp|fedramp\s+high|fisma)\b/i,
    exposure_usd: 45000,
    remediation: 'Confirm active clearance sponsorship at time of bid closing (not post-award) unless solicitation explicitly permits post-award sponsorship.',
  },
  {
    id: 'TRAP-BONDING-SURETY',
    severity: 'HIGH',
    clause_type: 'Performance & Payment Bonding / Surety Mandate',
    pattern: /\b(performance\s+bond|payment\s+bond|bid\s+bond|surety\s+company|letter\s+of\s+credit|100%\s+bond)\b/i,
    exposure_usd: 25000,
    remediation: 'Lock surety capacity and countersigned bid bond Annex prior to submission deadline.',
  },
  {
    id: 'TRAP-LIQUIDATED-DAMAGES',
    severity: 'HIGH',
    clause_type: 'Uncapped or Daily Liquidated Damages',
    pattern: /\b(liquidated\s+damages|penalty\s+per\s+calendar\s+day|delay\s+damages|consequential\s+damages)\b/i,
    exposure_usd: 35000,
    remediation: 'Model schedule buffer and cap exposure in pricing contingency; submit formal Q&A clarification if daily penalty exceeds margin.',
  },
  {
    id: 'TRAP-DOMESTIC-SOURCING',
    severity: 'HIGH',
    clause_type: 'Buy American / Trade Agreement / Prevailing Wage',
    pattern: /\b(buy\s+american|baa|taa\s+compliant|davis[- ]?bacon|prevailing\s+wage|certified\s+payroll|canadian\s+content\s+policy)\b/i,
    exposure_usd: 20000,
    remediation: 'Audit OEM bill-of-materials origin and Davis-Bacon / prevailing wage labor rates before locking fixed-price schedule.',
  },
  {
    id: 'TRAP-INSURANCE-INDEMNITY',
    severity: 'MEDIUM',
    clause_type: 'Professional Liability / Errors & Omissions / Cyber Indemnity',
    pattern: /\b(errors\s+and\s+omissions|e&o|professional\s+liability|umbrella\s+liability|additional\s+insured|waiver\s+of\s+subrogation)\b/i,
    exposure_usd: 10000,
    remediation: 'Confirm current Certificate of Insurance (COI) limits match solicitation minimums prior to signing.',
  },
];

export async function GET() {
  return NextResponse.json({
    schema: 'https://www.nanoempireai.com/schemas/bidshield-gate-v1.json',
    name: 'BidShield Pre-Action Compliance Gate',
    purpose:
      'Machine-readable pre-bid and pre-mandate compliance gate for AP2 Human-Not-Present workflows, Mastercard AP4M spend controls, and federal RFP triage (CanadaBuys / SAM.gov).',
    usage: {
      method: 'POST',
      endpoint: 'https://www.nanoempireai.com/api/bidshield/gate',
      body_example: {
        solicitation_text: 'Mandatory site visit required on Tuesday. Contractor must provide 100% performance bond and comply with Davis-Bacon wages.',
        naics_code: '238220',
        estimated_contract_value_usd: 250000,
      },
    },
    supported_naics_hubs: Object.keys(NAICS_DATA),
    human_tiers: {
      tier_1_urgent_triage: { price_usd: 99, turnaround: '24 Hours', url: 'https://www.nanoempireai.com/bidshield/triage' },
      tier_2_full_matrix: { price_usd: 249, turnaround: '48 Hours', url: 'https://www.nanoempireai.com/bidshield' },
      tier_3_multidoc_suite: { price_usd: 499, turnaround: '72 Hours', url: 'https://www.nanoempireai.com/bidshield' },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body.solicitation_text || body.text || body.description || '').trim();
    const naicsCode = String(body.naics_code || body.naics || '').trim();
    const contractValue = Number(body.estimated_contract_value_usd || 100000);

    if (!text) {
      return NextResponse.json(
        {
          error: 'Missing solicitation_text or description in POST body.',
          example: {
            solicitation_text: 'Bidders must attend the mandatory site visit and hold active Secret clearance.',
            naics_code: '238220',
          },
        },
        { status: 400 }
      );
    }

    const triggeredTraps = DISQUALIFIER_RULES.filter((rule) => rule.pattern.test(text)).map((r) => ({
      id: r.id,
      severity: r.severity,
      clause_type: r.clause_type,
      estimated_jev_exposure_usd: r.exposure_usd,
      remediation: r.remediation,
    }));

    const naicsProfile = naicsCode && NAICS_DATA[naicsCode] ? NAICS_DATA[naicsCode] : null;
    const fatalCount = triggeredTraps.filter((t) => t.severity === 'FATAL').length;
    const highCount = triggeredTraps.filter((t) => t.severity === 'HIGH').length;

    let gateDecision: 'PASS_PRELIMINARY' | 'CONDITIONAL_HUMAN_REVIEW' | 'HALT_FATAL_DISQUALIFIER' = 'PASS_PRELIMINARY';
    let riskScore = 15;

    if (fatalCount > 0) {
      gateDecision = 'HALT_FATAL_DISQUALIFIER';
      riskScore = Math.min(98, 65 + fatalCount * 15 + highCount * 8);
    } else if (highCount > 0) {
      gateDecision = 'CONDITIONAL_HUMAN_REVIEW';
      riskScore = Math.min(85, 35 + highCount * 15);
    }

    const totalJevExposure = triggeredTraps.reduce((acc, t) => acc + t.estimated_jev_exposure_usd, 0);
    const gateHash = crypto
      .createHash('sha256')
      .update(`${naicsCode}:${text.slice(0, 500)}:${gateDecision}`)
      .digest('hex')
      .slice(0, 16)
      .toUpperCase();

    return NextResponse.json(
      {
        schema: 'https://www.nanoempireai.com/schemas/bidshield-gate-v1.json',
        gate_id: `BSG-${gateHash}`,
        timestamp: new Date().toISOString(),
        gate_decision: gateDecision,
        ap2_mandate_recommendation:
          gateDecision === 'PASS_PRELIMINARY'
            ? 'ALLOW_AUTONOMOUS_PROCEED'
            : 'REQUIRE_HUMAN_PRESENT_MANDATE_SIGNATURE',
        risk_score_0_100: riskScore,
        quantified_decision_exposure_jev_usd: totalJevExposure,
        contract_value_evaluated_usd: contractValue,
        naics_context: naicsProfile
          ? {
              code: naicsCode,
              title: naicsProfile.title,
              sector_typical_clauses: naicsProfile.typicalClauses,
              hub_url: `https://www.nanoempireai.com/bidshield/naics/${naicsCode}`,
            }
          : null,
        fatal_and_high_traps_detected: triggeredTraps,
        next_actions: {
          free_interactive_triage: 'https://www.nanoempireai.com/bidshield/triage',
          urgent_24h_human_verified_triage_usd_99: 'https://www.nanoempireai.com/bidshield',
          full_48h_compliance_matrix_usd_249: 'https://www.nanoempireai.com/bidshield',
        },
      },
      {
        headers: {
          'X-BidShield-Gate-ID': `BSG-${gateHash}`,
          'X-BidShield-Decision': gateDecision,
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
