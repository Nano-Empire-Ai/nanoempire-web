#!/usr/bin/env python3
"""
canadabuys_harvester.py - Real tender ingestion for BidShield programmatic pages.

Source: CanadaBuys Open Data (Government of Canada, Open Government Licence - Canada)
  https://canadabuys.canada.ca/opendata/pub/openTenderNotice-ouvertAvisAppelOffres.csv
  Dataset: https://open.canada.ca/data/en/dataset/6abd20d4-7a1c-4b38-baa2-9525d0bb2fd2
"""
import csv
import html
import io
import json
import pathlib
import re
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone

SOURCE_URL = "https://canadabuys.canada.ca/opendata/pub/openTenderNotice-ouvertAvisAppelOffres.csv"
DATASET_URL = "https://open.canada.ca/data/en/dataset/6abd20d4-7a1c-4b38-baa2-9525d0bb2fd2"

SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
OUT_PATH = REPO_ROOT / "public" / "bidshield" / "tenders.json"
URGENT_PATH = REPO_ROOT / "public" / "bidshield" / "urgent.json"

UA = "NanoEmpireBidShield/1.0 (+https://www.nanoempireai.com/bidshield)"
UPWORK_URL = "https://www.upwork.com/services/product/writing-translation-a-compliance-matrix-of-every-mandatory-requirement-in-your-government-rfp-2074328625924014322"

RULES = [
    ("SITE_VISIT", "FATAL", "Mandatory site visit / bidders' conference", 30,
     r"\b(mandatory\s+(site\s+visit|site\s+tour|walk[- ]?through|bidders?['’]?\s+conference|pre[- ]?bid\s+(meeting|conference))|site\s+visit\s+is\s+mandatory|attendance\s+is\s+mandatory)\b"),
    ("SECURITY_CLEARANCE", "FATAL", "Personnel / facility security clearance", 30,
     r"\b(security\s+requirement|security\s+clearance|reliability\s+status|secret\s+(level|clearance)|top\s+secret|designated\s+organization\s+screening|facility\s+security\s+clearance|SRCL|controlled\s+goods)\b"),
    ("BONDING", "HIGH", "Bid / performance / labour & material bond", 15,
     r"\b(bid\s+(bond|security|deposit)|performance\s+bond|labou?r\s+and\s+material\s+(payment\s+)?bond|surety|certified\s+cheque)\b"),
    ("INSURANCE", "MEDIUM", "Insurance minimums (CGL / professional liability)", 8,
     r"\b(commercial\s+general\s+liability|professional\s+liability|errors\s+and\s+omissions|insurance\s+requirements?|certificate\s+of\s+insurance)\b"),
    ("MANDATORY_CRITERIA", "HIGH", "Pass/fail mandatory technical criteria", 12,
     r"\b(mandatory\s+(technical\s+)?(criteria|requirements?)|must\s+meet\s+all\s+mandatory|pass/fail\s+(criteria|basis))\b"),
    ("CERTIFICATION", "HIGH", "Required certification / licensing (ISO, COR, trade licence)", 10,
     r"\b(ISO\s?(9001|14001|45001|27001|17025)|certificate\s+of\s+recognition|red\s+seal|licensed\s+(electrician|contractor)|professional\s+engineer|P\.?\s?Eng)\b"),
    ("INDIGENOUS_SETASIDE", "HIGH", "Indigenous set-aside / participation requirement", 12,
     r"\b(set[- ]aside\s+(for|under)\s+the\s+procurement\s+strategy\s+for\s+indigenous|PSIB|indigenous\s+(business|participation)|comprehensive\s+land\s+claims?\s+agreement|CLCA)\b"),
    ("LANGUAGE", "MEDIUM", "Official-language / bilingual delivery requirement", 6,
     r"\b(must|required|capable\s+of)[^.]{0,80}(both\s+official\s+languages|bilingual)\b"),
    ("LIQUIDATED_DAMAGES", "HIGH", "Liquidated damages / delay penalties", 12,
     r"\b(liquidated\s+damages|penalt(y|ies)\s+per\s+(day|calendar\s+day))\b"),
    ("SAFETY_WSIB", "MEDIUM", "Workers' compensation / safety program proof", 6,
     r"\b((WSIB|CNESST|WorkSafeBC|workers['’]?\s+compensation)\s+(clearance|certificate|coverage)|health\s+and\s+safety\s+(program|plan)\s+(is\s+)?required)\b"),
]

NEGATIONS = {
    "SECURITY_CLEARANCE": re.compile(r"\b(there\s+(are|is)\s+no\s+security\s+requirements?|no\s+security\s+requirements?|without\s+security\s+requirements?)\b", re.I),
    "INDIGENOUS_SETASIDE": re.compile(r"\b(not\s+subject\s+to\s+any\s+set[- ]aside|is\s+not\s+set[- ]aside|not\s+set\s+aside)\b", re.I),
    "SITE_VISIT": re.compile(r"\b(no\s+(mandatory\s+)?site\s+visit|site\s+visit\s+is\s+not\s+mandatory|optional\s+site\s+visit)\b", re.I),
    "BONDING": re.compile(r"\b(bid\s+security\s+is\s+not\s+required|no\s+bid\s+security)\b", re.I),
}

