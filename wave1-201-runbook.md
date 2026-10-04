# Lane-Bridge Zip: #201 VIN Decode Cache x402

## Overview
Wave 1, Idea #201 — Machine-readable VIN decode cache ($0.03/decode PROPOSED)
Kill gate: <300 decodes across ≥2 developers + ≥1 "bill me" reply by 2026-10-17 → park

## Hana Lane (Vercel, GitHub, Stripe, Gmail, Sheets)

### Files to Create
1. Vercel route: `app/api/vin/decode/route.ts` (already deployed to `nanoempire-web`)
2. `offers.json` — SKU entry for `vin-decode-cache-x402` (already deployed)
3. `llms.txt` — VIN SKU stanza (already deployed)
4. Gmail outreach drafts to 5 fleet-agent developers → **NEEDS ROB'S SEND**

### Runbook: Deploy
1. Vercel: `vercel --prod` from `nanoempire-web` repo
2. Verify: `GET https://nanoempireai.com/api/vin/decode` returns health JSON
3. Verify: `POST https://nanoempireai.com/api/vin/decode { "vin": "1FTFW1E5XMFA12345" }` returns decode + campaigns
4. Verify: `https://nanoempireai.com/offers.json` includes `vin-decode-cache-x402` SKU
5. Verify: `https://nanoempireai.com/llms.txt` includes VIN SKU line

### Runbook: Price Confirmation (CRITICAL — GATES ALL CHARGE LOGIC)
- **Current state**: `VIN_DECODE_PRICE_USDC` env is **UNSET** → free-tier counter mode only
- **Required**: Rob confirms price in writing (e.g., "Confirm $0.03/decode" or "Set $0.05/decode")
- **Only after written confirmation**: Set `VIN_DECODE_PRICE_USDC` in Vercel env → x402 challenges activate
- **Until then**: Free-tier counter mode, no charges, request counting only

### Runbook: Outreach (5 fleet developers)
1. Open `outreach-201-drafts.csv` (provided in zip)
2. For each row: verify not in sent mail
3. Send from `rob@nanoempireai.com` using draft template
4. Log sent date in Sheet
5. **Kill gate**: Track decodes in Vercel logs + "bill me" replies → if <300 decodes or 0 "bill me" by 2026-10-17, park

### Deliverables to Windows Lane
- Vercel route live and tested
- Price confirmation (to set env)
- Outreach CSV with sent dates

---

## Windows Lane (Repo, Supabase, Ollama, Edge Functions)

### Files to Create
1. Supabase migration: `20261003000001_wave1_tables.sql` → `vin_decode_cache` table
2. Edge Function: Optional write-through from Vercel route to Supabase (post-launch)
3. Orchestrator: Telemetry endpoint for cache hit-rate (LEARN loop)

### Runbook: Supabase Migration
```bash
# In Supabase Dashboard → SQL Editor
# Run: 20261003000001_wave1_tables.sql
# Verify: table `vin_decode_cache` created with RLS
# Verify: indexes on hit_count, last_hit
```

### Runbook: Supabase Write-Through (Post-Launch)
- Extend Vercel route `route.ts`:
  - On cache miss: after live vPIC decode, write to Supabase `vin_decode_cache`
  - On cache hit: increment `hit_count` and `last_hit` in Supabase
  - Use Supabase service role key (server-side only)

### Runbook: Orchestrator Telemetry
- Add endpoint in orchestrator: `GET /telemetry/vin-cache`
- Returns: cache size, hit rate, total requests, top VINs
- Feeds LEARN loop for compounding Intelligence

### Deliverables to Hana Lane
- Supabase table confirmed live
- Write-through pattern documented
- Telemetry endpoint available

---

## Preflight Checklist (Before Live)
- [ ] `GET /api/vin/decode` returns health JSON with `cache_size`, `total_requests`, `price_configured: false`
- [ ] `POST /api/vin/decode { "vin": "1FTFW1E5XMFA12345" }` returns decode + campaigns + `free_tier: true`
- [ ] `offers.json` has `vin-decode-cache-x402` SKU with `price_usd: 0.03`
- [ ] `llms.txt` has VIN SKU line
- [ ] 5 outreach drafts deduped vs sent mail
- [ ] Supabase `vin_decode_cache` table live with RLS
- [ ] **Price confirmed in writing by Rob** → set `VIN_DECODE_PRICE_USDC` in Vercel env
- [ ] Kill gate date calendar: 2026-10-17

---

## Post-Deploy Verify (Hana)
1. `curl https://nanoempireai.com/api/vin/decode` → health JSON
2. `curl -X POST https://nanoempireai.com/api/vin/decode -H "Content-Type: application/json" -d '{"vin":"1FTFW1E5XMFA12345"}'` → decode + campaigns + `free_tier: true`
3. `curl https://nanoempireai.com/offers.json | jq '.skus[] | select(.id=="vin-decode-cache-x402")'`
4. `curl https://nanoempireai.com/llms.txt | grep -i vin`
5. Log: "Wave 1 #201 live at $(date)"

---

## Kill Gate Tracking
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Total decodes | ≥300 | 0 | ⏳ |
| Unique developers | ≥2 | 0 | ⏳ |
| "Bill me" replies | ≥1 | 0 | ⏳ |
| Deadline | 2026-10-17 | — | ⏳ |
| Action if fail | Park SKU, endpoint stays free | — | — |

---

## Contacts
- **Rob**: Price confirmation in writing, outreach sends
- **Hana**: Vercel deploy, env var set, Gmail drafts, Sheets tracking
- **Windows**: Supabase migration, write-through, orchestrator telemetry