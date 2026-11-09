<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nano Empire AI (`nanoempireai.com`) — Agent Engineering & Astryx Design System Rules

## 1. The Deterministic Verification Layer (Architectural Invariant)

> **Deterministic verification layer: SkillProof and BidShield return rule-based, reproducible outcomes—not probabilistic LLM judgments. Identity proves who; settlement moves money; SkillProof and BidShield prove whether the action is safe and compliant before spend or delegation occurs.**

```text
Identity (ERC-8004 / A2A Agent Card)  →  WHO is calling
         ↓
Deterministic Verification Layer      →  MAY THEY PROCEED? (Reproducible, rule-based, non-LLM)
  • SkillProof (/api/skillproof/status) : Static + behavioral analysis pinned to Git tree_sha + Ed25519 signature over RFC 8785 (JCS)
  • BidShield  (/api/bidshield/gate)    : Bidirectional deontic rule engine on fatal clauses + quantified Decision Exposure (JEV)
         ↓
Settlement (x402 / AP4M / AP2 / Stripe) →  Payment & authorization under verified boundaries
```

| Property | `SkillProof` | `BidShield` | `RecallRadar` |
| :--- | :--- | :--- | :--- |
| **Input** | Repo URL / Git commit (`owner/repo`) | Solicitation text + NAICS + contract value | Product UPC, brand, model, or 50-SKU CSV |
| **Process** | 6-vector AST + governance scan pinned to `tree_sha` | Deterministic deontic regex/negation kernel | Normalized multi-agency lookup across **`46,642`** CPSC, FDA & Health Canada records |
| **Output** | Fixed score + `ALLOW_BOUNDED` / `CONDITIONAL_SANDBOX_ONLY` / `HALT_HIGH_RISK` + signed Trust Manifest | Fixed `PASS_PRELIMINARY` / `CONDITIONAL_HUMAN_REVIEW` / `HALT_FATAL_DISQUALIFIER` + quantified JEV | Deterministic match schedule + Ed25519-Signed Recall Match Report |
| **Non-Repudiation** | Ed25519 (`kid: skillproof-2026-10`) over RFC 8785 (JCS) canonical JSON | Machine-readable JSON gate + REA SHA-256 commitment | Stateless HMAC-SHA256 / Ed25519 signed receipt |

---

## 2. Astryx Proof-Native Component Pack (`@/components/astryx/ProofNativePack`)

Coding agents MUST NOT invent raw-div compliance tables, fake cryptographic badges, or unstyled settlement receipts. Always import from [`components/astryx/ProofNativePack.tsx`](file:///C:/Users/robla/empire/nanoempire-web/components/astryx/ProofNativePack.tsx) or query the MCP tool `astryx_compose_proof_ui` (`POST /api/mcp`, manifest at [`public/.well-known/astryx-manifest.json`](file:///C:/Users/robla/empire/nanoempire-web/public/.well-known/astryx-manifest.json)):

1. **`<TrustManifestCard />`**: Renders a commit-pinned `SkillProof` Trust Manifest (`manifestId`, `repo`, `commitTreeSha`, `skillproofScore`, `delegationPolicy`, `payloadSha256`, `canonicalization="RFC-8785-JCS"`).
2. **`<SettlementReceipt />`**: Renders an `x402-v2`, `stripe-checkout`, or `ap4m-voucher` receipt with mandatory `ledgerMode` honesty (`"operator_self_test"` vs `"production_settled"`).
3. **`<ComplianceMatrix />`**: Renders a deterministic `BidShield` gate (`PASS_PRELIMINARY` / `CONDITIONAL_HUMAN_REVIEW` / `HALT_FATAL_DISQUALIFIER`), `ap2MandateRecommendation`, and `jevExposureUsd`.
4. **`<RecallDeltaTable />`**: Renders matched safety enforcement notices across the `46,642` CPSC, FDA, and Health Canada records.

### Trust-Adaptive Theme Tokens (`resolveTrustTheme`)
- **`sovereign`** (`score >= 75` / `ALLOW_BOUNDED` / `PASS_PRELIMINARY`): Border `#3ddc97`, Accent `#00B5E2`, Surface `#07090D`.
- **`sandbox`** (`score 60..74` / `CONDITIONAL_SANDBOX_ONLY` / `CONDITIONAL_HUMAN_REVIEW`): Border `#FF7B00`, Accent `#FF7B00`, Surface `#0b0d13`.
- **`quarantine`** (`score < 60` / `HALT_HIGH_RISK` / `HALT_FATAL_DISQUALIFIER`): Border `#f43f5e`, Accent `#fb7185`, Surface `#12080c`.

---

## 3. Canonical Data, Pricing & Ledger Locks (Zero Drift Allowed)

1. **RecallRadar Corpus Count:** Always cite **`46,642 normalized CPSC, FDA & Health Canada recall records`**. Never re-introduce the stale `21,812` September snapshot split.
2. **RecallRadar Locked Pricing:**
   - Machine `x402` on Base (`eip155:8453`): `$0.05` USDC (feed) / `$0.10` USDC (match)
   - Self-Serve Signed Recall Match Report: `$30` USD (Stripe)
   - RecallGuard Shield (Continuous Monitoring): `$99/mo`
   - Enterprise Data License: `$2,400/yr` USD
3. **BidShield Locked Price Ladder:**
   - **`$299` USD** (Pilot) · **`$499` USD** (Standard 19-Column Compliance Matrix) · **`$999` USD** (Full Multi-Volume Proposal Audit). Never quote `$149` or `$99/$249`.
4. **SkillProof Status:** Pre-audit index (`28` repositories) and `/api/skillproof/status` are live and free for A2A/MCP verification; commercial paid audit tier remains parked pending operator ruling.
5. **Ledger Honesty:** `0` outside paying customers; `1` operator self-test settled on Base block `51961194` (`tx: 0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999`).
