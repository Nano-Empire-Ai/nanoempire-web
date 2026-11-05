#!/usr/bin/env python3
"""
SkillProof CI/CD Security & Hygiene Gate Engine (scanner.py)
===========================================================
Runs deterministic 6-vector static analysis against AI agent skills & MCP servers.
Cites exact file paths and line coordinates for every detected sink.
Outputs GitHub Actions step summaries and sets action outputs.
"""
import argparse
import json
import os
import pathlib
import re
import sys
from typing import List, Dict, Any, Tuple

VULN_CHECKS = [
    ("DYNAMIC_EVAL", "CRITICAL", "Dynamic Code Evaluation (eval / Function)", re.compile(r"\b(eval\s*\(|new\s+Function\s*\()")),
    ("SHELL_EXEC_SURFACE", "HIGH", "Subprocess / Shell Execution Sink", re.compile(r"\b(subprocess\.(Popen|run|call|check_output)\s*\(|os\.system\s*\(|(exec|execSync|spawn|spawnSync)\s*\(|shell\s*=\s*True)")),
    ("UNBOUNDED_FS_WRITE", "MEDIUM", "Filesystem Mutation / Deletion Sink", re.compile(r"\b(fs\.(writeFile|writeFileSync|unlink|unlinkSync|rm|rmSync)\s*\(|shutil\.rmtree\s*\(|open\s*\([^)]*['\"][wa]['\"])")),
    ("ENV_SECRET_EXPOSURE", "MEDIUM", "Sensitive Credential / Full-Env Access", re.compile(r"(\b(os\.environ|os\.getenv|process\.env)\b.*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH|PRIVATE)|\b(dict\s*\(\s*os\.environ\s*\)|JSON\.stringify\s*\(\s*process\.env\s*\)))", re.IGNORECASE)),
    ("OUTBOUND_NETWORK_EGRESS", "LOW", "External Network Egress Call", re.compile(r"\b(requests\.(get|post|put|delete|request)\s*\(|httpx\.(get|post|AsyncClient|Client)\s*\(|urllib\.request\.urlopen\s*\(|(?<!net\.)fetch\s*\()")),
]

BENIGN_IMPORT = re.compile(r"^\s*(import\s+|from\s+\S+\s+import\s+|const\s+.*=\s*require\s*\(|//|#)")
IGNORE_DIRS = {".git", "node_modules", "dist", "build", "venv", ".venv", "__pycache__", ".next"}


def scan_directory(target_dir: pathlib.Path) -> Tuple[List[str], List[Dict[str, Any]], Dict[str, bool]]:
    source_files = []
    findings = []
    
    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            p = pathlib.Path(root) / f
            lower = f.lower()
            if p.suffix.lower() in {".py", ".ts", ".js", ".mjs", ".go", ".rs"}:
                source_files.append(str(p.relative_to(target_dir)))
                try:
                    content = p.read_text(encoding="utf-8", errors="ignore")
                    lines = content.splitlines()
                    for idx, line in enumerate(lines, 1):
                        if BENIGN_IMPORT.search(line):
                            continue
                        for vid, sev, title, pat in VULN_CHECKS:
                            if pat.search(line):
                                findings.append({
                                    "id": vid,
                                    "severity": sev,
                                    "title": title,
                                    "file": str(p.relative_to(target_dir)).replace("\\", "/"),
                                    "line": idx,
                                    "snippet": line.strip()[:100],
                                })
                                break
                except Exception:
                    pass

    root_files_lower = {f.name.lower() for f in target_dir.iterdir() if f.is_file()} if target_dir.exists() else set()
    hygiene = {
        "has_security_md": any("security.md" in f for f in root_files_lower),
        "has_lockfile": any(f in root_files_lower for f in ("package-lock.json", "yarn.lock", "pnpm-lock.yaml", "uv.lock", "poetry.lock", "requirements.txt", "go.sum", "cargo.lock")),
        "has_license": any(f.startswith("license") for f in root_files_lower),
    }

    return source_files, findings, hygiene


