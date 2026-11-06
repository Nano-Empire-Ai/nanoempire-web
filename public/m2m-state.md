# The Machine Economy: State of the Stack (November 6, 2026)

*The rails are real. The buyers and the autonomous volume are early. While the agent-payment stack is now institutionalized across composable identity, communication, and settlement layers, measured machine spend remains overwhelmingly sub-dollar to sub-cent micro-traffic ($0.05–$0.30 averages, with >87% under $0.10 for compute, APIs, and tools), and institutional resistance from banks and retailers underscores that **identity-to-trust translation, non-repudiable authorization, and pre-action compliance gates—not raw payment rails—are the binding constraints to scale.** Nano Empire sits in the tollbooth and cryptographic proof layer (`SkillProof` + `BidShield` + `RecallRadar`), not the hype layer.*

---

## 1. Operating Rule: The Composable Protocol Stack (Nov 6, 2026)
No single standard governs autonomous commerce. Open governance has converged on communication (`A2A` / `MCP` under the **Agentic AI Foundation / AAIF**, expanded to 10 projects and ~305 members at Oct 2026 AGNTCon) and settlement (`x402` under the Linux Foundation), while authorization, identity, and pre-action compliance remain fragmented across FIDO, card networks, and on-chain registries:

| Layer | Protocol(s) & Governance | Core Mechanism | Production Reality (As of Nov 6, 2026) |
|:---|:---|:---|:---|
| **1. Tools & Context** | **MCP** (Anthropic → **AAIF** / Linux Foundation) | Connects agents to tools, data, and runtime resources. | Co-hosted with A2A in AAIF (~305 members); tens of thousands of active servers deployed; primary attack surface for tool poisoning and shell/env sinks. |
| **2. Discovery & Comms** | **A2A v1.0** (Google → **AAIF** / Linux Foundation) | Signed Agent Cards (`/.well-known/agent-card.json`), multi-binding, multi-tenancy, capability discovery. | v1.0 stable (Mar 2026); joined AAIF Aug 2026; **150+ supporting orgs** across Google, Microsoft, AWS, and SAP (inbound A2A GA Oct 2026). |
| **3. On-Chain Identity** | **ERC-8004** (EVM / Base dominant, 20+ chains) | ERC-721 registration files linking to A2A Agent Cards and MCP endpoints; reputation & validation registries. | **~2M+ registered identities** by early Nov 2026. **Critical caveat:** bulk/placeholder minting, transferable tokens (ownership ≠ continuous control), and gamed open ratings mean **registration ≠ behavioral trust**. |
| **4. Authorization & Mandates** | **AP2 v0.2** (Google → **FIDO Alliance**), **Visa TAP**, **Mastercard Verifiable Intent** | Cryptographically signed Checkout Mandates + linked Payment Mandates (SD-JWT / VCs); RFC 9421 HTTP Message Signatures (`browse` vs. `pay` tags). | AP2 v0.2 donated to FIDO (Apr 28, 2026) supporting **Human Present** and **Human Not Present** modes for non-repudiable audit trails. |
| **5. Conversational Checkout** | **ACP** (OpenAI + Stripe), **UCP** (Google + Shopify/Etsy), **Poppy / PAP** (Sierra + Meta) | Shared Payment Tokens for scoped agent checkout; authenticated personal agent channels (`/.well-known/poppy.json`). | ACP in beta; **Visa Agentic Commerce Benchmark (Nov 5, 2026)** shows leading models pass only **~57% of realistic shopping scenarios** (best 82%, worst 29%); only 23% of U.S. consumers trust AI with payments. |
| **6. Settlement & Metering** | **x402 v2** (Linux Foundation x402 Foundation), **MPP** (Stripe + Tempo), **Mastercard AP4M** | HTTP 402 `PAYMENT-REQUIRED` / `PAYMENT-SIGNATURE` headers (x402 v2), streaming/metered sessions (MPP), and off-chain budget vouchers (AP4M). | **x402 Foundation** operational July 14, 2026 (**Michael Hursta** named ED Oct 1, 2026; **50+ members**). **AWS Bedrock AgentCore Payments** GA with x402; **Cloudflare Monetization Gateway** in closed beta. |

---

## 2. Core Protocols, Card Frameworks & Empirical Volumes (Nov 6, 2026)

