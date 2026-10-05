# Nano Empire agent brief: machine economy must-know
# As-of: 2026-10-05
# Audience: agents updating https://www.nanoempireai.com
# Rule: publish claims with a date, a source, and a caveat. Do not treat protocol volume as agent demand.

## How to use this file
Append new items under "Watchlist intake". Never overwrite a dated fact; supersede it with a newer dated note. Prefer primary sources (foundation posts, company blogs, on-chain receipts) over recap sites. If two volume numbers conflict, publish both and label the filter.

Site fit: Nano Empire is a machine-economy API gateway. Live rail is x402 USDC on Base (RecallGuard match $0.10; feed $0.05 returns 402). Trust product is SkillProof (signed Ed25519 manifests). Machine surfaces already include /.well-known/agent-card.json, /llms.txt, /offers.json, /openapi.json. Updates should strengthen those surfaces, not just the human homepage.

## One-line thesis agents should repeat
AI is being sold as machine-native intelligence. Stablecoins and HTTP 402 are being sold as machine-native money. The protocols split into four jobs: talk (A2A/MCP), permission (AP2), checkout (ACP), settlement (x402/MPP). Identity and proof are the missing layer. That is the Nano Empire opening.

## Disambiguation traps (do not mix these up)
- Google A2A = Agent2Agent, an agent-to-agent messaging protocol (announced April 2025).
- Bank A2A = account-to-account payments (open banking, Direct Debit). GoCardless "UK first AI-powered A2A payment" on 2026-09-22 is the bank meaning: a chat bot set up a Direct Debit to Trussell. Not agent-to-agent settlement.
- ACP = Agentic Commerce Protocol (OpenAI + Stripe). Checkout. Merchant stays merchant of record.
- AP2 = Agent Payments Protocol (Google, now FIDO). Permission mandates. Does not move money.
- MPP = Machine Payments Protocol (Stripe + Tempo). HTTP 402 plus a session so one spend cap can stream many micropayments.
- x402 = HTTP 402 payment-required settlement. Coinbase origin, now x402 Foundation under the Linux Foundation.
- Visa TAP = Trusted Agent Protocol. Agent-vs-bot identity on the web request, not a settlement rail.
- ERC-8004 = on-chain agent identity/reputation registry. Identity, not payment.

## Protocol stack agents must know (as of 2026-10-05)

| Layer | Spec | Steward | Job | Rails | Nano Empire action |
| --- | --- | --- | --- | --- | --- |
| Tools | MCP (Anthropic, Nov 2024) | Anthropic + ecosystem | Agent to tools/data | n/a | Keep paid MCP/x402 tools discoverable. Cloudflare now charges MCP tools via 402. |
| Talk | A2A Agent2Agent (Google, Apr 2025) | Google | Agent to agent | n/a | Publish agent-card.json that an A2A client can read. Do not claim a full A2A mesh is live if endpoints are planned. |
| Permission | AP2 (announced 2025-09-16; v0.2 donated to FIDO Alliance Apr 2026) | FIDO Alliance | Signed mandates: what, how much, how long. Human-not-present in v0.2 | Rail-agnostic | SkillProof manifests should be mappable to mandate language. Do not pretend a trust manifest is an AP2 mandate. |
| Checkout | ACP (OpenAI + Stripe, 2025-09-29, Apache 2.0, still described as beta) | OpenAI + Stripe | Agent completes a purchase; merchant of record stays the seller | Merchant's existing PSP, mostly fiat | Human SKUs stay on Stripe. Do not force ACP onto $0.05 API calls. |
| Settlement | x402 | x402 Foundation / Linux Foundation (contributed Apr 2026; foundation operational 2026-07-14, ~40 members) | Pay inside the HTTP request | USDC dominant; spec is network/token agnostic; Lightning added by Block ~2026-09-24 | Primary rail. Keep Base USDC exact-amount 402 bodies accurate. |
| Settlement | MPP (launched 2026-03-18 with Tempo mainnet) | Stripe + Tempo | 402 plus session/streaming spend | Tempo stablecoins, Stripe/Visa cards, Lightning | Watch. Session primitive matters if RecallGuard webhooks become metered streams. |
| Card trust | Visa Intelligent Commerce + TAP (TAP with Cloudflare, Oct 2025; holiday 2026 rollout targeted) | Visa | Agent credential + bot-vs-shopper signature | Visa | Not our rail. Cite as the card-network answer to Know-Your-Agent. |
| Card + machine | Mastercard Agent Pay (2025-04-29); Agent Pay for Machines (2026-06-10, 30+ partners: Adyen, Checkout.com, Cloudflare, Stripe, Tempo, others) | Mastercard | Agentic tokens; AP4M for high-frequency low-value across cards, accounts, stablecoins | Multi-rail | Competitor trust+spend control. Our differentiator is published pass/fail manifests, not a network credential. |

