#!/usr/bin/env python3
"""
Revenue Rail Sentinel — Autonomous Production Verification
Verifies all machine and human payment rails, discovery endpoints, and Stripe checkouts.
Zero dependencies (standard library only).
"""

import sys
import json
import urllib.request
import urllib.error

PRODUCTION_DOMAIN = "https://www.nanoempireai.com"

CHECKS = [
    {
        "name": "Machine Discovery (/.well-known/x402)",
        "url": f"{PRODUCTION_DOMAIN}/.well-known/x402",
        "expected_status": 200,
        "validate": lambda body: "extensions" in body and "bazaar" in body
    },
    {
        "name": "Agent Card (/.well-known/agent-card.json)",
        "url": f"{PRODUCTION_DOMAIN}/.well-known/agent-card.json",
        "expected_status": 200,
        "validate": lambda body: "coinbase-x402-facilitator" in body and "X-PAYMENT-RESPONSE" in body
    },
    {
        "name": "Service Discovery (/llms.txt)",
        "url": f"{PRODUCTION_DOMAIN}/llms.txt",
        "expected_status": 200,
        "validate": lambda body: "RecallRadar" in body and "0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01" in body
    },
    {
        "name": "Offers Catalog (/offers.json)",
        "url": f"{PRODUCTION_DOMAIN}/offers.json",
        "method": "GET",
        "expected_status": 200,
        "validate": lambda body: "STRIPE_LINK_" not in body and "recallradar-report" in body
    },
    {
        "name": "RecallGuard Match API (HTTP 402 Rail)",
        "url": "https://recallguard-api.vercel.app/api/v1/match",
        "method": "POST",
        "data": b'{"items":[{"name":"test"}]}',
        "expected_status": 402,
        "validate": lambda body: True
    },
    {
        "name": "API3 / Enterprise Trial Verifier (/api/v1/trial/verify)",
        "url": f"{PRODUCTION_DOMAIN}/api/v1/trial/verify",
        "method": "GET",
        "headers": {"Authorization": "Bearer trial_api3_bNqEoww1cX5sBJgX5vqfC5zCAdOzXNyq"},
        "expected_status": 200,
        "validate": lambda body: "credits_remaining" in body and "api3" in body
    },
    {
        "name": "AEO Discovery Beacon (/.well-known/agent.json)",
        "url": f"{PRODUCTION_DOMAIN}/.well-known/agent.json",
        "method": "GET",
        "expected_status": 200,
        "validate": lambda body: "NanoEmpire AI Autonomous Tollbooth" in body and "0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01" in body
    },
    {
        "name": "Cryptographic Proof Packs (/api/v1/proof-packs)",
        "url": f"{PRODUCTION_DOMAIN}/api/v1/proof-packs",
        "method": "GET",
        "expected_status": 200,
        "validate": lambda body: "nanoempire-proof-engine" in body
    }
]

def run_sentinel():
    print("=" * 60)
    print("[*] NANO EMPIRE REVENUE RAIL SENTINEL")
    print("=" * 60)
    
    failures = 0
    headers = {"User-Agent": "NanoEmpire-Sentinel/1.0"}
    
    for check in CHECKS:
        method = check.get("method", "GET")
        data = check.get("data", None)
        req_headers = dict(headers)
        req_headers.update(check.get("headers", {}))
        req = urllib.request.Request(check["url"], data=data, headers=req_headers, method=method)
        if data:
            req.add_header("Content-Type", "application/json")
        status_code = None
        body_text = ""
        
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                status_code = resp.status
                body_text = resp.read().decode("utf-8", errors="ignore")
        except urllib.error.HTTPError as e:
            status_code = e.code
            body_text = e.read().decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"[-] {check['name']} -- NETWORK ERROR: {e}")
            failures += 1
            continue

        if status_code == check["expected_status"] and check["validate"](body_text):
            print(f"[+] {check['name']} -- HTTP {status_code} [VERIFIED]")
        else:
            print(f"[-] {check['name']} -- FAILED (Expected {check['expected_status']}, Got {status_code})")
            failures += 1
            
    print("=" * 60)
    if failures == 0:
        print("[SUCCESS] ALL REVENUE RAILS ARE HEALTHY AND LIVE.")
        return 0
    else:
        print(f"[FAIL] {failures} REVENUE RAIL(S) COMPROMISED. DO NOT DISTRIBUTE.")
        return 1

if __name__ == "__main__":
    sys.exit(run_sentinel())
