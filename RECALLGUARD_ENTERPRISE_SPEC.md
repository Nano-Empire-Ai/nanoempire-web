# 🏛️ RECALLGUARD ENTERPRISE: BOOK-MATCHING SPEC (v1.0)
**Target:** Chubb, Hogan, Sedgwick, Enterprise Retailers (Walmart Private Labels)
**Objective:** Shift recall management from *reactive claims processing* to *proactive exposure mitigation*.

### 1. The Core Value Proposition (The "Why")
A raw recall feed tells an insurer *what* is dangerous. Book-matching tells the insurer *who is exposed, how much it costs, and when the exposure just multiplied*. 
*   **The Feed** = Commodity (Table stakes).
*   **The Match** = Moat (High switching cost, deep integration).
*   **The Expansion Alert** = The Money Event (Where ROI is proven).

### 2. Book Ingestion Architecture (The Client's Portfolio)
The system must accept the client's "Book of Business" via secure SFTP, API, or bulk CSV upload. The schema adapts to the vertical:

| Vertical | Ingestion Key (The "Book") | Matching Logic |
| :--- | :--- | :--- |
| **Personal Auto (Chubb)** | VIN lists, Make/Model/Year aggregates | Exact VIN match → Fuzzy Make/Model/Year fallback |
| **General Liability / Retail** | UPCs, SKU lists, Private Label Brand Names | Exact UPC → Brand/Category heuristic match |
| **Commercial Property** | Appliance Serials, HVAC Make/Models | Exact Serial → Manufacturer/Model range match |

### 3. The Matching Engine (The Moat)
When a new recall hits the CPSC, FDA, or NHTSA API, the engine runs a 3-tier matching cascade against the vaulted book:
1.  **Tier 1: Exact Hit (O(1) Lookup).** Direct VIN or UPC match. *Action: Immediate Critical Alert.*
2.  **Tier 2: Parametric Hit (O(n) Scan).** Make/Model/Year matches the NHTSA parameters, or Brand/Category matches CPSC. *Action: Flagged for Underwriter Review.*
3.  **Tier 3: Supply Chain / Private Label Hit.** The recall names a manufacturer (e.g., "Sunbeam"), and the client's book contains a private label (e.g., "Walmart Expert Grill") known to be sourced from them. *Action: High-Priority Exposure Warning.*

### 4. The "Expansion Alert" (The Money Event)
Recalls rarely stay static. A manufacturer recalls 5,000 units from Lot A. Two weeks later, they expand it to 500,000 units across Lots A-Z. 
*   **The Logic:** The engine tracks the `recall_id` and monitors for updates to the `units_recalled` or `date_range` parameters in the source API.
*   **The Trigger:** If an expansion occurs, the engine re-runs the match against the *delta* (the newly added lots/dates). 
*   **The Alert:** *"URGENT: Recall #24X-123 expanded by 495,000 units. 142 newly exposed policies detected in your book."*

### 5. NHTSA Ingestion Bounds (Auto Specific)
To support the Chubb/Hogan auto wedge, the NHTSA integration will strictly adhere to these bounds:
*   **Source:** `api.nhtsa.gov/recalls` (No API key required, rate-limited to 10 req/sec).
*   **Polling Cadence:** Every 60 minutes.
*   **Data Normalization:** Map NHTSA `Make`, `Model`, `Year`, and `Component` to our internal schema.
*   **VIN Decoding:** Integrate a lightweight VIN-to-Make/Model decoder to allow clients to upload raw VIN lists without pre-parsing them.

### 6. SLA & Delivery
*   **Time-to-Alert:** < 4 hours from NHTSA/CPSC publication to matched webhook delivery.
*   **Delivery Mechanism:** REST Webhook (JSON payload) to the client's claims/policy admin system, plus an encrypted CSV drop to their SFTP.

***

### 🛠️ THE $500 "402-GAP" DIAGNOSTIC SKU
While the enterprise book-matching play matures (30-90 day sales cycle), we deploy the **402-Gap Diagnostic** for immediate cash flow. This is a locked $500 product targeting the hundreds of projects listed on Circle's Discovery API.

**The 6-Test Battery:**
1.  **Challenge Issuance:** Does the endpoint correctly return HTTP 402 with a valid x402 JSON payload?
2.  **Asset Verification:** Is the requested asset (e.g., USDC) a valid, liquid contract on the specified chain?
3.  **Signature Validation:** Does the endpoint correctly verify an EIP-3009 `TransferWithAuthorization` signature without executing it?
4.  **Facilitator Settlement:** When a valid payment is submitted via `X-PAYMENT`, does the server successfully settle it on-chain and return HTTP 200?
5.  **Receipt Integrity:** Does the server return a cryptographically signed receipt that matches the transaction hash?
6.  **Replay Attack Prevention:** If the exact same `X-PAYMENT` header is submitted twice, does the server reject the second attempt (preventing double-spend)?

*Deliverable:* A 3-page PDF scorecard showing Pass/Fail for each test, latency metrics, and a "Fix It" code snippet for their engineering team.


### [2026-10-02 Update] NHTSA Spec v0.2: Automated VIN Decoding
**Pivot from v0.1:** Bulk NHTSA feeds do *not* carry VIN ranges. The match predicate is updated.
*   **The Intermediary Step:** We hit the vPIC API (https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}) to translate client VINs into structured Make/Model/Year triples.
*   **The Match Predicate:** We match the decoded triples against the NHTSA ecallsByVehicle database.
*   **Honesty Caveat:** This matches entities as "potentially affected" (subset isolation by plant/build-date requires manual manufacturer lookup). Do not pitch VIN-level strict confirmation.