## Must-know items (dated)

1. BlackRock, week of 2026-09-22. Paper: "The Machine-Native Economy: How digital assets connect intelligence, commerce, and compute." Authors: Will Su, Robert Mitchnick, Jay Jacobs, William Helm. Frame: AI = machine-native intelligence; digital assets = machine-native money. Names MCP, A2A, x402, ACP, MPP, and Visa Trusted Agents. Stablecoin market cap cited above $300B; 2025 adjusted stablecoin volume above $11T. Caveat: this is an institutional demand thesis, not measured agent GDP.
2. Usage is still mostly not agents. TRM Labs: AI agents are 0.6% to 7.5% of x402 payment volume. a16z crypto (piece circulated Apr 2026, recapped 2026-10-05): after wash filter, x402 agent-driven payments are about $1.6M/month, not the ~$24M headline. Publish both numbers whenever the site quotes x402 volume.
3. Headline x402 volume, unfiltered. x402 Foundation figures repeated in late Sep 2026 coverage: about 75.4 million transactions and $24.2 million over 30 days, average ~$0.32, mostly sub-dollar. Chainalysis (Jun 2026): 100 million cumulative x402 transactions on Base in about three quarters; payments of $1+ rose to 95% of value. Circle: USDC was 99.3% of the x402 volume in their Q2 cut. Coinbase: >99% of onchain agentic commerce in their Q2 commentary settled in USDC; >90% of agentic stablecoin volume on Base.
4. Governance signal, 2026-07-14. x402 Foundation operational under the Linux Foundation. Premier names cited: Visa, Mastercard, Stripe, Adyen, American Express, AWS, Google, Coinbase, Circle, Shopify, Fiserv, plus Ripple, MoonPay, Monad, Solana, Stellar. Block joined later and added Lightning (code ~2026-09-23, announced ~2026-09-24/25).
5. Cloudflare Monetization Gateway beta, 2026-09-30. Domain owners can charge agents for sites, APIs, MCP tools, and datasets over HTTP 402. Settlement via Coinbase x402 Facilitator, USDC on Base. AI Gateway inference can be paid per request with header PAYMENT-METHOD: x402 (US customers, selected models). Direct competitor to a home-rolled paywall. Nano Empire should say what the gateway does not do: adversarial skill proof and hash-chained receipts.
6. Stripe + Tempo MPP, 2026-03-18. Session = authorize a cap once, stream many payments. a16z: MPP marketplace processed 34,000+ transactions in week one, fees as low as $0.003, "headless merchants" (endpoint + price, no storefront). Single-source on the 34k figure; label it that way.
7. Stripe bought OpenRouter for a reported $7B in Aug 2026 (FintechNewsCH, 2026-10-05, single outlet in this pass). Treat as unconfirmed until a primary filing or company post. Implication if true: model routing and agent inference are being pulled into the payments stack.
8. Google AP2 v0.2 at FIDO, Apr 2026. Mandates: Intent, Cart, Payment. Human-not-present. Extension of A2A and compatible with MCP; some writeups say it can point at x402 for settlement. This is the consent artifact card networks and merchants will ask for.
9. Card networks entered machine payments. Visa TAP (identity of the shopping agent). Mastercard Agent Pay for Machines, 2026-06-10, programmable spend limits, claimed guaranteed settlement across cards, accounts, stablecoins. 30+ participants include Adyen, Checkout.com, Cloudflare, Stripe, Tempo.
10. GoCardless, 2026-09-22. First UK AI-completed account-to-account recurring donation (Trussell, Direct Debit inside a chat). Their survey: 64% of UK consumers open to AI managing recurring payments if they keep control. Useful for the human-permission page. Not a machine-rail win.
11. ERC-8004 agent identity. Turnkey, data as of 2026-09-13: 519,437 identities across 14 chains. ~93% on three chains: BNB 345,723 (66.6%), Base 86,167 (16.6%), Ethereum 50,782 (9.8%). Caveat: batch mints dominate; few identities run on a dedicated agent wallet; verifiable activity still early. Registry (mainnets) commonly cited at 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432. Nano Empire should not equate a minted ID with a passed SkillProof.
12. AWS Bedrock AgentCore Payments integrates Coinbase x402 so enterprise agents can pay in USDC under spend rules. Coinbase for Agents (Jun 2026) and Coinbase Business pitch "get paid by AI agents, no agent account needed."
13. Polygon agent payment-channel test, ~2026-09-25: >11 million verified payment updates/sec across 25 hubs, x402 for the request, batch settlement on Polygon. A throughput claim, not production agent GDP.
14. Checkout.com, 2026-09-01: own MCP server for agentic payments, while also backing ACP, AP2, and Mastercard Agent Pay. Hedge pattern: processors will support every rail. Do not bet the site on one protocol winning.
15. a16z gaps that match the product: identity, payments, governance. Named tools: NEAR Intents (>$15B cumulative DEX volume since Q4 2024 — intent volume, not agent commerce), MetaMask Delegation Toolkit, Coinbase AgentKit, Merit Systems AgentCash. Delegation = what an agent may do, enforced at contract level.

