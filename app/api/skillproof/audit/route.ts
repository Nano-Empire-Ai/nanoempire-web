import { NextResponse } from 'next/server';
import { signAttestation } from '@/lib/attestation';

// Canonical JSON serializer for Ed25519 signature determinism
function canonicalize(v: any): string {
  if (Array.isArray(v)) return `[${v.map(canonicalize).join(',')}]`;
  if (v && typeof v === 'object' && v !== null) {
    return `{${Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonicalize(v[k])).join(',')}}`;
  }
  return JSON.stringify(v);
}

interface ForensicFinding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NOTE';
  ruleId: string;
  category: string;
  target: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serverId = (body.serverId || body.name || 'custom-agent-skill').replace(/[^a-zA-Z0-9_\-\.\/]/g, '_');
    const version = body.version || '1.0.0';
    const tools = Array.isArray(body.tools) ? body.tools : [];
    const rawContent = body.code || body.manifest || (typeof body === 'string' ? body : '');

    const findings: ForensicFinding[] = [];
    let score = 100;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Tool Schema & Parameter Invariants
    // ─────────────────────────────────────────────────────────────────────────
    for (const tool of tools) {
      const name = tool.name || 'unnamed_tool';
      const schema = tool.inputSchema || tool.parameters || {};
      const props = schema.properties || {};

      if (!schema.type || schema.type !== 'object') {
        findings.push({
          severity: 'MEDIUM',
          ruleId: 'SEC-MCP01',
          category: 'MCP Schema Integrity',
          target: name,
          message: 'Tool inputSchema is missing or not declared as object'
        });
        score -= 5;
      }

      for (const [propName, propDef] of Object.entries(props) as [string, any][]) {
        const pLower = propName.toLowerCase();
        const desc = (propDef?.description || '').toLowerCase();

        // SSRF Parameter Check
        if (pLower.includes('url') || pLower.includes('uri') || pLower.includes('webhook') || pLower.includes('endpoint')) {
          const guarded = desc.includes('allowlist') || desc.includes('whitelist') || desc.includes('domain') || desc.includes('trusted');
          if (!guarded && !propDef.enum && !propDef.pattern) {
            findings.push({
              severity: 'HIGH',
              ruleId: 'SEC-MCP02',
              category: 'SSRF & Boundary Exposure',
              target: `${name}.${propName}`,
              message: 'Unrestricted network destination parameter lacks domain allowlist or regex constraint'
            });
            score -= 15;
          }
        }

        // Path Traversal Check
        if (pLower.includes('path') || pLower.includes('filepath') || pLower.includes('dir') || pLower.includes('folder')) {
          const guarded = desc.includes('sandbox') || desc.includes('relative') || desc.includes('jail');
          if (!guarded && !propDef.pattern) {
            findings.push({
              severity: 'HIGH',
              ruleId: 'SEC-MCP03',
              category: 'Filesystem Sandboxing',
              target: `${name}.${propName}`,
              message: 'Filesystem path parameter lacks explicit root jail or path traversal guard'
            });
            score -= 15;
          }
        }

        // Shell Injection Sink Check
        if (pLower.includes('command') || pLower.includes('cmd') || pLower.includes('exec') || pLower.includes('bash') || pLower.includes('shell')) {
          findings.push({
            severity: 'CRITICAL',
            ruleId: 'SEC-MCP04',
            category: 'Command Execution Sink',
            target: `${name}.${propName}`,
            message: 'Direct shell command input exposed to LLM without strict tokenization or subprocess whitelist'
          });
          score -= 30;
        }

        // Financial / Payment Invariant
        if (pLower.includes('amount') || pLower.includes('price') || pLower.includes('wallet') || pLower.includes('recipient') || pLower.includes('card')) {
          const hasGate = desc.includes('confirm') || desc.includes('approval') || desc.includes('gate') || desc.includes('human');
          if (!hasGate) {
            findings.push({
              severity: 'CRITICAL',
              ruleId: 'SEC-FIN01',
              category: 'Autonomous Financial Exposure',
              target: `${name}.${propName}`,
              message: 'Financial transfer primitive lacks mandatory Human-in-the-Loop confirmation gate'
            });
            score -= 40;
          }
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Raw Code / Regex Analysis (if code snippet provided)
    // ─────────────────────────────────────────────────────────────────────────
    if (rawContent && typeof rawContent === 'string') {
      if (/nodeIntegration\s*:\s*true/i.test(rawContent)) {
        findings.push({
          severity: 'CRITICAL',
          ruleId: 'SEC-E01',
          category: 'Electron Sandbox',
          target: 'BrowserWindow Options',
          message: 'nodeIntegration enabled in renderer process allows arbitrary shell execution on XSS'
        });
        score -= 40;
      }
      if (/contextIsolation\s*:\s*false/i.test(rawContent)) {
        findings.push({
          severity: 'CRITICAL',
          ruleId: 'SEC-E02',
          category: 'Electron Sandbox',
          target: 'WebPreferences',
          message: 'contextIsolation explicitly disabled'
        });
        score -= 30;
      }
      if (/enableRemoteModule\s*:\s*true/i.test(rawContent)) {
        findings.push({
          severity: 'HIGH',
          ruleId: 'SEC-E03',
          category: 'Electron Deprecation',
          target: 'WebPreferences',
          message: 'enableRemoteModule active; deprecated remote bridge poses severe privilege escalation'
        });
        score -= 20;
      }
      if (/webSecurity\s*:\s*false/i.test(rawContent)) {
        findings.push({
          severity: 'CRITICAL',
          ruleId: 'SEC-E04',
          category: 'Electron WebSecurity',
          target: 'WebPreferences',
          message: 'webSecurity explicitly disabled; removes Same-Origin Policy and local file boundaries'
        });
        score -= 40;
      }
    }

    score = Math.max(0, Math.min(100, score));
    const hasCritical = findings.some(f => f.severity === 'CRITICAL');
    const hasHigh = findings.some(f => f.severity === 'HIGH');
    const verdict = hasCritical ? 'FAIL' : (hasHigh ? 'WARNING' : (findings.length > 0 ? 'PASS_WITH_NOTES' : 'PASS'));

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Cryptographic Ed25519 Trust Manifest Generation
    // ─────────────────────────────────────────────────────────────────────────
    const now = new Date();
    const expires = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const payloadToSign = {
      manifest_version: '1.0',
      authority: 'SkillProof Autonomous Certification Authority',
      issuer: 'Nano Empire AI',
      server_id: serverId,
      version: version,
      scanned_at: now.toISOString(),
      expires_at: expires.toISOString(),
      score: score,
      verdict: verdict,
      tools_audited: tools.length,
      critical_violations: findings.filter(f => f.severity === 'CRITICAL').length,
      high_violations: findings.filter(f => f.severity === 'HIGH').length,
    };

    const canonicalBytes = Buffer.from(canonicalize(payloadToSign), 'utf8');
    const att = signAttestation(canonicalBytes);

    const trustManifest = {
      ...payloadToSign,
      findings: findings,
      cryptographic_proof: {
        algorithm: 'Ed25519',
        public_key: att.public_key_hex,
        signature: att.signature_hex,
        key_binding: att.key_binding,
        verification_method: att.verification_key_url ?? 'ephemeral key: proves integrity only, not issuer identity'
      },
      commercial_rails: {
        compliance_report_30: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k',
        continuous_monitoring_99: 'https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e',
        annual_license_2400: 'mailto:licensing@nanoempireai.com',
      },
      badge_markdown: `[![SkillProof Verification](https://www.nanoempireai.com/api/badge/${encodeURIComponent(serverId)})](https://www.nanoempireai.com/skillproof)`
    };

    return NextResponse.json(trustManifest);
  } catch (err: any) {
    console.error("SkillProof audit API error:", err);
    return NextResponse.json({ error: 'Audit execution failed', details: err?.message }, { status: 500 });
  }
}
