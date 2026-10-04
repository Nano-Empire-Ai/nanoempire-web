import re
from pathlib import Path

# Read HTML
html = Path(r"C:\Users\robla\nanoempire-landing\index.html").read_text(encoding="utf-8")

matches = list(re.finditer(r'<section class="block"[^>]*>.*?</section>', html, re.DOTALL))
if not matches:
    print("No blocks found.")
else:
    print(f"Found {len(matches)} sections.")
    sections_html = [m.group(0) for m in matches]
    
    combined = "\n\n{/* --- IMPORTED LANDING SECTIONS --- */}\n\n" + "\n".join(sections_html)
    
    # HTML to JSX
    combined = combined.replace('class=', 'className=')
    combined = re.sub(r'<br>', '<br />', combined)
    combined = re.sub(r'<hr>', '<hr />', combined)
    combined = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', combined)
    combined = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', combined)
    
    # SVG fixes
    combined = combined.replace('stroke-width', 'strokeWidth')
    combined = combined.replace('stroke-linecap', 'strokeLinecap')
    combined = combined.replace('stroke-linejoin', 'strokeLinejoin')
    
    page_file = Path(r"C:\Users\robla\empire\nanoempire-web\app\page.tsx")
    page_content = page_file.read_text(encoding="utf-8")
    
    splice_marker = "<DoorB />"
    if splice_marker in page_content:
        parts = page_content.split(splice_marker)
        new_content = parts[0] + splice_marker + "\n" + combined + "\n" + parts[1]
        page_file.write_text(new_content, encoding="utf-8")
        print("Successfully merged into page.tsx")
    else:
        print("Could not find <DoorB /> in page.tsx")
