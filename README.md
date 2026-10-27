# Nano Empire Web (`nanoempireai.com`)

Sovereign web gateway, machine-readable discovery surface (`A2A` / `PAP` / `MCP` / `x402`), and document-defense portal (`RecallRadar`, `BidShield`, `SkillProof`) for autonomous agents and engineering operators.

![Status: Live on Vercel](https://img.shields.io/badge/status-live_production-10b981)
![x402 Rail: Base USDC (Self-Test Settled)](https://img.shields.io/badge/x402_Base_USDC-1_self--test_settled-3b82f6)
![Outside Customers: 0](https://img.shields.io/badge/outside_paying_customers-0-f59e0b)
![Protocols: A2A v0.3 | PAP v1.0 | MCP 2024-11-05](https://img.shields.io/badge/protocols-A2A_%7C_PAP_%7C_MCP_%7C_x402-6366f1)
![License: MIT](https://img.shields.io/badge/license-MIT-64748b)

---

## 1. Quickstart (Verify Live Endpoints or Run Locally)

### Query the Live Production Gateway
```bash
# 1. Inspect machine-readable discovery manifests
curl -s https://www.nanoempireai.com/.well-known/agent-card.json | jq .
curl -s https://www.nanoempireai.com/.well-known/poppy.json | jq .
curl -s https://www.nanoempireai.com/.well-known/mcp.json | jq .

# 2. Check RecallGuard API health (46,642 verified CPSC/FDA/Health Canada records)
curl -s https://recallguard-api.vercel.app/api/v1/health | jq .

# 3. Trigger a live HTTP 402 Payment Required challenge on Base Mainnet
curl -i https://recallguard-api.vercel.app/api/v1/feed
```

### Run the Gateway Locally
```bash
git clone https://github.com/Nano-Empire-Ai/nanoempire-web.git
cd nanoempire-web
npm install
npm run dev
# Open http://localhost:3000
```

---

## 2. Machine-Readable Discovery Surfaces

| Surface | Standard | Canonical URL |
|---------|----------|---------------|
| **LLM Index** | `llms.txt` | [`https://www.nanoempireai.com/llms.txt`](https://www.nanoempireai.com/llms.txt) |
| **A2A Agent Card** | Google A2A `0.3.0` (`v1.5.0`) | [`https://www.nanoempireai.com/.well-known/agent-card.json`](https://www.nanoempireai.com/.well-known/agent-card.json) |
| **Poppy / PAP Manifest** | Sierra + Meta `PAP/1.0` | [`https://www.nanoempireai.com/.well-known/poppy.json`](https://www.nanoempireai.com/.well-known/poppy.json) |
| **MCP Discovery** | Anthropic MCP `2024-11-05` | [`https://www.nanoempireai.com/.well-known/mcp.json`](https://www.nanoempireai.com/.well-known/mcp.json) |
| **Agent Catalog** | `agents.json` (`v1.3.0`) | [`https://www.nanoempireai.com/agents.json`](https://www.nanoempireai.com/agents.json) |
| **Commercial Offers** | `offers.json` (`v1.4.0`) | [`https://www.nanoempireai.com/offers.json`](https://www.nanoempireai.com/offers.json) |
| **OpenAPI 3.1 Spec** | OpenAPI `3.1.0` | [`https://www.nanoempireai.com/.well-known/openapi.json`](https://www.nanoempireai.com/.well-known/openapi.json) |
| **M2M Living State** | Markdown Synthesis | [`https://www.nanoempireai.com/m2m-state.md`](https://www.nanoempireai.com/m2m-state.md) |

---

## 3. Pricing & Payment Rails

### Rail A — Autonomous Machine Settlement (`x402` on Base Mainnet `eip155:8453`)
- **Asset:** USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- **Recipient Treasury:** `0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01`
- **Facilitator:** `https://x402.org/facilitator` (`x402Version: 2`)

| Endpoint | Method | Price (USDC) | Base Units (6 dec) | Status |
|----------|--------|--------------|--------------------|--------|
| `https://recallguard-api.vercel.app/api/v1/health` | `GET` | **Free** | `0` | **LIVE** (`46,642` records) |
| `https://recallguard-api.vercel.app/api/v1/feed` | `GET` | **$0.05 USDC** | `50000` | **LIVE** (HTTP 402 active) |
| `https://recallguard-api.vercel.app/api/v1/match` | `POST` | **$0.10 USDC** | `100000` | **LIVE** (HTTP 402 active) |

### Rail B — Human / Enterprise Checkout (Stripe Live)

| Product | Scope | Price (USD) | Checkout / Triage Surface | Status |
|---------|-------|-------------|---------------------------|--------|
| **MCP Readiness Audit Pilot** | 3-tool MCP migration + hardened schemas + pytest harness | **$99** (pilot) | [`https://www.nanoempireai.com/grok-mcp/`](https://www.nanoempireai.com/grok-mcp/) | **LIVE** |
| **BidShield Urgent Triage** | `<72h` Annex Gap Scan (`$29,400` JEV exposure model) | **$99** / **$299** | [`https://www.nanoempireai.com/bidshield/triage/index.html`](https://www.nanoempireai.com/bidshield/triage/index.html) | **LIVE** |
| **RecallRadar Starter / Pro** | Single SKU screen (`$30`) or continuous monitoring (`$99/mo`) | **$30** / **$99/mo** | [`https://www.nanoempireai.com/offers.json`](https://www.nanoempireai.com/offers.json) | **LIVE** |
| **SkillProof Audit Battery** | 5-stage deterministic MCP verification + signed receipt | **$500** | [`https://www.nanoempireai.com/offers.json`](https://www.nanoempireai.com/offers.json) | **LIVE** |

---

## 4. Settlement Proof & Honest Volume Ledger

- **On-Chain Settlement Proof (Base Mainnet Block `51961194`):**
  - **Tx Hash:** [`0x0581b819b2e5b481cbbcfb8fe81e6fe57a0d0ef9c6f8fc04952164761586da64`](https://basescan.org/tx/0x0581b819b2e5b481cbbcfb8fe81e6fe57a0d0ef9c6f8fc04952164761586da64)
  - **Settlement Details:** `0.05 USDC` (`50,000` atomic units) settled via EIP-3009 `TransferWithAuthorization` for `GET /api/v1/feed`.
- **Epistemic Volume Disclosure:**
  - **Self-test on-chain settlements:** `1` (`$0.05 USDC` on Base block `51961194`)
  - **Outside paying customers:** `0`
  - **Outside settled volume:** `$0.00`

---

## 5. Related Repositories (`Nano-Empire-Ai`)

- [`Nano-Empire-Ai/nano-empire-tollbooth`](https://github.com/Nano-Empire-Ai/nano-empire-tollbooth) — Python SDK (`pip install nano-empire-tollbooth`) for HTTP 402 machine paywalls.
- [`Nano-Empire-Ai/nano-x402-client`](https://github.com/Nano-Empire-Ai/nano-x402-client) — TypeScript/Python client SDK (`npm i @nanoempireai/nano-x402-client`) for autonomous x402 challenge negotiation.
- [`Nano-Empire-Ai/nano-empire-mcp-suite`](https://github.com/Nano-Empire-Ai/nano-empire-mcp-suite) — Model Context Protocol (MCP) server suite and verification harnesses.
- [`roblambert9/recallguard-mcp`](https://github.com/roblambert9/recallguard-mcp) — Smithery-certified (`rob-c8hu/recallguard-mcp`) MCP server for CPSC/FDA/Health Canada recall screening.
- [`roblambert9/bidshield-kernel`](https://github.com/roblambert9/bidshield-kernel) — Deterministic document-defense kernel (`BidShield v0.2`) with SHA-256 evidence chains.

---

## 6. License & Contact

- **License:** MIT
- **Operator:** Robert Lambert — `rob@nanoempireai.com`
- **Web:** [`https://www.nanoempireai.com`](https://www.nanoempireai.com)
