import re
from pathlib import Path

def style_to_jsx(match):
    # match.group(1) is the inner string like 'max-width:720px;margin:3rem auto;'
    style_str = match.group(1)
    rules = [r.strip() for r in style_str.split(';') if r.strip()]
    obj_props = []
    for rule in rules:
        if ':' not in rule: continue
        k, v = rule.split(':', 1)
        k = k.strip()
        v = v.strip()
        
        # camelCase conversion (e.g. max-width -> maxWidth)
        parts = k.split('-')
        if len(parts) > 1:
            k = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            
        obj_props.append(f"{k}: '{v}'")
        
    return "style={{" + ", ".join(obj_props) + "}}"

page_file = Path(r"C:\Users\robla\empire\nanoempire-web\app\page.tsx")
content = page_file.read_text(encoding="utf-8")
content = re.sub(r'style="([^"]*)"', style_to_jsx, content)
page_file.write_text(content, encoding="utf-8")
print("Converted styles")