### x402 Foundation (Linux Foundation) — Spec v2 & Filtered Volume Reality
- **Governance & Membership:** Operational July 14, 2026 (contributed by Coinbase); **Michael Hursta** appointed Executive Director on **October 1, 2026**. Backed by **50+ members** including Premier/tier leaders Visa, Mastercard, Stripe, Adyen, American Express, Google, AWS, Cloudflare, Coinbase, Circle, Shopify, Ripple, and the Solana/Stellar foundations.
- **Spec v2 & Ecosystem Footprint:** Standardizes `PAYMENT-REQUIRED` and `PAYMENT-SIGNATURE` headers with an active Identity Working Group. **~1,266 services** listed on `x402-list` as of **November 6, 2026**. X Pay raised $1M for dedicated x402 infrastructure.
- **Headline vs. Filtered Volume (Zero-Hype Forensics):**
  - **Cumulative Headline:** **~196M lifetime transactions / >$42M gross volume** (Fireblocks as of Nov 1, 2026; early peaks heavily inflated by `PING` token mint/speculation loops).
  - **Filtered Organic Reality:** Allium Q3 2026 tracks **~68.3M agent-classified payments totaling $3.7M (~$0.05 average)**. Chainalysis/Base data shows **138M+ cumulative transactions with >87% under $0.10**. October 2026 organic production utility tracked **~5.1M transactions / ~$274k USD**.
  - **TRM Labs Wash Filter:** Only **0.6%–7.5%** of screened on-chain volume is plausibly autonomous AI-agent initiated after stripping self-payments and bulk script loops.
  - **Ephemeral Task Wallets:** Median time from wallet funding to first `x402` payment collapsed to **18 minutes in Q3 2026** (down from 73 days in late 2025)—confirming that orchestrators spin up just-in-time task wallets rather than holding large treasury balances in hot agent keys.

### Card Network & Cloud Moves (Mastercard AP4M, Visa TAP, Stripe MPP, AWS Bedrock)
- **Mastercard Agent Pay for Machines (AP4M):**
  - Launched June 10, 2026; **developer APIs, SDKs, and sandbox opened October 2026** (announced at Cloudflare Connect) + strategic **Mastercard–OpenAI partnership**.
  - Builds directly on `x402`: Enterprise sets spend budget/limits → server returns `HTTP 402` challenge → agent issues an **off-chain digitally signed payment voucher** → provider verifies and delivers immediately → bulk settlement clears later across cards, bank accounts, or stablecoins across **30+ partners** (Adyen, Cloudflare, Coinbase, Stripe, Tempo, Ant International, BVNK).
- **Visa Intelligent Commerce & Trusted Agent Protocol (TAP):**
  - Uses **RFC 9421 HTTP Message Signatures** (`browse` vs. `pay` tags, nonces, short validity windows) + Agent Directory credentialing. **~50 AI partners in production** (including live B2B invoice pilots with **BILL and Billtrust** and Anthropic collaboration).
  - **Nov 5, 2026 Benchmark Signal:** Visa’s Agentic Commerce Benchmark revealed top frontier models succeed in only **~57% of realistic multi-constraint shopping/procurement scenarios** (ranging from 29% to 82%), proving deterministic pre-action verification is mandatory before payment execution.
- **MPP (Machine Payments Protocol — Stripe + Tempo):**
  - Launched March 18, 2026 alongside Tempo mainnet; pairs with Stripe’s acquisition of **OpenRouter (~$7.5–8B, Aug 2026)** to meter streaming/recurring inference and tool sessions across Tempo stablecoins, Stripe/Visa card rails, and Lightning.
- **AWS Bedrock AgentCore Payments:**
  - Reached **General Availability (GA)** with native `x402` support, bringing enterprise AWS workloads directly onto HTTP 402 settlement rails.

---

## 3. The Missing Layer: Why Identity (`ERC-8004` / `A2A`) + Rails (`x402`) Are Not Enough

The November 2026 landscape exposes two structural gaps where Nano Empire operates:

### Gap 1: Registration (`ERC-8004`) ≠ Behavioral Trustworthiness (`SkillProof`)
- **The Problem:** Over **2 million `ERC-8004` agent identities** have been minted across Base and 20+ chains linking to A2A Agent Cards and MCP servers. However, tokens are bulk-minted, transferable (token ownership ≠ continuous code control), and reputation scores are easily gamed by sybil self-ratings. Worse, `x402` is pure settlement—it guarantees the server got paid $0.05, not that the MCP tool won't exfiltrate `process.env` or execute an unguarded shell sink.
- **The Nano Empire Solution (`SkillProof`):**
  - **Adversarial Behavioral Verification + Ed25519 Trust Manifests:** Pinned to the exact repository commit `tree_sha` (SHA-256) and signed by Nano Empire’s offline-verifiable Ed25519 authority (`/.well-known/skillproof-pubkey.json`).
  - **Live Pre-Audit Index (`/skillproof/preaudits.json` & `GET /api/skillproof/status`):** Line-cited static and behavioral scorecards across flagship MCP repositories (`23 repos` indexed as of Nov 6, 2026, with automated quarantine gates for unverified aggregator repos).
  - **Complementary to `ERC-8004` & `A2A`:** An A2A Agent Card or ERC-8004 token tells an orchestrator *who* an agent claims to be; a **SkillProof Trust Manifest** proves *how that code behaves under adversarial injection, path-traversal, and egress testing*.

