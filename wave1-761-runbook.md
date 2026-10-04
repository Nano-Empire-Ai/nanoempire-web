# Lane-Bridge Zip: #761 Verified Directory Listing

## Overview
Wave 1, Idea #761 — Trust-manifest directory listing ($500 LOCKED)
Kill gate: No paid intake by 2026-10-20 → park

## Hana Lane (Vercel, GitHub, Stripe, Gmail, Sheets)

### Files to Create
1. `manifests.html` — Verified Directory section (already deployed)
2. `offers.json` — SKU entry for `verified-directory-listing` (already deployed)
3. `llms.txt` — Directory SKU stanza (already deployed)
4. Stripe payment link: $500 CAD → **NEEDS ROB'S ACTIVATION**
5. Gmail outreach drafts to 20 fresh MCP authors → **NEEDS ROB'S SEND**

### Runbook: Deploy
1. Vercel: `vercel --prod` from `nanoempire-web` repo (already connected as `nanoempire-hub`)
2. Verify: `https://nanoempireai.com/manifests` shows "Verified Directory" section
3. Verify: `https://nanoempireai.com/offers.json` includes `verified-directory-listing` SKU
4. Verify: `https://nanoempireai.com/llms.txt` includes Directory + VIN SKUs

### Runbook: Stripe Link Activation
1. Log into Stripe Dashboard → Payment Links
2. Create: "Verified Directory Listing" — $500 CAD — One-time
3. Copy link → update `offers.json` and `manifests.html` if different from `eVq00keeo5n1bCzgIwfAc0c`
4. Test: Complete a test payment (use test mode first)

### Runbook: Outreach (20 authors)
1. Open `outreach-761-drafts.csv` (provided in zip)
2. For each row: verify not in sent mail (search Gmail for author email)
3. Send from `rob@nanoempireai.com` using draft template
4. Log sent date in Sheet
5. **Kill gate**: Track completed $500 payments in Stripe → if 0 by 2026-10-20, park

### Deliverables to Windows Lane
- `manifests.html` update (already in repo)
- `offers.json` + `llms.txt` updates (already in repo)
- Stripe link URL (to confirm in `offers.json`)
- Outreach CSV with sent dates

---

## Windows Lane (Repo, Supabase, Ollama, Edge Functions)

### Files to Create
1. Supabase migration: `20261003000001_wave1_tables.sql` → `directory_listings` table
2. Edge Function: Extend `hermes-intake-webhook` for directory submissions (idempotency reuse)
3. Ollama System One Router: `tev1:4b` pre-screen for listing submissions (post-launch)

### Runbook: Supabase Migration
```bash
# In Supabase Dashboard → SQL Editor
# Run: 20261003000001_wave1_tables.sql
# Verify: table `directory_listings` created with RLS
```

### Runbook: Intake Integration (Post-Launch)
- Extend `supabase/functions/hermes-intake-webhook/index.ts`:
  - New endpoint type: `directory_submission`
  - Reuse `webhook_idempotency` table
  - Insert into `directory_listings` with `status: 'pending'`
  - Trigger orchestrator `human_review` workflow for 80/20 gate

### Deliverables to Hana Lane
- Supabase table confirmed live
- Intake webhook ready for submissions
- Correlation ID pattern for tracking

---

## Preflight Checklist (Before Live)
- [ ] `manifests.html` Verified Directory section renders
- [ ] `offers.json` has both new SKUs
- [ ] `llms.txt` has both new SKU lines
- [ ] Stripe $500 link active and tested
- [ ] 20 outreach drafts deduped vs sent mail
- [ ] Supabase `directory_listings` table live with RLS
- [ ] Kill gate date calendar: 2026-10-20

---

## Post-Deploy Verify (Hana)
1. Visit `https://nanoempireai.com/manifests` → Verified Directory section visible
2. Click Stripe link → payment page loads
3. `curl https://nanoempireai.com/offers.json | jq '.skus[] | select(.id=="verified-directory-listing")'`
4. `curl https://nanoempireai.com/llms.txt | grep -i directory`
5. Log: "Wave 1 #761 live at $(date)"

---

## Kill Gate Tracking
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Paid intakes | ≥1 | 0 | ⏳ |
| Deadline | 2026-10-20 | — | ⏳ |
| Action if 0 | Park SKU, keep page as free corpus | — | — |

---

## Contacts
- **Rob**: Stripe activation, outreach sends, price confirmations
- **Hana**: Vercel deploy, Stripe link creation, Gmail drafts, Sheets tracking
- **Windows**: Supabase migration, Edge Function extension, Ollama pre-screen