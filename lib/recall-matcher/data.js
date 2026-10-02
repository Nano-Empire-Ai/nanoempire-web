/* eslint-disable */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

let DS = null;

const STOP = new Set(('a an and or the of for with without in on at to by from into over per as is are was be this that these those it its ' +
  'recall recalls recalled recalling due risk hazard hazards product products brand brands item items model models ' +
  'oz fl lb lbs ml mg mcg kg g gram grams ounce ounces count ct pack pk pkg package packages net wt weight size sizes unit units case cases ' +
  'inch inches in ft mm cm each ea set sets new sold only also all other various assorted type types style styles color colors ' +
  'bag bags box boxes bottle bottles can cans jar jars container containers label labeled labeling upc code codes lot lots number no ' +
  'include includes included including following involve involves consist consists usa us inc llc co corp corporation company ltd').split(/\s+/));

function tokenize(s) {
  if (!s) return [];
  const out = [];
  const parts = String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/);
  for (let t of parts) {
    if (!t) continue;
    if (/^\d+$/.test(t)) { if (t.length < 4) continue; }
    else if (t.length < 2) continue;
    if (STOP.has(t)) continue;
    if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) t = t.slice(0, -1);
    if (STOP.has(t)) continue;
    out.push(t);
  }
  return out;
}

function gtin14(code) {
  const d = String(code || '').replace(/\D/g, '');
  if (d.length < 8 || d.length > 14) return null;
  return d.padStart(14, '0');
}

function load() {
  if (DS) return DS;
  const file = path.join(process.cwd(), 'lib/recall-matcher/recalls.json.gz');
  const raw = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'));
  DS = { meta: raw.meta, records: raw.records, index: null };
  return DS;
}

function index() {
  const ds = load();
  if (ds.index) return ds.index;
  const postings = new Map(); // token -> Int32Array-ish array of record idx
  const upc = new Map();      // gtin14 -> [idx]
  const tokSets = new Array(ds.records.length);
  const headSets = new Array(ds.records.length);
  ds.records.forEach((r, i) => {
    // "head" = title, product names, brand/firm and the start of the description; the rest is "body"
    const head = new Set(tokenize([r.title, (r.product_names || []).join(' '), r.brand, r.firm, (r.product_description || '').slice(0, 220)].filter(Boolean).join(' ')));
    const set = new Set([...head, ...tokenize(r.product_description)]);
    tokSets[i] = set;
    headSets[i] = head;
    for (const t of set) {
      let p = postings.get(t);
      if (!p) postings.set(t, (p = []));
      p.push(i);
    }
    for (const u of r.upcs || []) {
      const g = gtin14(u);
      if (!g) continue;
      let p = upc.get(g);
      if (!p) upc.set(g, (p = []));
      if (!p.includes(i)) p.push(i);
    }
  });
  const N = ds.records.length;
  const idf = (t) => { const p = postings.get(t); return Math.log(1 + N / ((p ? p.length : 0) + 1)); };
  ds.index = { postings, upc, tokSets, headSets, idf, N };
  return ds.index;
}

module.exports = { load, index, tokenize, gtin14 };