### Gap 2: Unbounded Execution (`Human-Not-Present`) Needs Pre-Action Compliance Gates (`BidShield`)
- **The Problem:** Both **FIDO AP2 (`Human-Not-Present` mode)** and **Mastercard AP4M** require strict pre-authorized policy constraints before an agent commits capital or signs a binding commercial/federal tender. With frontier models failing ~43% of complex multi-constraint tasks (Visa Nov 5 Benchmark) and Tier-1 Canadian/U.S. banks (RBC, TD, CIBC, BMO) blocking unverified agents, enterprises cannot let agents bid or settle blindly.
- **The Nano Empire Solution (`BidShield` Pre-Action Compliance Gate):**
  - **Deontic Solicitation & Policy Gate (`POST /api/bidshield/gate` & `/bidshield`):** Evaluates federal tenders (CanadaBuys, SAM.gov) and commercial task descriptions across **8 NAICS compliance hubs** (`238220`, `561720`, `236220`, `541330`, `561210`, `238210`, `562111`, `541512`) before bid submission or mandate signing.
  - **Machine-Readable Output:** Returns deterministic `PASS` / `CONDITIONAL_REVIEW` / `HALT_FATAL_TRAP` status, quantified **Decision Exposure (JEV)**, mandatory annex checklists, and fatal disqualifier clauses (bonding, security clearance, Buy American / Davis-Bacon, liquidated damages).

---

## 4. Direct Implementation Architecture on `nanoempireai.com` (Live Nov 6, 2026)

| Surface | URL / Endpoint | Protocol / Standard Alignment | Status & Pricing Truth |
|:---|:---|:---|:---|
| **A2A Agent Card** | `/.well-known/agent-card.json` | Google / AAIF A2A v1.0 + AP2 / SK Telecom governance bounds | **LIVE** (Lists `RecallGuard`, `SkillProof`, `BidShield`, Ed25519 pubkey, and $10/day autonomous spend kill-switch) |
| **Ed25519 Public Key** | `/.well-known/skillproof-pubkey.json` | Offline verification key (`kid: skillproof-2026-10`) for SkillProof Trust Manifests | **LIVE** (`69b8d23e...c1da3f82`, with explicit key revocation ledger) |
| **SkillProof Status API** | `GET /api/skillproof/status?repo=owner/repo` | Machine-readable JSON lookup of latest `skillproof_score`, `tree_sha`, and manifest status (complements `ERC-8004` / `A2A`) | **LIVE** (Free JSON lookup over 23 pre-audited repos + on-demand scanner; optional `x402` attestation header) |
| **BidShield Pre-Action Gate** | `POST /api/bidshield/gate` | Pre-bid / pre-mandate compliance gate for `AP2` Human-Not-Present & B2B procurement workflows | **LIVE** (Free preliminary JSON gate; `$99` 24h Urgent Triage / `$249` 48h Full Matrix / `$499` 72h Multi-Doc Suite) |
| **Streamable HTTP MCP** | `POST /api/mcp` | AAIF MCP JSON-RPC (`2024-11-05`) exposing 4 tools (`recallradar_check_product`, `recallradar_audit_manifest_info`, `skillproof_verify_repo`, `bidshield_triage_info`) | **LIVE** |
| **RecallGuard x402 API** | `https://recallguard-api.vercel.app/api/v1/match` | Linux Foundation `x402` on Base USDC (`0x8335...2913`) | **LIVE** (`$0.05` feed / `$0.10` match; **1 operator self-test settled on Base block `51961194`, 0 outside paying customers**) |
| **RecallRadar Human Portal** | `/recall-report` & `/recalls` | 46,642 US CPSC/FDA & Health Canada records + Unilateral CPSC Warnings | **LIVE** (`$30 USD` instant signed PDF compliance report; `$99 CAD/mo` continuous monitoring; `$2,400 USD/yr` Sovereign License) |
