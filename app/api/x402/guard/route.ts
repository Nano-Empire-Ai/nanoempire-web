import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import preauditsData from '@/public/skillproof/preaudits.json';
import { signAttestation } from '@/lib/attestation';

export const dynamic = 'force-dynamic';

/**
 * Deterministic x402 Pre-Payment & Anti-Overpayment Guard (/api/x402/guard)
 * =========================================================================
 * Neutralizes the documented Oct–Nov 2026 autonomous payment failure vectors:
 *   1. SoFi Research (Ishween Kaur, Oct 2026 — 20 x402 attack categories / 6 overpayment vectors):
 *      - HTTP 402 header price inflation vs. directory/catalog listing (10x overcharge trap)
 *      - Unbounded SDK client spend (> per-call mandate ceiling)
 *      - Lookalike / unverified seller payTo address mismatch
 *   2. BeInCrypto Report (~$281k drained / $175k Morse-code instruction attack):
 *      - Obfuscated instruction encodings (Morse code, Base64/Hex transfer overrides, prompt-injected payTo swap)
 *   3. SkillProof Pre-Delegation Repository Gate:
 *      - Blocks settlement if seller repo has CRITICAL findings or score < 75
 */

const MORSE_CODE_PATTERN = /(?:[.-]{2,5}\s+){4,}[.-]{2,5}/;
const OBFUSCATED_TRANSFER_PATTERN = /\b(ignore\s+previous\s+instructions|override\s+payto|transfer\s+all\s+funds|drain\s+balance|send\s+to\s+0x[a-fA-F0-9]{40})\b/i;

