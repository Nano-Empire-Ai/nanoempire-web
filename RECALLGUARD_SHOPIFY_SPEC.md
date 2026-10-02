# RecallGuard Shopify App: Technical Spec v1.0

## 1. Architecture Overview
- Embedded Shopify App (Polaris UI)
- Next.js App Bridge & OAuth
- Admin API Client (GraphQL for Barcode/UPC extraction)
- Webhooks (`products/create`, `products/update`)
- SQLite Session Vault & `merchant_scans` table

## 2. Target Niches for Pilot (Distribution First)
1. **Children's Products:** Frequent, severe CPSC recalls. High liability.
2. **Supplements / Health:** FDA drug/device recalls.
3. **Electronics:** Lithium battery and fire hazard recalls.

## 3. Pricing Model
- **Free:** $0 (1 manual scan/mo, up to 50 products)
- **Pro:** $99/mo (Unlimited manual scans, continuous webhook monitoring, email/expansion alerts)

*(Full spec detailed in conversation history, including OAuth flows, Admin API ingestion, Webhook definitions, Database schema, and Polaris UI architecture).*
