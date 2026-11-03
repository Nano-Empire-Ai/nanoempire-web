import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const UA = 'NanoEmpire-SkillProof-LiveScanner/3.0 (+https://www.nanoempireai.com/skillproof)';

const VULN_CHECKS: Array<{ id: string; severity: string; title: string; pat: RegExp }> = [
  {
    id: 'SHELL_EXEC_SURFACE',
    severity: 'HIGH',
    title: 'Subprocess / Shell Execution Sink',
    pat: /\b(subprocess\.(Popen|run|call|check_output)\s*\(|os\.system\s*\(|(exec|execSync|spawn|spawnSync)\s*\(|shell\s*=\s*True)/,
  },
  {
    id: 'DYNAMIC_EVAL',
    severity: 'CRITICAL',
    title: 'Dynamic Code Evaluation (eval / Function)',
    pat: /\b(eval\s*\(|new\s+Function\s*\()/,
  },
  {
    id: 'UNBOUNDED_FS_WRITE',
    severity: 'MEDIUM',
    title: 'Filesystem Mutation / Deletion Sink',
    pat: /\b(fs\.(writeFile|writeFileSync|unlink|unlinkSync|rm|rmSync)\s*\(|shutil\.rmtree\s*\(|open\s*\([^)]*['"][wa]['"])/,
  },
  {
    id: 'ENV_SECRET_EXPOSURE',
    severity: 'MEDIUM',
    title: 'Sensitive Credential / Full-Env Access',
    pat: /(\b(os\.environ|os\.getenv|process\.env)\b.*(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH|PRIVATE)|\b(dict\s*\(\s*os\.environ\s*\)|JSON\.stringify\s*\(\s*process\.env\s*\)))/i,
  },
  {
    id: 'OUTBOUND_NETWORK_EGRESS',
    severity: 'LOW',
    title: 'External Network Egress Call',
    pat: /\b(requests\.(get|post|put|delete|request)\s*\(|httpx\.(get|post|AsyncClient|Client)\s*\(|urllib\.request\.urlopen\s*\(|(?<!net\.)fetch\s*\()/,
  },
];

const BENIGN_LINE = /^\s*(import\s+|from\s+\S+\s+import\s+|const\s+.*=\s*require\s*\(|\/\/|#)/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawRepo = String(body.repo || '')
      .trim()
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/+$/, '');

    if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(rawRepo)) {
      return NextResponse.json(
        { error: 'Enter a valid GitHub repository in owner/repo format (e.g. modelcontextprotocol/servers)' },
        { status: 400 }
      );
    }

    const metaRes = await fetch(`https://api.github.com/repos/${rawRepo}`, {
      headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    });
    if (!metaRes.ok) {
      return NextResponse.json(
        { error: `GitHub repository "${rawRepo}" not found or rate-limited (${metaRes.status}).` },
        { status: 404 }
      );
    }
    const repoMeta = await metaRes.json();
    const defaultBranch = repoMeta.default_branch || 'main';
    const stars = repoMeta.stargazers_count || 0;
    const licenseInfo = repoMeta.license?.spdx_id || 'NOASSERTION';

    const treeRes = await fetch(
      `https://api.github.com/repos/${rawRepo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json' },
        next: { revalidate: 300 },
      }
    );
    if (!treeRes.ok) {
      return NextResponse.json({ error: 'Unable to fetch repository file tree.' }, { status: 502 });
    }
    const treeData = await treeRes.json();
    const treeSha = String(treeData.sha || 'unknown').slice(0, 12);
    const files: string[] = (treeData.tree || [])
      .filter((item: { type?: string; path?: string }) => item.type === 'blob' && item.path)
      .map((item: { path: string }) => item.path);

    const lowerFiles = files.map((f) => f.toLowerCase());
    const hasSecurityMd = lowerFiles.some((f) => f.includes('security.md'));
    const hasLockfile = lowerFiles.some((f) =>
      ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'uv.lock', 'poetry.lock', 'requirements.txt'].some((ext) =>
        f.endsWith(ext)
      )
    );
    const hasTests = lowerFiles.some((f) => f.includes('test'));

    const candidates = files
      .filter(
        (f) =>
          (f.endsWith('.py') || f.endsWith('.ts') || f.endsWith('.js')) &&
          !['test', 'node_modules', 'dist', 'venv', 'example'].some((skip) => f.toLowerCase().includes(skip))
      )
      .sort((a, b) => {
        const aPrio = ['server', 'mcp', 'tool', 'index', 'main', 'cli'].some((k) => a.toLowerCase().includes(k)) ? 0 : 1;
        const bPrio = ['server', 'mcp', 'tool', 'index', 'main', 'cli'].some((k) => b.toLowerCase().includes(k)) ? 0 : 1;
        return aPrio - bPrio || a.length - b.length;
      })
      .slice(0, 4);

    const findings: Array<{
      id: string;
      severity: string;
      title: string;
      file: string;
      line: number;
      snippet: string;
    }> = [];
    const seen = new Set<string>();

    for (const fpath of candidates) {
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${rawRepo}/${defaultBranch}/${fpath}`, {
          headers: { 'User-Agent': UA },
        });
        if (!rawRes.ok) continue;
        const text = await rawRes.text();
        const lines = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (BENIGN_LINE.test(line)) continue;
          for (const check of VULN_CHECKS) {
            if (check.pat.test(line)) {
              const key = `${check.id}:${fpath}`;
              if (!seen.has(key)) {
                seen.add(key);
                findings.push({
                  id: check.id,
                  severity: check.severity,
                  title: check.title,
                  file: fpath,
                  line: i + 1,
                  snippet: line.trim().slice(0, 100),
                });
              }
              break;
            }
          }
        }
      } catch {
        // continue
      }
    }

    let score = 100;
    const governanceGaps: string[] = [];
    if (!hasSecurityMd) {
      score -= 8;
      governanceGaps.push('Missing `SECURITY.md` vulnerability disclosure policy');
    }
    if (!hasLockfile) {
      score -= 7;
      governanceGaps.push('No deterministic dependency lockfile (`uv.lock` / `package-lock.json`)');
    }
    if (!hasTests) {
      score -= 5;
      governanceGaps.push('No automated test suite detected in tree');
    }

    for (const fn of findings) {
      if (fn.severity === 'CRITICAL') score -= 15;
      else if (fn.severity === 'HIGH') score -= 8;
      else if (fn.severity === 'MEDIUM') score -= 4;
      else score -= 2;
    }
    score = Math.max(35, Math.min(98, score));

    const hash = crypto.createHash('sha256').update(`${rawRepo}:${treeSha}:${score}`).digest('hex').slice(0, 16).toUpperCase();

    return NextResponse.json({
      repo: rawRepo,
      stars,
      branch: defaultBranch,
      tree_sha: treeSha,
      license: licenseInfo,
      total_files_in_repo: files.length,
      sampled_source_files: candidates,
      skillproof_score: score,
      governance_gaps: governanceGaps,
      code_surface_findings: findings.slice(0, 6),
      preaudit_id: `SP-${hash}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal scanner error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
