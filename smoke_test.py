#!/usr/bin/env python3
"""
Smoke Test Script for Nano Empire Production Endpoints
Run after every deploy to verify all SKU endpoints are live.
"""

import sys
import json
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

BASE = "https://www.nanoempireai.com"

ENDPOINTS = {
    # Core pages (must return 200)
    "/manifests.html": 200,
    "/offers.json": 200,
    "/llms.txt": 200,
    "/audit-offer.html": 200,
    "/.well-known/agent-card.json": 200,
    "/openapi.json": 200,
    
    # SKU endpoints - VIN decode returns 200 in paper_mode, 402 when live
    "/api/vin/decode": [200, 402],  # 200 = paper_mode, 402 = live x402
    
    # Known 404s (exclude from pitches)
    "/recall-roulette": 404,
    "/recallguard-docs": 404,
    
    # Agent discovery
    "/.well-known/agent-card.json": 200,
    "/openapi.json": 200,
}

def check_endpoint(path: str, expected_status) -> dict:
    """Check a single endpoint."""
    url = BASE + path
    try:
        req = Request(url, headers={"User-Agent": "NanoEmpire-SmokeTest/1.0"})
        with urlopen(req, timeout=10) as resp:
            actual_status = resp.status
            body = resp.read().decode("utf-8", errors="ignore")
            acceptable = expected_status if isinstance(expected_status, list) else [expected_status]
            return {
                "path": path,
                "expected": expected_status,
                "actual": actual_status,
                "pass": actual_status in acceptable,
                "body_preview": body[:200]
            }
    except HTTPError as e:
        return {
            "path": path,
            "expected": expected_status,
            "actual": e.code,
            "pass": e.code in (expected_status if isinstance(expected_status, list) else [expected_status]),
            "body_preview": e.read().decode("utf-8", errors="ignore")[:200]
        }
    except URLError as e:
        return {
            "path": path,
            "expected": expected_status,
            "actual": "CONNECTION_ERROR",
            "pass": False,
            "body_preview": str(e)
        }
    except Exception as e:
        return {
            "path": path,
            "expected": expected_status,
            "actual": "ERROR",
            "pass": False,
            "body_preview": str(e)
        }

def check_sku_in_json(url: str, sku_ids: list) -> dict:
    """Verify SKU IDs exist in JSON response."""
    try:
        req = Request(url, headers={"User-Agent": "NanoEmpire-SmokeTest/1.0"})
        with urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            data = json.loads(body)
            
            results = {}
            for sku_id in sku_ids:
                found = False
                if isinstance(data, dict) and "skus" in data:
                    for sku in data["skus"]:
                        if sku.get("id") == sku_id:
                            found = True
                            break
                results[sku_id] = found
            return {"url": url, "skus": results, "pass": all(results.values())}
    except Exception as e:
        return {"url": url, "skus": {sid: False for sid in sku_ids}, "pass": False, "error": str(e)}

def main():
    print(f"=== Nano Empire Smoke Test ===")
    print(f"Base: {BASE}")
    print()
    
    all_pass = True
    
    # Check endpoints
    print("--- Endpoint Status ---")
    for path, expected in ENDPOINTS.items():
        result = check_endpoint(path, expected)
        status = "✅ PASS" if result["pass"] else "❌ FAIL"
        print(f"  {status} {path} (expected {expected}, got {result['actual']})")
        if not result["pass"]:
            all_pass = False
            print(f"      Body: {result['body_preview'][:100]}")
    
    # Check SKU IDs in JSON (offers.json)
    print()
    print("--- SKU Verification (JSON) ---")
    result = check_sku_in_json(BASE + "/offers.json", ["verified-directory-listing", "vin-decode"])
    status = "✅ PASS" if result["pass"] else "❌ FAIL"
    print(f"  {result['pass'] and '✅ PASS' or '❌ FAIL'} /offers.json")
    for sku_id, found in result["skus"].items():
        print(f"    {'✅' if found else '❌'} {sku_id}")
    if not result["pass"]:
        all_pass = False
        if "error" in result:
            print(f"      Error: {result['error']}")
    
    # Check SKU terms in plain text (llms.txt)
    print()
    print("--- SKU Verification (Text) ---")
    terms = ["verified-directory-listing", "vin-decode"]
    try:
        req = Request(BASE + "/llms.txt", headers={"User-Agent": "NanoEmpire-SmokeTest/1.0"})
        with urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            
            all_found = True
            for term in ["verified-directory-listing", "vin-decode"]:
                found = term in body
                print(f"    {'✅' if found else '❌'} {term}")
                if not found:
                    all_pass = False
                    all_found = False
    except Exception as e:
        print(f"      Error: {e}")
        all_pass = False
    
    print()
    if all_pass:
        print("🎉 ALL TESTS PASSED")
        return 0
    else:
        print("💥 SOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())