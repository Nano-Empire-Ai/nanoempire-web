import re
from pathlib import Path

page_file = Path(r"C:\Users\robla\empire\nanoempire-web\app\page.tsx")
content = page_file.read_text(encoding="utf-8")
content = re.sub(r'<label([^>]*)for=', r'<label\1htmlFor=', content)
page_file.write_text(content, encoding="utf-8")
print("Converted labels")