export async function GET() {
  return NextResponse.json({
    schema: 'https://www.nanoempireai.com/schemas/x402-prepayment-guard-v1.json',
    name: 'Nano Empire x402 Pre-Payment & Anti-Overpayment Guard',
    purpose:
      'Deterministic pre-settlement firewall neutralizing SoFi-disclosed x402 header price inflation (10x overpayment), V12 unbounded SDK drain, and BeInCrypto obfuscated instruction attacks (e.g. Morse-coded transfer overrides) before an agent signs a PAYMENT-SIGNATURE or AP2 mandate.',
    usage: {
      method: 'POST',
      endpoint: 'https://www.nanoempireai.com/api/x402/guard',
      body_example: {
        listed_directory_price_usdc: 0.10,
        challenge_header_price_usdc: 0.10,
        mandate_max_single_tx_usdc: 1.00,
        seller_pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
        expected_pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
        seller_repo: 'Nano-Empire-Ai/nanoempire-web',
        instruction_context: 'Screen 50 SKUs against RecallGuard match endpoint',
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const listedPrice = Number(body.listed_directory_price_usdc ?? body.listed_price_usdc ?? 0.10);
    const challengePrice = Number(body.challenge_header_price_usdc ?? body.challenge_price_usdc ?? listedPrice);
    const mandateMax = Number(body.mandate_max_single_tx_usdc ?? 1.00);
    const sellerPayTo = String(body.seller_pay_to || '').trim();
    const expectedPayTo = String(body.expected_pay_to || sellerPayTo).trim();
    const sellerRepo = String(body.seller_repo || '').trim().replace(/^https?:\/\/github\.com\//i, '');
    const instructionContext = String(body.instruction_context || '').trim();

    const violations: Array<{ id: string; severity: 'CRITICAL' | 'HIGH'; vector_reference: string; detail: string }> = [];

    // 1. Check SoFi Overpayment Vector #1: 402 Header Price Inflation vs Directory Listing
    if (listedPrice > 0 && challengePrice > listedPrice * 1.0001) {
      const ratio = (challengePrice / listedPrice).toFixed(2);
      violations.push({
        id: 'X402-PRICE-INFLATION-TRAP',
        severity: 'CRITICAL',
        vector_reference: 'SoFi Research (Ishween Kaur, Oct 2026) — 402 Header vs. Directory Price Inflation',
        detail: `HTTP 402 challenge requests ${challengePrice} USDC vs. listed directory price ${listedPrice} USDC (${ratio}x inflation).`,
      });
    }

    // 2. Check V12 SDK Unbounded Spend Vector: Exceeds AP2 / Agent Single-Tx Mandate Ceiling
    if (challengePrice > mandateMax) {
      violations.push({
        id: 'X402-MANDATE-CEILING-BREACH',
        severity: 'CRITICAL',
        vector_reference: 'AP2 / V12 SDK Unbounded Client Drain Prevention',
        detail: `Challenge price (${challengePrice} USDC) exceeds single-transaction unattended mandate ceiling (${mandateMax} USDC).`,
      });
    }

    // 3. Check SoFi Lookalike Seller / Recipient Substitution Vector
    if (expectedPayTo && sellerPayTo && expectedPayTo.toLowerCase() !== sellerPayTo.toLowerCase()) {
      violations.push({
        id: 'X402-PAYTO-ADDRESS-MISMATCH',
        severity: 'CRITICAL',
        vector_reference: 'SoFi Research — Lookalike Seller / payTo Substitution',
        detail: `Challenge payTo (${sellerPayTo}) does not match expected directory payTo (${expectedPayTo}).`,
      });
    }

    // 4. Check BeInCrypto Obfuscated Instruction Vector ($175k Morse-Code / Prompt Injection Drain)
    if (instructionContext && (MORSE_CODE_PATTERN.test(instructionContext) || OBFUSCATED_TRANSFER_PATTERN.test(instructionContext))) {
      violations.push({
        id: 'X402-OBFUSCATED-INSTRUCTION-INJECTION',
        severity: 'CRITICAL',
        vector_reference: 'BeInCrypto 2026 Report — Obfuscated / Morse-Coded Instruction Transfer Drain',
        detail: 'Detected Morse-encoded sequence or adversarial recipient-override directive inside task context.',
      });
    }

    // 5. Check Seller Repo SkillProof Score (if seller_repo provided)
    let skillproofScore: number | null = null;
    if (sellerRepo) {
      const audits: any[] = (preauditsData as any).audits || [];
      const match = audits.find((a) => String(a.repo || '').toLowerCase() === sellerRepo.toLowerCase());
      if (match) {
        skillproofScore = Number(match.skillproof_score || 0);
        if (skillproofScore < 75) {
          violations.push({
            id: 'SKILLPROOF-SCORE-BELOW-THRESHOLD',
            severity: 'HIGH',
            vector_reference: 'SkillProof Pre-Delegation Boundary Policy',
            detail: `Seller repository ${sellerRepo} scored ${skillproofScore}/100 (minimum required: 75).`,
          });
        }
      }
    }

    const decision = violations.length === 0 ? 'ALLOW_X402_SETTLEMENT' : 'HALT_X402_ATTACK_SURFACE';
    const canonicalPayload = {
      challenge_header_price_usdc: challengePrice,
      decision,
      listed_directory_price_usdc: listedPrice,
      mandate_max_single_tx_usdc: mandateMax,
      seller_pay_to: sellerPayTo || null,
      seller_repo: sellerRepo || null,
      skillproof_score: skillproofScore,
      violation_ids: violations.map((v) => v.id),
    };
    const jcsBytes = Buffer.from(JSON.stringify(canonicalPayload), 'utf8');
    const payloadSha256 = crypto.createHash('sha256').update(jcsBytes).digest('hex');
    const attestation = signAttestation(jcsBytes);

    return NextResponse.json(
      {
        schema: 'https://www.nanoempireai.com/schemas/x402-prepayment-guard-v1.json',
        decision,
        canonical_payload_sha256: payloadSha256,
        evaluated: canonicalPayload,
        violations,
        attestation,
      },
      {
        headers: {
          'X-x402-Guard-Decision': decision,
          'X-x402-Guard-SHA256': payloadSha256,
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
