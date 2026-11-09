import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { NAICS_DATA } from '@/lib/recall-data';
import { signAttestation } from '@/lib/attestation';

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
    pattern: /\b(mandatory\s+(site\s+visit|walk[- ]?through|bidders?\s+conference|pre[- ]?bid\s+meeting)|attendance\s+is\s+mandatory)\b/gi,
    exposure_usd: 15000,
    remediation: 'Verify signed attendance sheet receipt before allocating bid preparation labor; absence is an automatic administrative rejection.',
  },
  {
    id: 'TRAP-SECURITY-CLEARANCE',
    severity: 'FATAL',
    clause_type: 'Facility / Personnel Security Clearance Gate',
    pattern: /\b(secret\s+clearance|top\s+secret|facility\s+security\s+clearance|fsc|reliability\s+status|cismp|fedramp\s+high|fisma)\b/gi,
    exposure_usd: 45000,
    remediation: 'Confirm active clearance sponsorship at time of bid closing (not post-award) unless solicitation explicitly permits post-award sponsorship.',
  },
  {
    id: 'TRAP-BONDING-SURETY',
    severity: 'HIGH',
    clause_type: 'Performance & Payment Bonding / Surety Mandate',
    pattern: /\b(performance\s+bond|payment\s+bond|bid\s+bond|surety\s+company|letter\s+of\s+credit|100%\s+bond)\b/gi,
    exposure_usd: 25000,
    remediation: 'Lock surety capacity and countersigned bid bond Annex prior to submission deadline.',
  },
  {
    id: 'TRAP-LIQUIDATED-DAMAGES',
    severity: 'HIGH',
    clause_type: 'Uncapped or Daily Liquidated Damages',
    pattern: /\b(liquidated\s+damages|penalty\s+per\s+calendar\s+day|delay\s+damages|consequential\s+damages)\b/gi,
    exposure_usd: 35000,
    remediation: 'Model schedule buffer and cap exposure in pricing contingency; submit formal Q&A clarification if daily penalty exceeds margin.',
  },
  {
    id: 'TRAP-DOMESTIC-SOURCING',
    severity: 'HIGH',
    clause_type: 'Buy American / Trade Agreement / Prevailing Wage',
    pattern: /\b(buy\s+american|baa|taa\s+compliant|davis[- ]?bacon|prevailing\s+wage|certified\s+payroll|canadian\s+content\s+policy)\b/gi,
    exposure_usd: 20000,
    remediation: 'Audit OEM bill-of-materials origin and Davis-Bacon / prevailing wage labor rates before locking fixed-price schedule.',
  },
  {
    id: 'TRAP-INSURANCE-INDEMNITY',
    severity: 'MEDIUM',
    clause_type: 'Professional Liability / Errors & Omissions / Cyber Indemnity',
    pattern: /\b(errors\s+and\s+omissions|e&o|professional\s+liability|umbrella\s+liability|additional\s+insured|waiver\s+of\s+subrogation)\b/gi,
    exposure_usd: 10000,
    remediation: 'Confirm current Certificate of Insurance (COI) limits match solicitation minimums prior to signing.',
  },
];

/**
 * Bidirectional Deontic Negation Filter (+/- 220 chars inside the same clause/sentence).
 * Prevents false-positive HALT gates on federal boilerplate disclaimers like:
 *   "There is no security clearance requirement" or "A mandatory site visit is not required."
 */
const NEGATION_CUES = /\b(no\s+(?:security|mandatory|site\s+visit|bonding|bid\s+bond|performance\s+bond)|not\s+(?:required|applicable|mandatory)|is\s+optional|waived|none\s+required|without\s+a\s+mandatory|does\s+not\s+require)\b/i;

function hasUnnegatedMatch(text: string, regex: RegExp): { matched: boolean; snippet: string | null } {
  const clone = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
  let m: RegExpExecArray | null;
  while ((m = clone.exec(text)) !== null) {
    const start = Math.max(0, m.index - 120);
    const end = Math.min(text.length, m.index + m[0].length + 120);
    const windowText = text.slice(start, end);
    // Split on sentence boundaries so a negation in a prior sentence doesn't mask a real amendment override
    const sentenceParts = windowText.split(/(?<=[.!?])\s+/);
    const matchingSentence = sentenceParts.find((s) => new RegExp(regex.source, 'i').test(s)) || windowText;
    if (!NEGATION_CUES.test(matchingSentence)) {
      return { matched: true, snippet: matchingSentence.trim().slice(0, 180) };
    }
  }
  return { matched: false, snippet: null };
}

