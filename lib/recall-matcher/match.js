/* eslint-disable */
'use strict';
const { load, index, tokenize, gtin14 } = require('./data');

const THRESHOLD = 0.62;   // tuned on real positives vs common non-recalled household items (see README)
const MAX_MATCHES = 5;
const BODY_WEIGHT = 0.5; // a token found only deep in a long description counts half
const MAX_DF_FRACTION = 0.2; // tokens present in >20% of records don't generate candidates

function summarize(r, score, type) {
  return {
    recall_id: r.id, score: Math.round(score * 1000) / 1000, match_type: type,
    source: r.source, severity: r.severity, classification: r.classification,
    title: r.title, firm: r.firm, recall_date: r.recall_date, hazard: r.hazard, url: r.url,
  };
}

function matchItem(item) {
  const ds = load();
  const ix = index();
  const out = new Map();
  const upcIn = item && item.upc != null ? String(item.upc) : '';
  const g = upcIn ? gtin14(upcIn) : null;
  if (g && ix.upc.has(g)) for (const i of ix.upc.get(g)) out.set(i, { score: 1, type: 'upc_exact' });

  const brandToks = [...new Set(tokenize(item && item.brand))];
  let nameToks = [...new Set(tokenize(item && item.name))];
  const nameOnly = nameToks.filter((t) => !brandToks.includes(t));
  if (brandToks.length && nameOnly.length) nameToks = nameOnly;

  if (nameToks.length) {
    const weights = nameToks.map((t) => ix.idf(t));
    const total = weights.reduce((a, b) => a + b, 0);
    const acc = new Map(); // idx -> [weight, count]
    nameToks.forEach((t, k) => {
      const p = ix.postings.get(t);
      if (!p || p.length > ix.N * MAX_DF_FRACTION) return;
      for (const i of p) {
        const w = ix.headSets[i].has(t) ? weights[k] : BODY_WEIGHT * weights[k];
        const a = acc.get(i);
        if (a) { a[0] += w; a[1] += 1; } else acc.set(i, [w, 1]);
      }
    });
    // tokens too common to generate candidates still count toward coverage if present
    const common = nameToks.map((t, k) => [t, k]).filter(([t]) => { const p = ix.postings.get(t); return p && p.length > ix.N * MAX_DF_FRACTION; });
    const minHits = Math.min(2, nameToks.length);
    for (const [i, a] of acc) {
      let [w, c] = a;
      const set = ix.tokSets[i];
      for (const [t, k] of common) if (set.has(t)) { w += (ix.headSets[i].has(t) ? 1 : BODY_WEIGHT) * weights[k]; c += 1; }
      if (c < minHits) continue;
      const nameCov = w / total;
      let score;
      if (brandToks.length) {
        const brandOk = brandToks.every((t) => set.has(t));
        score = brandOk ? 0.35 + 0.65 * nameCov : 0.6 * nameCov;
      } else {
        score = 0.95 * nameCov;
      }
      if (score >= THRESHOLD && !(out.has(i) && out.get(i).type === 'upc_exact')) out.set(i, { score, type: 'token' });
    }
  }
  const ranked = [...out.entries()].sort((a, b) => b[1].score - a[1].score || (ds.records[b[0]].recall_date > ds.records[a[0]].recall_date ? 1 : -1));
  return {
    input: { name: item && item.name != null ? item.name : null, brand: item && item.brand != null ? item.brand : null, upc: upcIn || null },
    match_count: ranked.length,
    matches: ranked.slice(0, MAX_MATCHES).map(([i, m]) => summarize(ds.records[i], m.score, m.type)),
  };
}

module.exports = { matchItem, THRESHOLD, MAX_MATCHES };
