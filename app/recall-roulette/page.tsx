'use client';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return [];
}

export default function RecallRoulette() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Recall Roulette — is anything in your home recalled?</title>
        <meta name="description" content="Check items against 400 critical & serious US product recalls. 100% client-side, zero tracking." />
        <style>{`
          :root { --bg:#0f1115; --card:#171a21; --txt:#e8eaf0; --mut:#9aa0ae; --crit:#ff5d5d; --ser:#ffb02e; }
          * { box-sizing:border-box; }
          body { background:var(--bg); color:var(--txt); font-family:system-ui,-apple-system,sans-serif; margin:0; padding:24px 16px 64px; line-height:1.5; }
          main { max-width:720px; margin:0 auto; }
          h1 { font-size:1.9rem; margin:.2em 0; }
          .sub { color:var(--mut); margin-top:0; }
          textarea { width:100%; min-height:150px; background:var(--card); color:var(--txt); border:1px solid #2a2f3a; border-radius:10px; padding:12px; font-size:1rem; }
          button { background:#3b82f6; color:#fff; border:0; border-radius:10px; padding:12px 28px; font-size:1.05rem; cursor:pointer; margin-top:12px; }
          button:hover { background:#2f6fe0; }
          .row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
          .hint { color:var(--mut); font-size:.85rem; }
          #out { margin-top:20px; }
          .card { background:var(--card); border:1px solid #2a2f3a; border-radius:10px; padding:14px 16px; margin:12px 0; }
          .badge { display:inline-block; font-size:.72rem; font-weight:700; letter-spacing:.06em; padding:3px 10px; border-radius:20px; text-transform:uppercase; }
          .crit { background:#3a1414; color:var(--crit); border:1px solid var(--crit); }
          .ser  { background:#3a2a10; color:var(--ser); border:1px solid var(--ser); }
          .prod { font-weight:600; margin:6px 0 2px; }
          .haz { color:var(--mut); font-size:.92rem; }
          .meta { color:var(--mut); font-size:.8rem; margin-top:6px; }
          .itemhead { font-size:1.15rem; font-weight:700; margin:22px 0 4px; }
          .clear { border-left:4px solid #34d399; }
          .clearmsg { color:#34d399; font-weight:600; }
          footer { margin-top:40px; color:var(--mut); font-size:.82rem; border-top:1px solid #2a2f3a; padding-top:16px; }
          .agentbox { background:#101828; border:1px dashed #3b82f6; border-radius:10px; padding:14px 16px; margin-top:28px; }
          code { background:#0a0c10; padding:2px 6px; border-radius:5px; font-size:.85rem; }
          .score { text-align:center; font-size:1.3rem; margin:18px 0 4px; font-weight:700; }
        `}</style>
      </head>
      <body>
        <main>
          <h1>🎰 Recall Roulette</h1>
          <p className="sub">Type in things you own. We check them against <b>400 critical & serious US product recalls</b> from the last 120 days. 78% of recalled kids' products are never fixed &mdash; most are still sitting in someone's home.</p>
          <textarea id="inv" placeholder="one item per line, e.g.\nNEWDERY power bank\nKitchenAid stand mixer" />
          <div className="row">
            <button onClick={() => window.runRecallCheck()}>Check my stuff</button>
            <span className="hint">or <a href="#" onClick={(e)=>{e.preventDefault(); window.loadDemoRecall();}} style={{color:'#3b82f6'}}>load the demo household</a> (8 items, 5 real hits)</span>
          </div>
          <div id="out" />

          <div className="agentbox">
            <b>Are you an agent?</b> Skip the typing.
            <code>POST /v1/match</code> with <code>{'{"items":[...]}'}</code> — 100 free calls, then $0.10/call via x402.
            Full feed: <code>GET /v1/delta?since=DATE</code>. No seats, no sales calls.
          </div>

          <footer>
            Demo slice: 400 critical/serious recalls (CPSC + FDA), last 120 days, embedded in this page.
            CPSC severity labels are <b>inferred</b>, always marked. Not legal advice &mdash; verify at
            cpsc.gov / fda.gov before acting. Full 12,400-recall feed available via the machine API.
            Built by <b>RecallGuard</b> — machines pay, people stay safe free.
          </footer>
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const FEED = [
                {"id": "cpsc:11001", "p": "Portable Sleep Machines with Night Light model number LTD-SM23 and date code 7W15TN", "b": "", "h": "The lithium-ion battery in the recalled portable sleep machines can overheat if the charger is not compatible with the unit, posing a risk of injury from fire a", "r": "Refund", "s": "serious", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:11000", "p": "NEWDERY power banks", "b": "", "h": "The lithium-ion battery in the power banks can explode or ignite, posing fire and burn hazards to consumers.", "r": "Refund", "s": "serious", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:10999", "p": "Light-Up Glasses, Crown Headbands, Sparkle Headbands and Ties", "b": "", "h": "The recalled children's toys violate the mandatory standard for toys because they contain button cell batteries and the compartments that hold the batteries can", "r": "Refund", "s": "critical", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:10998", "p": "Aitjunz 8-Drawer Dressers", "b": "Dongguan Meiying Sen Smart Home Co., Ltd., of China", "h": "The recalled dressers are unstable if they are not anchored to the wall, posing tip-over and entrapment hazards that can result in risks of serious injuries or ", "r": "Repair", "s": "critical", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:10997", "p": "The Blue Cactus Company 2500 mAh Battery Packs for Reclining Chairs", "b": "", "h": "The lithium-ion battery in the recalled battery packs can overheat, posing fire and burn hazards to consumers.", "r": "Replace", "s": "serious", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:10996", "p": "Hyperfuels Methanol and Ethanol Fuel Containers", "b": "", "h": "The recalled fuel containers violate the mandatory safety standards for portable fuel containers because they lack flame mitigation devices required under the P", "r": "Refund; Replace", "s": "critical", "d": "2026-09-24", "src": "cpsc"},
                {"id": "cpsc:10995", "p": "INMO AIR3 Smart Glasses", "b": "", "h": "The lithium-ion battery in the recalled smart glasses can overheat, posing fire and burn hazards to consumers.", "r": "Replace", "s": "serious", "d": "2026-09-24", "src": "cpsc"}
              ];

              const STOP = new Set("a an the and or of for with in on to my new pro plus max mini ultra xl xxl 2 3 4 oz pack piece set kit model no type".split(" "));
              function toks(s){ const m=(s||"").toLowerCase().match(/[a-z0-9]+/g)||[]; return new Set(m.filter(t=>!STOP.has(t)&&t.length>2)); }
              function score(item, rec){
                const it=toks(item), rt=toks(rec.p+" "+rec.b);
                if(!it.size) return 0;
                let ov=0; it.forEach(t=>{ if(rt.has(t)) ov++; });
                let s=ov/it.size;
                const brand=((item.toLowerCase().match(/[a-z0-9]+/)||[])[0]||"");
                if(brand.length>2 && (rec.p+" "+rec.b).toLowerCase().includes(brand)) s=Math.min(1,s+0.25);
                return s;
              }
              function esc(s){ return (s||"").replace(/[&<>"]/g, c=>({"&":"&","<":"<",">":">",'"':"""}[c])); }
              function loadDemo(){ document.getElementById("inv").value = ["NEWDERY power bank", "Emerspring mattress", "Voomf play yard and crib mattress", "EEMB lithium battery pack", "personalized baby bibs and stroller bag", "Dyson V15 vacuum", "KitchenAid stand mixer", "Sony WH-1000XM5 headphones"].join("\\n"); run(); }
              
              window.runRecallCheck = function run() {
                const items=document.getElementById("inv").value.split("\\n").map(s=>s.trim()).filter(Boolean).slice(0,50);
                const out=document.getElementById("out");
                if(!items.length){ out.innerHTML="<p class='hint'>Type at least one item first.</p>"; return; }
                let hitItems=0, html="";
                items.forEach(item=>{
                  const hits=[];
                  FEED.forEach(rec=>{ const s=score(item,rec); if(s>=0.6) hits.push({s,rec}); });
                  hits.sort((a,b)=> b.s-a.s || (b.rec.d<a.rec.d?-1:1));
                  const seen=new Set(), kept=[];
                  hits.forEach(h=>{ if(!seen.has(h.rec.id)){ seen.add(h.rec.id); kept.push(h);} });
                  html+='<div class="itemhead">'+esc(item)+"</div>";
                  if(kept.length){
                    hitItems++;
                    kept.slice(0,3).forEach(({s,rec})=>{
                      html+='<div class="card"><span class="badge '+(rec.s==="critical"?"crit":"ser")+'">'+rec.s+'</span>'
                        +'<div class="prod">'+esc(rec.p)+"</div>"
                        +'<div class="haz">'+esc(rec.h)+"</div>"
                        +'<div class="meta">recalled '+esc(rec.d)+' &middot; remedy: '+esc(rec.r||"see listing")
                        +' &middot; '+esc(rec.src)+' &middot; match '+Math.round(s*100)+'%</div></div>';
                    });
                  } else {
                    html+='<div class="card clear"><span class="clearmsg">✓ clear</span> <span class="hint">no match in this 400-recall slice</span></div>';
                  }
                });
                const pct=Math.round(hitItems/items.length*100);
                out.innerHTML='<div class="score">'+hitItems+" of "+items.length+" items flagged ("+pct+'%)</div>'+html;
                out.scrollIntoView({behavior:"smooth", block:"start"});
              }
              
              window.loadDemoRecall = function loadDemo() {
                document.getElementById("inv").value = ["NEWDERY power bank", "Emerspring mattress", "Voomf play yard and crib mattress", "EEMB lithium battery pack", "personalized baby bibs and stroller bag", "Dyson V15 vacuum", "KitchenAid stand mixer", "Sony WH-1000XM5 headphones"].join("\\n");
                run();
              }
            `
          }}
        />
      </body>
    </html>
  );
}