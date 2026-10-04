#!/usr/bin/env node
// Pre-pitch URL gate: exits 1 if any public URL is not 200.
// Usage: node scripts/check-urls.mjs [baseUrl] [extraPath ...]
// Run before sending outreach or publishing links.
const base = (process.argv[2] || "https://www.nanoempireai.com").replace(/\/$/, "");
const extra = process.argv.slice(3);

const paths = [
  "/", "/offers.json", "/llms.txt", "/manifests.html", "/audit-offer.html",
  "/recall-roulette", "/recall-roulette.html", "/recallguard-docs",
  "/recall-report", "/recall-report/sample", "/.well-known/agent-card.json",
  "/verified-directory", ...extra,
];

// Also probe every https URL on this host listed in offers.json.
try {
  const offers = await (await fetch(base + "/offers.json")).text();
  for (const m of offers.matchAll(/https:\/\/(?:www\.)?nanoempireai\.com(\/[^"\s\\]*)/g)) {
    paths.push(m[1]);
  }
} catch {}

let bad = 0;
for (const p of [...new Set(paths)]) {
  let status = "ERR";
  try {
    status = (await fetch(base + p, { redirect: "follow", method: "GET" })).status;
  } catch {}
  const ok = status === 200;
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "FAIL"} ${status} ${p}`);
}
console.log(bad ? `\n${bad} URL(s) failing: do not send pitches linking them.` : "\nAll URLs 200.");
process.exit(bad ? 1 : 0);
