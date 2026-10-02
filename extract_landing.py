#!/usr/bin/env python3
"""
Extract landing page components from nanoempire-landing/index.html
and create pages in nanoempire-web.
"""

import re
from pathlib import Path

SRC = Path(r"C:\Users\robla\nanoempire-landing\index.html")
DST = Path(r"C:\Users\robla\empire\nanoempire-web")

html = SRC.read_text(encoding="utf-8")

# Extract static assets that should be in public/
# 1. llms.txt
# 2. offers.json
# 3. manifests.html
# 4. agent-card.json
# 5. openapi.json

# Let's also create the landing page as a new route
# We'll create app/landing/page.tsx with the full landing content

print("Source HTML length:", len(html))
print("Extracting key sections...")

# Find sections by ID
sections = {}
for match in re.finditer(r'<section class="block" id="([^"]+)">(.*?)</section>', html, re.DOTALL):
    sections[match.group(1)] = match.group(0)

for name, content in sections.items():
    print(f"  Section: {name} ({len(content)} chars)")

# Also extract static files from the other files
static_files = {
    "llms.txt": Path(r"C:\Users\robla\nanoempire-landing\llms.txt").read_text(),
    "offers.json": Path(r"C:\Users\robla\nanoempire-landing\offers.json").read_text(),
    "manifests.html": Path(r"C:\Users\robla\nanoempire-landing\manifests.html").read_text(),
}

for name, content in static_files.items():
    print(f"  Static: {name} ({len(content)} chars)")

print("\nDone extracting. Now creating pages...")