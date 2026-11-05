import json
import pathlib
import datetime as dt

pub = pathlib.Path(r"C:\Users\robla\empire\nanoempire-web\public")
sm_path = pub / "sitemap.xml"
cpsc = json.loads((pub / "recalls" / "latest-cpsc.json").read_text(encoding="utf-8")).get("recalls", [])
audits = json.loads((pub / "skillproof" / "preaudits.json").read_text(encoding="utf-8")).get("audits", [])
retailers = ["amazon", "walmart", "target", "costco", "best-buy", "home-depot", "lowes"]

base_urls = [
    "https://www.nanoempireai.com/",
    "https://www.nanoempireai.com/skillproof",
    "https://www.nanoempireai.com/recall-report",
    "https://www.nanoempireai.com/ledger",
    "https://www.nanoempireai.com/podcast",
    "https://www.nanoempireai.com/case-studies",
    "https://www.nanoempireai.com/docs",
    "https://www.nanoempireai.com/status.json",
    "https://www.nanoempireai.com/changelog.json",
    "https://www.nanoempireai.com/daily-delta.md",
]

today = dt.date.today().isoformat()
xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]

for u in base_urls:
    xml_lines.extend([
        "  <url>",
        f"    <loc>{u}</loc>",
        f"    <lastmod>{today}</lastmod>",
        "    <changefreq>daily</changefreq>",
        "    <priority>1.0</priority>",
        "  </url>",
    ])

for r in cpsc:
    rid = r.get("recall_id") or r.get("recall_number")
    xml_lines.extend([
        "  <url>",
        f"    <loc>https://www.nanoempireai.com/recalls/{rid}</loc>",
        f"    <lastmod>{today}</lastmod>",
        "    <changefreq>daily</changefreq>",
        "    <priority>0.8</priority>",
        "  </url>",
    ])

for ret in retailers:
    xml_lines.extend([
        "  <url>",
        f"    <loc>https://www.nanoempireai.com/recalls/retailer/{ret}</loc>",
        f"    <lastmod>{today}</lastmod>",
        "    <changefreq>daily</changefreq>",
        "    <priority>0.8</priority>",
        "  </url>",
    ])

for a in audits:
    repo = a.get("repo")
    xml_lines.extend([
        "  <url>",
        f"    <loc>https://www.nanoempireai.com/skillproof/repo/{repo}</loc>",
        f"    <lastmod>{today}</lastmod>",
        "    <changefreq>daily</changefreq>",
        "    <priority>0.8</priority>",
        "  </url>",
    ])

xml_lines.append("</urlset>")
sm_path.write_text("\n".join(xml_lines), encoding="utf-8")
print(f"Successfully generated sitemap with {len(base_urls) + len(cpsc) + len(retailers) + len(audits)} URLs.")