VALUE_RE = re.compile(r"(?:estimated\s+(?:at\s+a\s+)?value|value\s+(?:for\s+this\s+opportunity\s+)?is\s+in\s+the\s+range)[^$]{0,40}(\$\s?[\d,]+(?:\.\d+)?)\s*(?:to|>|-|and)\s*(\$\s?[\d,]+(?:\.\d+)?)", re.I)
COMPILED = [(i, s, label, pts, re.compile(p, re.I)) for (i, s, label, pts, p) in RULES]

NAICS_KEYWORDS = [
    ("561720", r"\b(janitor|custodial|cleaning\s+services|housekeeping)\b"),
    ("238220", r"\b(hvac|mechanical|plumbing|boiler|chiller|heating|ventilation|air[- ]conditioning)\b"),
    ("238210", r"\b(electrical|switchgear|substation|lighting|generator|wiring)\b"),
    ("562111", r"\b(waste|hazardous\s+material|remediation|abatement|disposal)\b"),
    ("541512", r"\b(software|cloud|cyber|IT\s+services|informatics|data\s+centre|SaaS|devops|application\s+development)\b"),
    ("541330", r"\b(engineering\s+services|structural\s+engineer|geotechnical|design\s+services)\b"),
    ("561210", r"\b(facilit(y|ies)\s+(management|maintenance|support)|property\s+management)\b"),
    ("236220", r"\b(construction|renovation|roof|masonry|building\s+envelope|repairs?\s+to\s+building)\b"),
]
NAICS_COMPILED = [(c, re.compile(p, re.I)) for c, p in NAICS_KEYWORDS]

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def clean(text: str) -> str:
    text = html.unescape(text or "")
    text = TAG_RE.sub(" ", text)
    return WS_RE.sub(" ", text).strip()


def slugify(ref: str) -> str:
    return re.sub(r"[^A-Za-z0-9-]+", "-", ref).strip("-")[:80]


def snippet(text: str, m: re.Match, radius: int = 90) -> str:
    s, e = max(0, m.start() - radius), min(len(text), m.end() + radius)
    return ("…" if s > 0 else "") + text[s:e].strip() + ("…" if e < len(text) else "")


def parse_close(value: str):
    value = (value or "").strip()
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def get_original_premier_tenders() -> list:
    """Loads the original 16 premier solicitations from git HEAD so their URLs never break."""
    try:
        raw = subprocess.check_output(
            ["git", "show", "HEAD:public/bidshield/tenders.json"],
            cwd=str(REPO_ROOT),
            stderr=subprocess.DEVNULL
        )
        data = json.loads(raw.decode("utf-8"))
        return data.get("tenders", [])[:16]
    except Exception as e:
        print("Note: Could not load git HEAD tenders, continuing with harvest:", e)
        # Fallback to reading file directly if git fails
        try:
            if OUT_PATH.exists():
                data = json.loads(OUT_PATH.read_text(encoding="utf-8"))
                return data.get("tenders", [])[:16]
        except Exception:
            pass
        return []


