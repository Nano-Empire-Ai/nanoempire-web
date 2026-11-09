#!/usr/bin/env python3
"""
M2M Signal Ledger & Invariant Sentinel (scripts/m2m_signal_sentinel.py)
=======================================================================
Enforces canonical data, pricing, and ledger honesty across:
  - public/m2m-state.md
  - public/m2m-signals.json
  - public/llms.txt
so automated daily connector commits (Grok / Claude / GitHub Actions) can never
introduce price drift ($149 / $99 / $249), stale recall counts (21,812), or
fabricated customer claims.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

FORBIDDEN_PATTERNS = [
    ("21,812", "Stale September recall snapshot count (must use 46,642)"),
    ("$149", "Unapproved BidShield $149 price drift (locked ladder is $299 / $499 / $999)"),
    ("$99/$249", "Stale BidShield $99/$249 price drift (locked ladder is $299 / $499 / $999)"),
]

REQUIRED_M2M_STATE_TOKENS = [
    "51961194",
    "0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999",
    "46,642",
    "skillproof-2026-10",
]


def main() -> int:
    errors = []

    for rel in ("public/m2m-state.md", "public/llms.txt", "public/m2m-signals.json"):
        p = ROOT / rel
        if not p.exists():
            errors.append(f"MISSING FILE: {rel}")
            continue
        text = p.read_text(encoding="utf-8")
        for pat, reason in FORBIDDEN_PATTERNS:
            if pat in text:
                errors.append(f"DRIFT VIOLATION in {rel}: found '{pat}' ({reason})")

    m2m_state = (ROOT / "public/m2m-state.md").read_text(encoding="utf-8")
    for req in REQUIRED_M2M_STATE_TOKENS:
        if req not in m2m_state:
            errors.append(f"MISSING INVARIANT in public/m2m-state.md: '{req}'")

    signals_data = json.loads((ROOT / "public/m2m-signals.json").read_text(encoding="utf-8"))
    inv = signals_data.get("canonical_invariants", {})
    if inv.get("outside_paying_customers") != 0:
        errors.append("INVARIANT BREACH: outside_paying_customers must match verified ledger (0)")
    if inv.get("recallradar_corpus_records") != 46642:
        errors.append("INVARIANT BREACH: recallradar_corpus_records must be 46642")
    if inv.get("bidshield_locked_tiers_usd") != [299, 499, 999]:
        errors.append("INVARIANT BREACH: bidshield_locked_tiers_usd must be [299, 499, 999]")

    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        return 1

    print(f"PASS: M2M Signal Sentinel verified {len(signals_data.get('signals', []))} signals and all canonical invariants.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
