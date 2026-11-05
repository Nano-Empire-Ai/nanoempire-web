# SkillProof CI/CD Security Gate

Automated 6-vector security and governance scanner for Model Context Protocol (MCP) servers, agent skills, and AI tools.

[![SkillProof](https://img.shields.io/badge/SkillProof-Verified-blue)](https://www.nanoempireai.com/skillproof)

## Features

- **Subprocess / Shell Exec Sinks:** Detects unvalidated `subprocess.Popen`, `os.system`, `execSync`, `spawn`.
- **Dynamic Evaluation:** Flags dangerous `eval()` and `new Function()` invocations.
- **Filesystem Mutation:** Scans for unbounded file writes and deletions.
- **Credential Exposure:** Audits `os.environ` / `process.env` leaks and serialization.
- **Network Egress:** Identifies outbound network calls.
- **Governance Hygiene:** Verifies `SECURITY.md`, deterministic lockfiles, and license declarations.

## Quick Start

Add this workflow to `.github/workflows/skillproof.yml` in your repository:

```yaml
name: SkillProof Security Gate

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run SkillProof Gate
        uses: Nano-Empire-Ai/skillproof-action@v1
        with:
          min_score: 80
          fail_on_critical: true
```

## Action Inputs

| Input | Description | Default |
|---|---|---|
| `min_score` | Minimum required hygiene score (0–100) to pass the build | `80` |
| `scan_path` | Root directory path to inspect | `.` |
| `fail_on_critical` | Fail build immediately if CRITICAL sinks (eval) are found | `true` |

## Outputs

- `skillproof_score`: The calculated score (0–100).
- `findings_count`: Total number of detected static execution sinks.
- `gate_status`: `PASS` or `FAIL`.
- `badge_markdown`: Ready-to-paste markdown badge for your README.

---
Official verification and cryptographic Ed25519 Trust Manifests: [Nano Empire SkillProof](https://www.nanoempireai.com/skillproof)
