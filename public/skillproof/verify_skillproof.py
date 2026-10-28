#!/usr/bin/env python3
"""Verify a SkillProof Trust Manifest against the published Nano Empire public key.

Usage:
    python verify_skillproof.py manifest.json [--pubkey-url URL | --pubkey-hex HEX]

Exit code 0 = signature valid AND signer key matches the published key.
"""
import argparse
import hashlib
import json
import sys
import urllib.request

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric import ed25519

DEFAULT_PUBKEY_URL = "https://www.nanoempireai.com/.well-known/skillproof-pubkey.json"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--pubkey-url", default=DEFAULT_PUBKEY_URL)
    ap.add_argument("--pubkey-hex", default=None, help="Pin a key offline instead of fetching")
    args = ap.parse_args()

    with open(args.manifest, encoding="utf-8") as f:
        manifest = json.load(f)
    sig = manifest.pop("signature")
    payload = json.dumps(manifest, sort_keys=True).encode("utf-8")

    published = args.pubkey_hex
    if published is None:
        with urllib.request.urlopen(args.pubkey_url, timeout=10) as r:
            published = json.load(r)["keys"][0]["public_key_hex"]

    checks = {
        "payload_sha256_matches": hashlib.sha256(payload).hexdigest() == sig["payload_sha256"],
        "signer_is_published_key": sig["public_key_hex"].lower() == published.lower(),
    }
    try:
        ed25519.Ed25519PublicKey.from_public_bytes(bytes.fromhex(published)).verify(
            bytes.fromhex(sig["signature_hex"]), payload
        )
        checks["ed25519_signature_valid"] = True
    except (InvalidSignature, ValueError):
        checks["ed25519_signature_valid"] = False

    for k, v in checks.items():
        print(f"{'PASS' if v else 'FAIL'}  {k}")
    ok = all(checks.values())
    print("VERDICT:", "VALID" if ok else "INVALID")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
