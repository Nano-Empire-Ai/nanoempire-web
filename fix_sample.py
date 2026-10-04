from pathlib import Path
f = Path(r"C:\Users\robla\empire\nanoempire-web\app\recall-report\sample\page.tsx")
content = f.read_text(encoding="utf-8")
if "'use client';" not in content and '"use client";' not in content:
    f.write_text("'use client';\n" + content, encoding="utf-8")