def compute_score(findings: List[Dict[str, Any]], hygiene: Dict[str, bool]) -> int:
    score = 100
    if not hygiene["has_security_md"]:
        score -= 8
    if not hygiene["has_lockfile"]:
        score -= 7
    if not hygiene["has_license"]:
        score -= 5

    seen = set()
    for fn in findings:
        k = (fn["id"], fn["file"])
        if k in seen:
            continue
        seen.add(k)
        if fn["severity"] == "CRITICAL":
            score -= 15
        elif fn["severity"] == "HIGH":
            score -= 8
        elif fn["severity"] == "MEDIUM":
            score -= 4
        else:
            score -= 2

    return max(30, min(98, score))


def main():
    parser = argparse.ArgumentParser(description="SkillProof CI/CD Security Gate")
    parser.add_argument("--scan-path", default=".", help="Root directory to scan")
    parser.add_argument("--min-score", type=int, default=80, help="Minimum score to pass")
    parser.add_argument("--fail-on-critical", default="true", help="Fail build on CRITICAL severity")
    args = parser.parse_args()

    scan_dir = pathlib.Path(args.scan_path).resolve()
    source_files, findings, hygiene = scan_directory(scan_dir)
    score = compute_score(findings, hygiene)
    critical_count = sum(1 for f in findings if f["severity"] == "CRITICAL")
    fail_on_crit = args.fail_on_critical.lower() in ("true", "1", "yes")

    passed = (score >= args.min_score) and (not fail_on_crit or critical_count == 0)

    # Set GitHub Actions output parameters if running in CI
    gh_output = os.getenv("GITHUB_OUTPUT")
    if gh_output:
        with open(gh_output, "a", encoding="utf-8") as f:
            f.write(f"skillproof_score={score}\n")
            f.write(f"findings_count={len(findings)}\n")
            f.write(f"gate_status={'PASS' if passed else 'FAIL'}\n")
            f.write(f"badge_markdown=[![SkillProof](https://img.shields.io/badge/SkillProof-{score}%2F100-{ 'brightgreen' if score >= 85 else 'orange' })](https://www.nanoempireai.com/skillproof)\n")

    # Generate Markdown Summary for GitHub Actions UI
    summary_lines = [
        "## 🛡️ SkillProof CI/CD Security Gate Summary",
        f"- **Hygiene Score:** **`{score}/100`** (Minimum Required: `{args.min_score}`)",
        f"- **Gate Status:** **`{'✅ PASSED' if passed else '❌ FAILED'}`**",
        f"- **Files Scanned:** `{len(source_files)}` source entrypoints",
        f"- **Static Sinks Detected:** `{len(findings)}` ({critical_count} CRITICAL)",
        "",
        "### Repository Governance Checks",
        f"- `SECURITY.md` Policy: `{'✅ Found' if hygiene['has_security_md'] else '⚠️ Missing (-8 pts)'}`",
        f"- Dependency Lockfile: `{'✅ Found' if hygiene['has_lockfile'] else '⚠️ Missing (-7 pts)'}`",
        f"- License Declaration: `{'✅ Found' if hygiene['has_license'] else '⚠️ Missing (-5 pts)'}`",
        "",
    ]

    if findings:
        summary_lines.append("### Static Execution Sinks Identified")
        summary_lines.append("| Severity | Type | Location | Code Snippet |")
        summary_lines.append("|:---|:---|:---|:---|")
        for fn in findings[:10]:
            clean_snip = fn['snippet'].replace("|", "\\|")
            summary_lines.append(f"| **{fn['severity']}** | `{fn['id']}` | `{fn['file']}:L{fn['line']}` | `{clean_snip}` |")
        if len(findings) > 10:
            summary_lines.append(f"*(and {len(findings) - 10} additional findings truncated)*")
        summary_lines.append("")

    summary_lines.append("---")
    summary_lines.append("🔒 *Verified by [Nano Empire SkillProof Engine](https://www.nanoempireai.com/skillproof)*")

    summary_text = "\n".join(summary_lines)
    gh_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if gh_summary:
        with open(gh_summary, "a", encoding="utf-8") as f:
            f.write(summary_text + "\n")

    # Ensure safe output stream on Windows consoles
    if sys.stdout.encoding.lower().startswith('cp') or sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    print(summary_text)

    if not passed:
        sys.exit(1)


if __name__ == "__main__":
    main()