export async function GET() {
  return NextResponse.json({
    schema: 'https://www.nanoempireai.com/schemas/bidshield-gate-v1.json',
    name: 'BidShield Pre-Action Compliance Gate (Deterministic Deontic Kernel v2)',
    purpose:
      'Machine-readable pre-bid and pre-mandate compliance gate for AP2 Human-Not-Present workflows, Mastercard AP4M spend controls, and federal RFP triage (CanadaBuys / SAM.gov). Features bidirectional deontic negation filtering and Ed25519 attestation.',
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
      tier_1_pilot: { price_usd: 299, name: 'BidShield Compliance Pilot', turnaround: '24 Hours', url: 'https://www.nanoempireai.com/bidshield' },
      tier_2_standard_matrix: { price_usd: 499, name: 'Standard 19-Column Compliance Matrix', turnaround: '48 Hours', url: 'https://www.nanoempireai.com/bidshield' },
      tier_3_full_suite: { price_usd: 999, name: 'Full Multi-Volume Proposal & Addenda Audit', turnaround: '72 Hours', url: 'https://www.nanoempireai.com/bidshield' },
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

    const triggeredTraps: Array<{
      id: string;
      severity: 'FATAL' | 'HIGH' | 'MEDIUM';
      clause_type: string;
      estimated_jev_exposure_usd: number;
      evidence_snippet: string | null;
      remediation: string;
    }> = [];

    for (const rule of DISQUALIFIER_RULES) {
      const check = hasUnnegatedMatch(text, rule.pattern);
      if (check.matched) {
        triggeredTraps.push({
          id: rule.id,
          severity: rule.severity,
          clause_type: rule.clause_type,
          estimated_jev_exposure_usd: rule.exposure_usd,
          evidence_snippet: check.snippet,
          remediation: rule.remediation,
        });
      }
    }

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

    // Wissner-Gross Causal Entropy / Future Freedom Telemetry (F = T * grad S_tau)
    const optionalityDeltaBps = Math.max(
      -10000,
      Math.min(10000, 4500 - fatalCount * 4500 - highCount * 2000)
    );
    const causalEntropyScoreBps = Math.max(0, Math.min(10000, 5000 + Math.round(optionalityDeltaBps / 2)));

    // Deterministic canonical commitment over full input + rule evaluation (reproducible across identical calls)
    const deterministicCore = {
      causal_entropy_score_bps: causalEntropyScoreBps,
      contract_value_evaluated_usd: contractValue,
      fatal_and_high_traps_detected: triggeredTraps.map((t) => t.id),
      gate_decision: gateDecision,
      naics_code: naicsCode || null,
      optionality_delta_bps: optionalityDeltaBps,
      quantified_decision_exposure_jev_usd: totalJevExposure,
      risk_score_0_100: riskScore,
      text_sha256: crypto.createHash('sha256').update(text, 'utf8').digest('hex'),
    };
    const jcsBytes = Buffer.from(JSON.stringify(deterministicCore), 'utf8');
    const reaCommitmentSha256 = crypto.createHash('sha256').update(jcsBytes).digest('hex');
    const gateHash = reaCommitmentSha256.slice(0, 16).toUpperCase();
    const attestation = signAttestation(jcsBytes);

    return NextResponse.json(
      {
        schema: 'https://www.nanoempireai.com/schemas/bidshield-gate-v1.json',
        gate_id: `BSG-${gateHash}`,
        rea_commitment_sha256: reaCommitmentSha256,
        gate_decision: gateDecision,
        ap2_mandate_recommendation:
          gateDecision === 'PASS_PRELIMINARY'
            ? 'ALLOW_AUTONOMOUS_PROCEED'
            : 'REQUIRE_HUMAN_PRESENT_MANDATE_SIGNATURE',
        risk_score_0_100: riskScore,
        quantified_decision_exposure_jev_usd: totalJevExposure,
        causal_entropy_telemetry: {
          optionality_delta_bps: optionalityDeltaBps,
          causal_entropy_score_bps: causalEntropyScoreBps,
          reversibility_class:
            gateDecision === 'PASS_PRELIMINARY'
              ? 'REVERSIBLE_PRE_BID_EXPLORATION'
              : 'IRREVERSIBLE_DISQUALIFIER_OR_BOND_TRAP',
          future_freedom_verdict:
            optionalityDeltaBps >= 0
              ? 'EXPANDS_ACCESSIBLE_FUTURES'
              : 'CONTRACTS_OPTIONALITY_HALT_BEFORE_BID_PREP',
        },
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
        attestation,
        next_actions: {
          free_interactive_triage: 'https://www.nanoempireai.com/bidshield/triage',
          pilot_stop_go_audit_usd_299: 'https://www.nanoempireai.com/bidshield',
          standard_19_col_matrix_usd_499: 'https://www.nanoempireai.com/bidshield',
          full_proposal_suite_usd_999: 'https://www.nanoempireai.com/bidshield',
        },
      },
      {
        headers: {
          'X-BidShield-Gate-ID': `BSG-${gateHash}`,
          'X-BidShield-Decision': gateDecision,
          'X-BidShield-REA-SHA256': reaCommitmentSha256,
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