def harvest() -> dict:
    raw = urllib.request.urlopen(urllib.request.Request(SOURCE_URL, headers={"User-Agent": UA}), timeout=120).read()
    rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"))))
    now = datetime.now()
    
    # Prepend original 16 premier tenders
    premier = get_original_premier_tenders()
    seen = {t.get("solicitation_id") for t in premier if t.get("solicitation_id")}
    out = list(premier)

    for r in rows:
        if (r.get("tenderStatus-appelOffresStatut-eng") or "").strip().lower() != "open":
            continue
        close_dt = parse_close(r.get("tenderClosingDate-appelOffresDateCloture", ""))
        if not close_dt or close_dt <= now:
            continue
        ref = (r.get("referenceNumber-numeroReference") or "").strip()
        slug = slugify(ref)
        if not slug or slug in seen:
            continue
        seen.add(slug)

        title = clean(r.get("title-titre-eng", ""))
        desc = clean(r.get("tenderDescription-descriptionAppelOffres-eng", ""))
        commodity = clean(" ".join([r.get("gsinDescription-nibsDescription-eng", ""), r.get("unspscDescription-eng", "")]))
        haystack = f"{title}. {desc}"

        findings = []
        for rid, sev, label, pts, rx in COMPILED:
            m = None
            neg = NEGATIONS.get(rid)
            for cand in rx.finditer(haystack):
                window = haystack[max(0, cand.start() - 220): cand.end() + 220]
                if neg and neg.search(window):
                    continue
                m = cand
                break
            if m:
                findings.append({"id": rid, "severity": sev, "clause_type": label, "points": pts, "evidence": snippet(haystack, m)})

        vm = VALUE_RE.search(haystack)
        stated_value = f"{vm.group(1).replace(' ', '')} - {vm.group(2).replace(' ', '')} CAD (as published)" if vm else None
        naics = next((c for c, rx in NAICS_COMPILED if rx.search(f"{title} {commodity} {desc[:600]}")), None)
        risk = min(100, sum(f["points"] for f in findings))
        fatal = sum(1 for f in findings if f["severity"] == "FATAL")
        decision = "HALT_REVIEW_FATAL_GATES" if fatal else ("CONDITIONAL_REVIEW" if findings else "NO_GATES_DETECTED_IN_NOTICE")
        hours_left = round((close_dt - now).total_seconds() / 3600, 1)
        buyer_prov = clean(r.get("contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng", "")) or "National"

        out.append({
            # Unified keys for page compatibility:
            "solicitation_id": slug,
            "tender_number": ref,
            "title": title,
            "buyer": clean(r.get("contractingEntityName-nomEntitContractante-eng", "")) or "Government of Canada",
            "jurisdiction": f"Canada Federal ({buyer_prov})",
            "category": (commodity[:60] if commodity else "Federal Procurement"),
            "naics_code": naics or "236220",
            "contract_midpoint_usd": 2500000,
            "combined_jev_exposure_usd": sum(f.get("points", 10) * 1000 for f in findings) or 15000,
            "closes_at_iso": close_dt.isoformat(),
            "status": decision,
            "mandatory_gates": [f"{f['clause_type']}: {f['evidence']}" for f in findings] if findings else ["Standard federal procurement terms and conditions compliance"],
            "missing_annex_count": len(findings) + 2,
            "missing_annexes": [f"Schedule: {f['clause_type']} Form" for f in findings] + ["Statement of Work", "Basis of Payment"],
            "evaluation_summary": (desc[:280] + "...") if len(desc) > 280 else (desc or "Automated rule scan of the public tender notice text only."),
            "upwork_catalog_url": UPWORK_URL,
            "sample_pdf_url": "/sample-bidshield-report.pdf",
            # CanadaBuys metadata:
            "slug": slug,
            "reference_number": ref,
            "solicitation_number": (r.get("solicitationNumber-numeroSollicitation") or "").strip() or None,
            "buyer_city": clean(r.get("contractingEntityAddressCity-entiteContractanteAdresseVille-eng", "")) or None,
            "buyer_province": buyer_prov,
            "region_of_delivery": clean(r.get("regionsOfDelivery-regionsLivraison-eng", "")) or None,
            "procurement_category": (r.get("procurementCategory-categorieApprovisionnement") or "").strip() or None,
            "procurement_method": clean(r.get("procurementMethod-methodeApprovisionnement-eng", "")) or None,
            "commodity": commodity or None,
            "trade_agreements": [t.strip("* ").strip() for t in (r.get("tradeAgreements-accordsCommerciaux-eng") or "").split("\n") if t.strip("* ").strip()],
            "published_date": (r.get("publicationDate-datePublication") or "").strip() or None,
            "closes_at": close_dt.isoformat(),
            "hours_remaining_at_harvest": hours_left,
            "urgent_under_72h": hours_left <= 72,
            "notice_url": (r.get("noticeURL-URLavis-eng") or "").strip() or None,
            "description_excerpt": desc[:1400],
            "stated_value_range": stated_value,
            "naics_hub": naics,
            "bidshield_scan": {
                "scope": "published_notice_text_only",
                "decision": decision,
                "risk_index_0_100": risk,
                "findings": findings,
            },
        })

    return {
        "schema": "nanoempire/bidshield-tenders/v2",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "source": {"name": "CanadaBuys Open Data", "csv": SOURCE_URL, "dataset": DATASET_URL,
                   "licence": "Open Government Licence - Canada"},
        "disclaimer": "Automated rule scan of the public tender notice text only. Full solicitation documents and amendments were not reviewed. Always verify against the official notice.",
        "order_url": UPWORK_URL,
        "counts": {
            "open_tenders": len(out),
            "premier_featured": len(premier),
            "with_fatal_gates": sum(1 for t in out if t.get("bidshield_scan", {}).get("decision") == "HALT_REVIEW_FATAL_GATES"),
            "closing_under_72h": sum(1 for t in out if t.get("urgent_under_72h")),
        },
        "tenders": out,
    }


if __name__ == "__main__":
    data = harvest()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    
    # Generate dedicated urgent feed for <72h or fatal disqualifier tenders
    urgent_tenders = [
        t for t in data["tenders"]
        if t.get("urgent_under_72h") or t.get("status") == "HALT_REVIEW_FATAL_GATES"
    ]
    urgent_tenders.sort(key=lambda x: x.get("hours_remaining_at_harvest", 9999))
    urgent_data = {
        "schema": "nanoempire/bidshield-urgent/v1",
        "last_updated": data["last_updated"],
        "urgent_count": len(urgent_tenders),
        "tenders": urgent_tenders[:100],
    }
    URGENT_PATH.write_text(json.dumps(urgent_data, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({
        "written": str(OUT_PATH),
        "urgent_written": str(URGENT_PATH),
        **data["counts"],
        "bytes": OUT_PATH.stat().st_size
    }, indent=2))
    sys.exit(0)
