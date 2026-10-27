#!/usr/bin/env node
/**
 * Proactive Catalog Hunter — RecallRadar Autonomous Target Scanner
 * 
 * Ingests product manifests (CSV, JSON) or crawls Shopify stores via /products.json,
 * executes fuzzy/token/UPC matching against the 46,642 recall database,
 * and outputs actionable B2B Dispute Letters & Regulatory Pre-Audit Cards.
 * 
 * Strict Compliance Locks:
 * - 15 U.S.C. § 2068(a)(2)(B) & 15 U.S.C. § 2069 ($120,000 max civil penalty/violation)
 * - Human Outbound Gate: All output is staged locally in staging/audit_reports/
 * - Catalog prices: $0.10/match (x402), $30.00 full unlock & Ed25519 Certificate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { matchItem, THRESHOLD } = require('../lib/recall-matcher/match');

const STAGING_DIR = path.join(__dirname, '..', 'staging', 'audit_reports');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchShopifyProducts(domain, limit = 250) {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const url = `https://${cleanDomain}/products.json?limit=${limit}`;
  console.log(`[*] Fetching Shopify catalog: ${url}`);
  
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`);
  }
  
  const data = await res.json();
  const products = data.products || [];
  
  return products.map(p => ({
    sku: p.variants?.[0]?.sku || `SHOPIFY-${p.id}`,
    upc: p.variants?.[0]?.barcode || '',
    brand: p.vendor || '',
    name: p.title || '',
    price: p.variants?.[0]?.price || '0.00',
    url: `https://${cleanDomain}/products/${p.handle}`,
    source_type: 'shopify'
  }));
}

function parseCSVInventory(filePath) {
  console.log(`[*] Reading inventory CSV: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
  
  return parsed.data.map(row => ({
    sku: row.SKU || row.sku || row.Item || '',
    upc: row.UPC || row.upc || row.Barcode || '',
    brand: row.Brand || row.brand || row.Manufacturer || '',
    name: row.Title || row.name || row.Description || row.Product || '',
    price: row.RetailPrice || row.Price || row.price || '0.00',
    condition: row.Condition || row.condition || 'Unknown',
    category: row.Category || row.category || 'General',
    source_type: 'manifest_csv'
  }));
}

function runAudit(items, targetName = "Inventory Scan") {
  console.log(`[*] Matching ${items.length} items against 46,642 recall database...`);
  
  const violations = [];
  const clean = [];
  
  for (const item of items) {
    if (!item.name && !item.upc) continue;
    
    const result = matchItem({
      name: item.name,
      brand: item.brand,
      upc: item.upc
    });
    
    if (result && result.matches && result.matches.length > 0) {
      const topMatch = result.matches[0];
      violations.push({
        item,
        match: topMatch,
        allMatches: result.matches
      });
    } else {
      clean.push(item);
    }
  }
  
  return {
    targetName,
    totalScanned: items.length,
    violationCount: violations.length,
    cleanCount: clean.length,
    violations,
    clean
  };
}

function generateMarkdownReport(audit) {
  const timestamp = new Date().toISOString();
  const statutoryMaxPerViolation = 120000;
  const totalMaxExposure = audit.violationCount * statutoryMaxPerViolation;
  
  let md = `# 🛡️ RecallRadar™ Pallet & Catalog Compliance Teardown\n\n`;
  md += `**Target:** ${audit.targetName}  \n`;
  md += `**Audit Timestamp:** ${timestamp}  \n`;
  md += `**Total SKUs Evaluated:** ${audit.totalScanned}  \n`;
  md += `**CPSC/FDA Unlawful Items Detected:** **${audit.violationCount}** (${((audit.violationCount / (audit.totalScanned || 1)) * 100).toFixed(1)}% of catalog)  \n`;
  md += `**Statutory Civil Liability Exposure (15 U.S.C. § 2069):** **$${totalMaxExposure.toLocaleString()}**  \n\n`;
  
  md += `---\n\n`;
  md += `## ⚠️ Executive Summary: Federal Non-Compliance Notice\n\n`;
  md += `Under **15 U.S.C. § 2068(a)(2)(B)**, it is **unlawful for any person to sell, offer for sale, manufacture for sale, distribute in commerce, or import into the United States any consumer product that is subject to voluntary corrective action or recall**.\n\n`;
  md += `This applies to **all resale channels**, including liquidation auctions, customer return pallets, bin stores, Shopify storefronts, eBay, and Amazon third-party sellers. "As-Is" disclaimers do not supersede federal product safety law.\n\n`;
  
  md += `### 🚨 Identified Violations Breakdown\n\n`;
  
  audit.violations.forEach((v, idx) => {
    md += `### ${idx + 1}. [${v.match.severity?.toUpperCase() || 'HIGH'}] ${v.item.name}\n`;
    md += `- **SKU/UPC:** \`${v.item.sku || 'N/A'}\` | \`${v.item.upc || 'N/A'}\`\n`;
    md += `- **Brand:** ${v.item.brand || 'Unspecified'}\n`;
    md += `- **Recall Official ID:** [${v.match.recall_id}](${v.match.url})\n`;
    md += `- **Issuing Agency / Source:** ${v.match.source.toUpperCase()} (${v.match.recall_date || 'Known'})\n`;
    md += `- **Match Confidence:** ${(v.match.score * 100).toFixed(1)}% (${v.match.match_type})\n`;
    md += `- **Hazard Classification:** ${v.match.hazard || 'Product safety violation subject to mandatory stop-sale'}\n\n`;
  });
  
  md += `---\n\n`;
  md += `## 📋 Actionable Stage 1: Supplier Discrepancy & Refund Claim\n\n`;
  md += `*If this manifest was purchased from B-Stock, Liquidation.com, Bulq, or an independent broker within the 5-day claim window, submit this notice immediately to demand a partial/full credit.*:\n\n`;
  
  md += `\`\`\`text\n`;
  md += `ATTN: Disputes & Claims Department\n`;
  md += `RE: Manifest Discrepancy — Illegal Recalled Merchandise (15 U.S.C. § 2068)\n`;
  md += `Order/Auction ID: [INSERT AUCTION ID]\n\n`;
  md += `Upon forensic receiving audit of the manifest referenced above, our compliance scanning system identified ${audit.violationCount} SKUs subject to mandatory Consumer Product Safety Commission (CPSC) recalls and voluntary corrective actions.\n\n`;
  md += `Under 15 U.S.C. § 2068(a)(2)(B), transfer and sale of recalled merchandise in commerce is illegal under federal law. Contractual "As-Is / Salvage" terms cannot legally convey title of recalled goods.\n\n`;
  md += `Summary of Non-Conforming Items:\n`;
  audit.violations.slice(0, 5).forEach((v, i) => {
    md += `${i + 1}. SKU ${v.item.sku}: "${v.item.name}" (Recall ${v.match.recall_id} - ${v.match.hazard || 'Safety defect'})\n`;
  });
  if (audit.violations.length > 5) {
    md += `...plus ${audit.violations.length - 5} additional recalled line items.\n`;
  }
  md += `\nWe request an immediate credit adjustment / partial refund of $[INSERT AMOUNT] for the illegal SKUs pursuant to platform seller guidelines and federal trade safety standards.\n`;
  md += `\`\`\`\n\n`;
  
  md += `---\n\n`;
  md += `## 🔒 Full Certificate & Real-Time API Access\n\n`;
  md += `- **Official 15 U.S.C. § 2068 Certificate of Compliance:** [Generate at nanoempireai.com/recall-report](https://www.nanoempireai.com/recall-report) ($30 USD via Stripe)\n`;
  md += `- **Programmatic A2A Verification (x402):** \`POST https://recallguard-api.vercel.app/api/v1/match\` ($0.10 USDC on Base)\n`;
  
  return md;
}

// CLI Execution Entrypoint
async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || path.join(__dirname, '..', 'public', 'sample_inventory.csv');
  
  console.log("============================================================");
  console.log("🎯 RECALLRADAR PROACTIVE CATALOG HUNTER");
  console.log("============================================================");
  
  ensureDir(STAGING_DIR);
  
  let items = [];
  let targetName = "";
  
  if (target.startsWith('http://') || target.startsWith('https://') || target.includes('.')) {
    if (target.endsWith('.csv')) {
      items = parseCSVInventory(path.resolve(target));
      targetName = path.basename(target);
    } else if (target.includes('.') && !target.endsWith('.json')) {
      // Treat as shopify domain
      try {
        items = await fetchShopifyProducts(target);
        targetName = target;
      } catch (err) {
        console.error(`[-] Failed Shopify crawl: ${err.message}`);
        console.log(`[*] Falling back to default inventory: public/sample_inventory.csv`);
        const fallback = path.join(__dirname, '..', 'public', 'sample_inventory.csv');
        items = parseCSVInventory(fallback);
        targetName = "Sample Liquidation Pallet";
      }
    } else {
      items = parseCSVInventory(path.resolve(target));
      targetName = path.basename(target);
    }
  } else {
    items = parseCSVInventory(path.resolve(target));
    targetName = path.basename(target);
  }
  
  const audit = runAudit(items, targetName);
  const reportMd = generateMarkdownReport(audit);
  
  const slug = targetName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const mdPath = path.join(STAGING_DIR, `audit_${slug}.md`);
  const jsonPath = path.join(STAGING_DIR, `audit_${slug}.json`);
  
  fs.writeFileSync(mdPath, reportMd, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify(audit, null, 2), 'utf-8');
  
  console.log("============================================================");
  console.log(`[+] Audit Complete!`);
  console.log(`[+] Total Scanned: ${audit.totalScanned}`);
  console.log(`[!] Violations Flagged: ${audit.violationCount}`);
  console.log(`[+] Report Staged (MD): ${mdPath}`);
  console.log(`[+] Audit Staged (JSON): ${jsonPath}`);
  console.log("============================================================");
}

main().catch(err => {
  console.error("[-] Error running proactive catalog hunter:", err);
  process.exit(1);
});
