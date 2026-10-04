from pathlib import Path
f = Path(r"C:\Users\robla\empire\nanoempire-web\app\recall-report\sample\page.tsx")
content = f.read_text(encoding="utf-8")
content = content.replace("this vehicle's make", "this vehicle&apos;s make")
f.write_text(content, encoding="utf-8")