## What agents should add to nanoempireai.com
- A "rails" block on the homepage and in llms.txt: x402 is settlement; AP2 is permission; A2A is talk; ACP is human checkout; MPP is the session competitor. One sentence each.
- A volume honesty line wherever x402 is mentioned: "Foundation reported ~75M tx / ~$24M in a recent 30-day window; independent cuts put real agent share far lower (TRM 0.6–7.5% of volume; a16z ~$1.6M/month after wash filter). Our own settled outside-customer count is separate and must stay exact."
- agent-card.json fields an external agent needs: capabilities, price, asset (USDC 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913), network (base), payTo, facilitator, receipt header (X-PAYMENT-RESPONSE).
- SkillProof vs ERC-8004 vs Visa TAP comparison: registry ID, card-network credential, and adversarial signed manifest are three different proofs. Only the third is what we sell.
- Cloudflare note: paywall is now a CDN feature. Proof of skill is not.
- Offers.json status must stay stricter than marketing. If feed has no settled outside receipt, catalog status stays planned.
- Human vs machine split: SkillProof Sprint stays Stripe/CAD until a 402 settlement path is actually live. Do not advertise machine checkout for a SKU that 404s or has no receipt.

## Watchlist intake (append below; newest first)
- 2026-10-05: BlackRock machine-native economy coverage still dominating trade press. No new primary volume print beyond the Sep foundation figures.
- Next checks: x402 Foundation monthly report; Tempo/MPP public stats; FIDO AP2 v0.2 implementers; Cloudflare gateway GA; whether Stripe confirms OpenRouter; Base vs Solana vs Lightning share of 402; ERC-8004 active-agent ratio vs minted IDs.
