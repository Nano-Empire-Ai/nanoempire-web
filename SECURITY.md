# Security & Cryptographic Attestation Policy (`Nano-Empire-Ai/nanoempire-web`)

## 1. Vulnerability Disclosure & Reporting
Nano Empire AI takes the security of our autonomous verification rails (`SkillProof`, `BidShield`, `RecallRadar`) and multi-rail settlement endpoints (`x402` Base USDC + Stripe) seriously.

- **Security Contact:** `security@nanoempireai.com`
- **Well-Known Public Key Registry:** `https://www.nanoempireai.com/.well-known/skillproof-pubkey.json`
- **Active Signing Key (`kid: skillproof-2026-10`):**
  - **Algorithm:** `Ed25519`
  - **Public Key (Hex):** `69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82`

## 2. External Cryptographic Verification (RFC 8785 JCS + Ed25519)
Because autonomous agents cannot self-certify their own execution boundaries from within (Gödel/Turing undecidability of self-referential halting and safety properties), all SkillProof Trust Manifests are bound to an immutable Git `commit_tree_sha`, canonicalized via **RFC 8785 (JSON Canonicalization Scheme)**, and signed with `Ed25519`.

Verify any SkillProof Trust Manifest offline:
```bash
python public/skillproof/verify_skillproof.py public/skillproof/manifests/skillproof_08_meta_wearables_mcp.json \
  --pubkey-hex 69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82
```

## 3. Scope & Invariants
1. **Strict Payment Verification:** `/api/recall-report/unlock` enforces server-side `stripe.checkout.sessions.retrieve(sessionId)` (`payment_status === 'paid'`) or cryptographic HMAC-SHA256 license verification with zero `INTERNAL_TEST_KEY` bypasses.
2. **Stateless Token Integrity:** All license and report unlock tokens use HMAC-SHA256 / AES-256-GCM to prevent cold-start state drift.
3. **Revoked Keys:** Any key listed under `revoked[]` in `/.well-known/skillproof-pubkey.json` (including `c2e72e5b7b05b66838fb911eef0e247be5b64c1d56ef18918f2784ec814f52ca`) must be rejected immediately by all verifiers.
