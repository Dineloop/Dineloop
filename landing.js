// DineLoop Official SaaS Landing Page — Original Design, Real Guides Hub, Animated 2-Min Tour Video & Self-Serve Trial
window.lpTab = window.lpTab || "billing";
window.lpFmt = window.lpFmt || "Restaurants";
window.lpYearly = !!window.lpYearly;
window.lpBills = window.lpBills || 50;
window.lpAvg = window.lpAvg || 350;
window.lpFaqOpen = window.lpFaqOpen ?? 0;
window.lpResOpen = false;

const LP_FORMATS = {
  "Restaurants": {
    desc: "Manage busy dining rooms with live table occupancy, guest count (Pax), station-wise KOT routing, split/merge bills, and anti-fraud prepaid codes.",
    bullets: ["Live Floor Map with sitting timers", "Separate Waiter Phone PWA", "Station KOTs (Main, Tandoor, Beverage)", "Split & merge tables in 1 tap", "GSTR-1 slabs & Day-End Z-report"]
  },
  "Cafes & Bakeries": {
    desc: "Fast counter billing with variants (Hot/Iced, Regular/Large), add-ons, happy-hour combos, and loyalty points that turn morning coffee buyers into regulars.",
    bullets: ["Variants, modifiers & combos", "Happy-Hour auto discounts", "Prepaid guest wallet & gift cards", "Menu Photo/PDF OCR import", "Zero-paper WhatsApp E-bills"]
  },
  "Cloud Kitchens": {
    desc: "Track Dine-In, Takeaway, Swiggy, Zomato & ONDC orders on one unified Kitchen Display with prep timers, sound alerts, and recipe-level food costing.",
    bullets: ["Unified Kitchen Display (KDS)", "Overdue prep alerts + Recall ticket", "Swiggy / Zomato / ONDC inbox", "BOM multi-ingredient stock deduction", "Delivery zones & rider COD tracking"]
  },
  "QSR & Fast Food": {
    desc: "Daily counter token numbers (#1, #2...), instant Cash & UPI QR checkout, customer-facing display screen, and F2/F4/F8 keyboard shortcuts.",
    bullets: ["Auto daily Counter Token numbers", "2nd-screen Customer Display (/display.html)", "Barcode SKU quick scanning", "1-click Cash-and-Go + KOT", "Shift cash drawer denomination tally"]
  },
  "Hotels & Lounges": {
    desc: "Multi-station routing across kitchen and bar, waiter table-side UPI QR with exact balance math, and central multi-outlet management.",
    bullets: ["Multi-station KOT routing", "Waiter table-side exact UPI QR", "Prepaid reception 4-digit verify code", "Staff attendance, shifts & tip tracking", "Multi-outlet central menu push"]
  }
};

const LP_FAQS = [
  ["How fast can my restaurant go live on DineLoop?", "Under 10 minutes. Start a 14-day free trial, upload a photo or PDF of your menu to auto-import dishes, enter your UPI ID in Settings, and start billing immediately."],
  ["Do I need to buy special POS hardware?", "No. DineLoop runs on any Windows laptop, Mac, tablet, or Android phone. Install it as a standalone Desktop App or Android PWA, and connect any standard 72mm/80mm thermal printer."],
  ["How does the Waiter Anti-Fraud Prepaid Code work?", "When a guest pays in advance at Reception, DineLoop prints a single-use 4-digit code on their slip. Waiters see PREPAID on their phone and verify that code with the guest. Extra items added at the table generate a QR only for the remaining balance."],
  ["Are GST invoices & GSTR-1 reports supported?", "Yes. Configure outlet-wide or per-dish GST slabs (0%, 5%, 12%, 18%), inclusive or exclusive tax, custom invoice prefixes, and export GSTR-1 rate summaries or Tally XML anytime."],
  ["What happens if the internet drops briefly?", "DineLoop includes an offline-ready service worker and local cache so your counter screen stays responsive and syncs back to the cloud once reconnected."],
  ["Can I manage multiple branches or switch from old billing software?", "Yes. Import your existing menu via CSV or Photo/PDF OCR in seconds, and manage multiple outlets with role-based access (Admin, Manager, Cashier, Waiter, Kitchen)."]
];

const LP_GUIDES = {
  setup: {
    title: "📖 Setup & Help Centre",
    html: `<b>1. Install as Windows App / Android App (No Play Store)</b>
      <p class="mu">Open DineLoop in Chrome or Edge and click <b>Install</b> in the top bar (or browser Menu → Install App). Waiters install <b>/waiter.html</b> separately on their phones.</p>
      <b>2. Import Your Menu in 30 Seconds</b>
      <p class="mu">Go to <b>Menu → Scan Menu (Photo / PDF / QR)</b>. Upload a clear photo or PDF of your menu (or import your existing CSV in Ops & AI) and click Add All.</p>
      <b>3. Set Up Exact-Amount UPI QR & Thermal Printing</b>
      <p class="mu">Go to <b>Settings → Payment UPI</b> and enter your UPI ID + Payee Name. For 1-click silent thermal printing on Windows, launch Chrome with <code>--kiosk-printing</code>.</p>`
  },
  gst: {
    title: "🧾 Indian Restaurant GST & GSTR-1 Guide",
    html: `<b>Standard Restaurant GST (5% Without ITC)</b>
      <p class="mu">Most standalone restaurants and cafes charge <b>5% GST (2.5% CGST + 2.5% SGST)</b>. Set Default GST = 5% in Settings.</p>
      <b>Mixed Rates (e.g. Packaged Beverages 12%/18%)</b>
      <p class="mu">Edit any specific dish in <b>Menu → Edit</b> and set its custom <b>Item GST %</b>. DineLoop calculates item-by-item tax automatically.</p>
      <b>GSTR-1 & Tally Filing</b>
      <p class="mu">Open <b>Stock → GST (GSTR-1), Expenses & P&L</b> to view rate-wise Taxable Value, CGST, SGST, and download <b>Tally XML</b> or Bills CSV.</p>`
  },
  blog: {
    title: "🚀 Restaurant Growth & Anti-Leakage Playbook",
    html: `<b>1. Stop Reception vs Table Confusion</b>
      <p class="mu">Outside reception often can't see indoor tables. Waiters tap guest count (🪑 Pax) on their phone so reception sees live floor status and sitting time instantly.</p>
      <b>2. Eliminate Prepaid Slip Fraud</b>
      <p class="mu">Always use <b>Prepaid + Code</b> at reception. Once the table clears, that 4-digit code expires forever—old slips can never be reused.</p>
      <b>3. Turn 1st-Time Diners into Regulars</b>
      <p class="mu">Capture mobile numbers naturally using paperless WhatsApp E-Bills, then send 14-day win-back and birthday offers to opted-in guests.</p>`
  }
};

window.renderLanding = function(){
  $("#nav").innerHTML = "";
  $("#roleChip").style.display = "none";
  $("#btnOut").style.display = "none";
  $("#st").style.display = "none";
  $("#clk").style.display = "none";
  const hdr = document.querySelector("header");
  if(hdr) hdr.style.display = "none";

  const hi = lang === "hi";
  const waNum = (S && S.cfg && S.cfg.ownerPh) ? ("91" + S.cfg.ownerPh) : "";
  const waHref = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent("Hi DineLoop! I want a free demo for my restaurant.")}` : "#";
  let cookieOk = false;
  try{ cookieOk = !!localStorage.getItem("dl_cookie_ok"); }catch(e){}

  const mRev = Math.round(window.lpBills * window.lpAvg * 30 * 0.08);
  const mSave = Math.round(window.lpBills * 30 * 2.5);
  const fmt = LP_FORMATS[window.lpFmt] || LP_FORMATS["Restaurants"];

  const prices = window.lpYearly ? { s:499, g:999, p:1799, note:"billed yearly (2 months free)" } : { s:599, g:1199, p:2199, note:"per outlet / month" };

  const screenMocks = {
    billing: `<div class="lp-dots"><i style="background:#fb7185"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span style="margin-left:6px">Billing · Table T4 · 🪑 4 Guests</span><span class="tag okt" style="margin-left:auto">● Live Sync</span></div>
      <div class="row"><span>🟢 Paneer Tikka Masala ×1</span><b>₹290</b></div>
      <div class="row"><span>🟢 Butter Garlic Naan ×3</span><b>₹180</b></div>
      <div class="row"><span>🟢 Masala Chaas ×2</span><b>₹120</b></div>
      <div class="row"><span>CGST 2.5% + SGST 2.5%</span><span>₹29.50</span></div>
      <div class="row" style="border:0"><b style="font-size:17px">Exact Payable</b><b style="font-size:22px;color:var(--ac)">₹620</b></div>
      <div class="tbs" style="margin-top:8px;margin-bottom:0">
        <button class="sm" style="flex:1" onclick="openSignupModal()">Send KOT</button>
        <button class="sm ok" style="flex:1" onclick="openSignupModal()">UPI QR ₹620</button>
        <button class="sm pri" style="flex:1" onclick="openSignupModal()">Cash / Split</button>
      </div>`,
    waiter: `<div class="lp-dots"><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span style="margin-left:6px">Waiter Mobile App · Table T4</span><span class="tag okt" style="margin-left:auto">✓ VERIFIED</span></div>
      <div style="background:rgba(52,211,153,.13);border:1px solid var(--ok);border-radius:10px;padding:10px;margin-bottom:8px">
        <b style="color:var(--ok)">✓ PREPAID ₹620 AT RECEPTION</b>
        <div class="mu">4-Digit Slip Code: <b style="color:var(--tx)">4829</b> · Verified by Waiter</div>
      </div>
      <div class="row"><span>🔔 Kitchen Alert</span><span class="tag okt">T4 Food Ready!</span></div>
      <div class="row" style="border:0"><span>Extra Chai ordered?</span><b style="color:var(--ac)">QR asks only ₹40</b></div>`,
    kds: `<div class="lp-dots"><i style="background:#e2b75c"></i><span style="margin-left:6px">Kitchen Display · Main & Tandoor</span><span class="tag wnt" style="margin-left:auto">6m prep</span></div>
      <div class="row"><span><b>KOT #42 · T4</b> <small class="tag">Tandoor</small></span><span class="tag okt">Cooking</span></div>
      <div class="row"><span>2× Garlic Naan · 1× Paneer Tikka</span><span class="mu">No onion</span></div>
      <div class="row" style="border:0"><span><b>KOT #41 · T2</b></span><button class="sm ok">Mark Ready 🔔</button></div>`,
    crm: `<div class="lp-dots"><i style="background:#34d399"></i><span style="margin-left:6px">DineLoop Loyalty & WhatsApp</span><span class="tag wnt" style="margin-left:auto">Gold · 1.5x</span></div>
      <div class="row"><span>WhatsApp E-Bill + Feedback Link</span><span class="tag okt">Sent</span></div>
      <div class="row"><span>Wallet & Gift Card Balance</span><b>₹850</b></div>
      <div class="row" style="border:0"><span>Menu Imported via Photo OCR</span><b style="color:var(--ac)">42 Dishes in 8s</b></div>`
  };

  $("#v").innerHTML = `
  <style>
    .lp-nav{position:sticky;top:0;z-index:25;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 18px;background:var(--sf2);border-bottom:1px solid var(--ln);border-radius:16px;margin-bottom:20px;box-shadow:inset 0 1px 0 var(--rim),0 10px 30px rgba(0,0,0,.35)}
    .lp-links{display:flex;gap:16px;align-items:center;position:relative}
    .lp-links a,.lp-drop-btn{color:var(--tx);text-decoration:none;font-weight:600;font-size:14px;opacity:.9;background:none;border:0;padding:4px 6px;box-shadow:none}
    .lp-links a:hover,.lp-drop-btn:hover{color:var(--ac);opacity:1;transform:none;box-shadow:none}
    .lp-drop{position:absolute;top:36px;right:0;min-width:255px;background:var(--sf2);border:1px solid var(--ln);border-radius:14px;padding:8px;box-shadow:0 20px 50px rgba(0,0,0,.6);z-index:40}
    .lp-drop button{width:100%;text-align:left;background:none;border:0;box-shadow:none;padding:9px 10px;border-radius:10px;display:block}
    .lp-drop button:hover{background:rgba(226,183,92,.12);transform:none}
    @media(max-width:900px){.lp-links{display:none}}
    .lp-hero{display:grid;grid-template-columns:1.05fr 1fr;gap:28px;align-items:center;padding:12px 6px 30px}
    @media(max-width:880px){.lp-hero{grid-template-columns:1fr}}
    .lp-h1{font:800 clamp(32px,4.8vw,52px)/1.06 Outfit,sans-serif;margin:14px 0;letter-spacing:-.02em}
    .lp-h1 span{background:var(--pri);-webkit-background-clip:text;background-clip:text;color:transparent}
    .lp-win{background:var(--sf);border:1px solid var(--ln);border-radius:18px;padding:16px;box-shadow:inset 0 1px 0 var(--rim),0 22px 50px rgba(0,0,0,.5)}
    .lp-dots{display:flex;gap:6px;align-items:center;margin-bottom:10px;font-size:12px;color:var(--mu)}
    .lp-dots i{width:9px;height:9px;border-radius:99px;display:inline-block}
    .lp-sec{padding:24px 0}
    .lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .lp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    @media(max-width:860px){.lp-grid3,.lp-grid4{grid-template-columns:1fr}}
    .lp-faq-item{border:1px solid var(--ln);border-radius:12px;padding:12px 14px;margin-bottom:8px;background:var(--sf);cursor:pointer}
    .lp-foot{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1.2fr;gap:18px;padding:28px 0 36px;border-top:1px solid var(--ln)}
    @media(max-width:860px){.lp-foot{grid-template-columns:1fr 1fr}}
    .lp-foot a{display:block;color:var(--mu);text-decoration:none;margin:6px 0;font-size:14px}.lp-foot a:hover{color:var(--ac)}
    .lp-cookie{position:fixed;left:16px;bottom:16px;max-width:380px;z-index:60;background:var(--sf2);border:1px solid var(--ln);border-radius:16px;padding:15px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
    .lp-flt{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;gap:10px;align-items:center}
    .lp-wa{width:50px;height:50px;border-radius:99px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;text-decoration:none;box-shadow:0 8px 24px rgba(37,211,102,.4)}
  </style>

  <div class="lp-nav">
    <h1 style="margin:0">🍽️ DINELOOP</h1>
    <div class="lp-links">
      <a href="#feat">${hi?"फीचर्स":"Features"}</a>
      <a href="#sol">${hi?"किसके लिए":"Solutions"}</a>
      <a href="#price">${hi?"प्राइसिंग":"Pricing"}</a>
      <button class="lp-drop-btn" onclick="window.lpResOpen=!window.lpResOpen;renderLanding()">${hi?"गाइड्स ▾":"Resources & Guides ▾"}</button>
      ${window.lpResOpen?`<div class="lp-drop">
        <button onclick="window.lpResOpen=false;openGuide('setup')"><b>📖 Setup & Help Centre</b><br><small class="mu">Install PWA, OCR menu & printing</small></button>
        <button onclick="window.lpResOpen=false;openGuide('gst')"><b>🧾 GST & GSTR-1 Guide</b><br><small class="mu">5% slabs, CGST/SGST & Tally XML</small></button>
        <button onclick="window.lpResOpen=false;openGuide('blog')"><b>🚀 Anti-Leakage Playbook</b><br><small class="mu">4-digit codes & repeat guest loop</small></button>
      </div>`:""}
    </div>
    <div class="tbs" style="margin:0">
      <button class="sm" onclick="toggleLang()">${hi?"हिं":"EN"}</button>
      <button class="sm" onclick="cycleTheme()">🎨</button>
      <button class="sm" onclick="openLoginModal()">${hi?"लॉगिन":"Login"}</button>
      <button class="sm pri" onclick="openSignupModal()">${hi?"फ्री ट्रायल":"Start Free Trial"}</button>
    </div>
  </div>

  <section class="lp-hero">
    <div>
      <span class="tag okt">● ${hi?"भारत का पहला एंटी-लीकेज + रिपीट-गेस्ट रेस्टोरेंट ओएस":"India's Anti-Leakage Restaurant OS"}</span>
      <h2 class="lp-h1">${hi?"हर ग्राहक को बनाएं <span>पक्का रिपीट गेस्ट</span> — बिना महंगे हार्डवेयर के।":"Stop losing guests after <span>one visit.</span> Put your restaurant on a loop."}</h2>
      <p class="mu" style="font-size:17px;line-height:1.58">
        ${hi
          ?"DineLoop एक ही प्लेटफॉर्म पर तेज़ बिलिंग, किचन डिस्प्ले, अलग वेटर फोन ऐप, 4-डिजिट एंटी-फ्रॉड प्रीपेड कोड, AI मेनू स्कैनर और WhatsApp लॉयल्टी इंजन देता है।"
          :"DineLoop unites counter billing, a dedicated Waiter app, anti-fraud 4-digit prepaid codes, station-wise Kitchen Display, AI menu photo scanning, and automated WhatsApp loyalty — on the laptop and phones you already own."}
      </p>
      <div class="tbs" style="margin-top:18px">
        <button class="pri" style="padding:12px 20px;font-size:15px" onclick="openSignupModal()">${hi?"14 दिन फ्री ट्रायल शुरू करें →":"Start 14-Day Free Trial →"}</button>
        <button style="padding:12px 18px" onclick="openTourModal()">▶ ${hi?"2-मिनट का वीडियो टूर देखें":"Watch 2-Min Tour"}</button>
        <button class="ok" style="padding:12px 16px" onclick="openDemoModal()">${hi?"फ्री डेमो बुक करें":"Book a Demo"}</button>
      </div>
      <div class="tbs" style="margin-top:10px">
        <span class="tag">✓ No Hardware Lock-in</span>
        <span class="tag">✓ Windows & Android PWA</span>
        <span class="tag">✓ Built-in GST & Guides</span>
      </div>
    </div>

    <div>
      <div class="tbs" style="justify-content:center;margin-bottom:10px">
        <button class="sm ${window.lpTab==="billing"?"on":""}" onclick="window.lpTab='billing';renderLanding()">⚡ Billing & QR</button>
        <button class="sm ${window.lpTab==="waiter"?"on":""}" onclick="window.lpTab='waiter';renderLanding()">🛡 Waiter Anti-Fraud</button>
        <button class="sm ${window.lpTab==="kds"?"on":""}" onclick="window.lpTab='kds';renderLanding()">🍳 Kitchen KDS</button>
        <button class="sm ${window.lpTab==="crm"?"on":""}" onclick="window.lpTab='crm';renderLanding()">✦ Loyalty Loop</button>
      </div>
      <div class="lp-win">${screenMocks[window.lpTab]||screenMocks.billing}</div>
    </div>
  </section>

  <section id="sol" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:10px">${hi?"हर तरह के फ़ूड बिज़नेस के लिए":"Shaped Around How You Serve"}</h3>
    <div class="tbs" style="margin-bottom:12px">
      ${Object.keys(LP_FORMATS).map(f=>`<button class="sm ${window.lpFmt===f?"on":""}" onclick="window.lpFmt='${f}';renderLanding()">${f}</button>`).join("")}
    </div>
    <div class="card">
      <div class="g2" style="align-items:center">
        <div>
          <b style="font-size:18px;color:var(--ac)">DineLoop for ${esc(window.lpFmt)}</b>
          <p class="mu" style="font-size:15px;margin:8px 0">${esc(fmt.desc)}</p>
          <button class="pri sm" onclick="openSignupModal()">Try for ${esc(window.lpFmt)} →</button>
        </div>
        <div>${fmt.bullets.map(b=>`<div class="row" style="padding:5px 0"><span style="color:var(--ok)">✓ ${esc(b)}</span></div>`).join("")}</div>
      </div>
    </div>
  </section>

  <section id="roi" class="lp-sec">
    <div class="card">
      <div class="g2" style="align-items:center">
        <div>
          <b style="font-size:15px">${hi?"अपना मासिक मुनाफ़ा देखें (ROI कैलकुलेटर)":"See How Much DineLoop Earns You Back"}</b>
          <p class="mu">Enter your daily bill count & ticket size to estimate extra repeat revenue + paper savings.</p>
          <div class="g2" style="margin-top:10px">
            <div><label class="mu">Bills per Day</label><input type="number" min="5" value="${window.lpBills}" oninput="window.lpBills=+this.value||10;renderLanding()"></div>
            <div><label class="mu">Average Bill ₹</label><input type="number" min="50" value="${window.lpAvg}" oninput="window.lpAvg=+this.value||100;renderLanding()"></div>
          </div>
        </div>
        <div class="g2" style="gap:10px">
          <div class="card" style="margin:0;text-align:center"><span class="mu">Extra Repeat Sales / mo</span><div style="font:800 26px Outfit,sans-serif;color:var(--ok)">+₹${mRev.toLocaleString("en-IN")}</div></div>
          <div class="card" style="margin:0;text-align:center"><span class="mu">Paper & Leakage Saved</span><div style="font:800 26px Outfit,sans-serif;color:var(--ac)">₹${mSave.toLocaleString("en-IN")}</div></div>
        </div>
      </div>
    </div>
  </section>

  <section id="feat" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"क्यों चुनें DineLoop":"From First KOT to Final Profit Report"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>🛡 Zero-Loophole Prepaid Control</b><p class="mu">Reception generates a 4-digit verify code on prepaid slips. Waiters verify it in 1 second, and QR only charges extra items.</p></div>
      <div class="card"><b>📷 AI Menu OCR & PDF Scanner</b><p class="mu">Snap a photo or upload your PDF menu — AI extracts dishes, Veg/Non-Veg tags, categories & prices in seconds.</p></div>
      <div class="card"><b>📱 4 Apps Synced Live</b><p class="mu">Reception POS, Waiter Mobile PWA, Kitchen Station Display, Counter Customer Display & QR Table Ordering.</p></div>
      <div class="card"><b>📦 BOM Recipes & GSTR-1</b><p class="mu">Auto-deduct recipe ingredients, track PO/GRN & wastage, see Food Cost %, and export GSTR-1 / Tally XML.</p></div>
      <div class="card"><b>✦ Loyalty Tiers, Wallet & Gift Cards</b><p class="mu">Bronze-to-Platinum tiers, prepaid guest wallet, numbered gift cards, referrals & automated WhatsApp journeys.</p></div>
      <div class="card"><b>📚 Real Guides Included</b><p class="mu">Step-by-step Setup Help, GST Billing Guide & Anti-Leakage Playbook built right in — <a href="javascript:void(0)" onclick="openGuide('setup')">Read Guides →</a></p></div>
    </div>
  </section>

  <section id="price" class="lp-sec">
    <div class="row" style="border:0;padding:0;margin-bottom:12px">
      <h3 class="ttl" style="font-size:15px;margin:0">${hi?"साफ और किफायती प्लान्स":"Simple Plans · 14-Day Free Trial"}</h3>
      <div class="tbs" style="margin:0">
        <button class="sm ${!window.lpYearly?"on":""}" onclick="window.lpYearly=false;renderLanding()">Monthly</button>
        <button class="sm ${window.lpYearly?"on":""}" onclick="window.lpYearly=true;renderLanding()">Yearly (2 Months Free)</button>
      </div>
    </div>
    <div class="lp-grid3">
      <div class="card"><b>Starter</b><div style="font:800 30px Outfit,sans-serif;margin:8px 0">₹${prices.s} <small class="mu">/mo</small></div><div class="mu" style="margin-bottom:10px">${prices.note}</div><p class="mu">Counter POS, Kitchen Display, Exact UPI QR, GST Billing, Z-Report & CSV Exports.</p><button class="sm" onclick="openSignupModal()">Start Free Trial</button></div>
      <div class="card" style="border-color:var(--ac)"><b>Growth ★ Most Popular</b><div style="font:800 30px Outfit,sans-serif;color:var(--ac);margin:8px 0">₹${prices.g} <small class="mu">/mo</small></div><div class="mu" style="margin-bottom:10px">${prices.note}</div><p class="mu">Everything in Starter + Waiter PWA, Anti-Fraud Prepaid Codes, QR Table Ordering, Loyalty Tiers, Wallet & BOM Inventory.</p><button class="sm pri" onclick="openSignupModal()">Start 14-Day Trial</button></div>
      <div class="card"><b>Multi-Outlet Pro</b><div style="font:800 30px Outfit,sans-serif;margin:8px 0">₹${prices.p} <small class="mu">/mo</small></div><div class="mu" style="margin-bottom:10px">${prices.note}</div><p class="mu">AI Menu OCR & Insights, Central Menu Push, Aggregator Inbox, Webhooks, Audit Logs & Dedicated Onboarding.</p><button class="sm ok" onclick="openDemoModal()">Book Free Demo</button></div>
    </div>
  </section>

  <section id="faq" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"अक्सर पूछे जाने वाले सवाल":"Questions Owners Ask Us"}</h3>
    ${LP_FAQS.map((f,i)=>`<div class="lp-faq-item" onclick="window.lpFaqOpen=${window.lpFaqOpen===i?-1:i};renderLanding()">
      <div class="row" style="border:0;padding:0"><b>${esc(f[0])}</b><span>${window.lpFaqOpen===i?"−":"+"}</span></div>
      ${window.lpFaqOpen===i?`<p class="mu" style="margin:8px 0 0">${esc(f[1])}</p>`:""}
    </div>`).join("")}
  </section>

  <section class="lp-sec">
    <div class="card">
      <div class="g2" style="align-items:center">
        <div>
          <h3 style="font:800 28px Outfit,sans-serif;margin:0 0 8px">Ready to simplify your restaurant?</h3>
          <p class="mu">Leave your details for a 20-minute live walkthrough on your own menu — usually live the same day.</p>
          <div style="margin-top:12px;display:grid;gap:6px" class="mu">
            <span>✓ Same-day setup with Menu Photo/PDF OCR</span>
            <span>✓ Works on your existing laptop & Android phones</span>
            <span>✓ 14-day free trial, no card required</span>
          </div>
        </div>
        <div style="display:grid;gap:8px">
          <div class="g2"><input id="inDmNm" placeholder="Your name *"><input id="inDmPh" placeholder="Mobile number *" maxlength="10" inputmode="numeric"></div>
          <div class="g2"><input id="inDmRest" placeholder="Restaurant name *"><input id="inDmCity" placeholder="City"></div>
          <select id="inDmType"><option value="Restaurants">Restaurants</option><option value="Cafes">Cafes</option><option value="Cloud Kitchens">Cloud Kitchens</option><option value="Bakeries">Bakeries</option><option value="QSR">QSR</option><option value="Hotels">Hotels & Bars</option></select>
          <button class="pri" onclick="submitInlineDemo()">Book a Free Demo →</button>
        </div>
      </div>
    </div>
  </section>

  <footer class="lp-foot">
    <div>
      <h1 style="margin:0 0 8px">🍽️ DINELOOP</h1>
      <p class="mu">Cloud POS, Waiter PWA, Anti-Fraud Billing & WhatsApp Loyalty for restaurants, cafes & cloud kitchens across India.</p>
    </div>
    <div><b>Product</b><a href="#feat">Billing & POS</a><a href="#feat">Waiter & Kitchen</a><a href="#feat">Inventory & BOM</a><a href="#price">Pricing</a></div>
    <div><b>Solutions</b><a href="#sol" onclick="window.lpFmt='Restaurants';renderLanding()">Restaurants</a><a href="#sol" onclick="window.lpFmt='Cafes & Bakeries';renderLanding()">Cafes & Bakeries</a><a href="#sol" onclick="window.lpFmt='Cloud Kitchens';renderLanding()">Cloud Kitchens</a><a href="#sol" onclick="window.lpFmt='QSR & Fast Food';renderLanding()">QSR & Fast Food</a></div>
    <div><b>Resources</b><a href="javascript:void(0)" onclick="openGuide('setup')">Setup & Help Centre</a><a href="javascript:void(0)" onclick="openGuide('gst')">GST Billing Guide</a><a href="javascript:void(0)" onclick="openGuide('blog')">Anti-Leakage Playbook</a><a href="javascript:void(0)" onclick="openTourModal()">2-Min Video Tour</a></div>
    <div><b>Legal & Contact</b><a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy Policy</a><a href="javascript:void(0)" onclick="openTermsMdl()">Terms of Service</a><a href="/order.html?outlet=main" target="_blank">Live QR Menu</a><a href="javascript:void(0)" onclick="openDemoModal()">Book Free Demo →</a></div>
  </footer>

  ${!cookieOk?`<div class="lp-cookie" id="ckBar">
    <div style="font-size:13px;line-height:1.45;margin-bottom:10px">🍪 We use essential storage to run DineLoop POS & sync your session securely. <a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy policy</a></div>
    <div class="tbs" style="margin:0">
      <button class="pri sm" style="flex:1" onclick="acceptCookies('all')">Accept</button>
      <button class="sm" style="flex:1" onclick="acceptCookies('essential')">Only essential</button>
    </div>
  </div>`:""}

  <div class="lp-flt">
    <button class="pri" style="border-radius:99px;padding:10px 16px" onclick="openDemoModal()">📅 Book a Free Demo</button>
    <a class="lp-wa" href="${waHref}" ${waNum?`target="_blank"`:`onclick="event.preventDefault();openDemoModal()"`} title="WhatsApp Us">💬</a>
  </div>
  `;
};

window.openGuide = function(key){
  const g = LP_GUIDES[key] || LP_GUIDES.setup;
  showMdl(`<b>${g.title}</b><div style="margin:12px 0;display:grid;gap:8px;line-height:1.55">${g.html}</div>
    <div class="tbs"><button class="pri" onclick="closeMdl();openSignupModal()">Try Free for 14 Days</button><button onclick="closeMdl()">Close</button></div>`);
};

window.openTermsMdl = function(){
  showMdl(`<b>Terms of Service · DineLoop</b><p class="mu" style="margin:10px 0;line-height:1.55">DineLoop provides cloud POS, kitchen display, inventory and opt-in loyalty tools on a subscription basis. Each restaurant owns its menu, bills, and guest records.</p><button class="pri" onclick="closeMdl()">Close</button>`);
};

// ---------- ANIMATED 2-MINUTE PRODUCT TOUR VIDEO PLAYER + WEBM EXPORTER ----------
window._tourTimer = null;
window.openTourModal = function(){
  showMdl(`<b>▶ DineLoop 2-Minute Guided Product Tour</b>
    <p class="mu">Watch how DineLoop runs an entire service in 6 scenes — or export a video file to share on WhatsApp.</p>
    <canvas id="tourCv" width="720" height="405" style="width:100%;border-radius:12px;border:1px solid var(--ln);margin:8px 0;background:#0b0c10"></canvas>
    <div class="tbs">
      <button class="sm pri" onclick="startTourPlayer(0)">▶ Play Tour</button>
      <button class="sm" onclick="stopTourPlayer()">⏸ Pause</button>
      <button class="sm ok" id="btnRecTour" onclick="recordTourVideo()">⬇ Download Video (.webm)</button>
      <button class="sm" onclick="stopTourPlayer();closeMdl()">Close</button>
    </div>`);
  setTimeout(()=>window.startTourPlayer(0), 60);
};

window.stopTourPlayer = function(){
  if(window._tourTimer){ cancelAnimationFrame(window._tourTimer); window._tourTimer = null; }
};

window.startTourPlayer = function(startAt=0){
  window.stopTourPlayer();
  const cv = $("#tourCv"); if(!cv) return;
  const ctx = cv.getContext("2d");
  const scenes = [
    {t:"01 · AI Menu Import", sub:"Snap a photo or PDF of your paper menu", line:"Masala Dosa ₹120 • Paneer Tikka ₹290 • 42 dishes in 8s", badge:"MENU OCR"},
    {t:"02 · Fast Counter & UPI QR", sub:"Dine-In, Parcel, Variants, GST & Exact-Amount QR", line:"Subtotal ₹590 + 5% GST = ₹620  →  Scannable UPI QR", badge:"BILLING"},
    {t:"03 · Waiter PWA + Anti-Fraud", sub:"Waiters seat guests & verify 4-digit Prepaid Slip Codes", line:"Table T4 • 🪑 4 Guests • Code 4829 VERIFIED ✓", badge:"WAITER APP"},
    {t:"04 · Station Kitchen Display", sub:"Main, Tandoor & Beverage routing + Food Ready alerts", line:"KOT #42 Ready 🔔 → Waiter phone alerts immediately", badge:"KDS PRO"},
    {t:"05 · BOM Food Cost & GSTR-1", sub:"Recipe ingredients deduct automatically on every bill", line:"Food Cost 28% • GSTR-1 & Tally XML ready in 1 click", badge:"ERP & GST"},
    {t:"06 · The DineLoop Loyalty Loop", sub:"Paperless WhatsApp E-Bills & Auto Win-Back Offers", line:"Start your 14-Day Free Trial today at DineLoop!", badge:"GROWTH"}
  ];
  const t0 = performance.now() - startAt;
  const totalMs = 24000; // crisp 24s animated walkthrough covering all 6 scenes (4s each)
  function draw(now){
    if(!$("#tourCv")) return window.stopTourPlayer();
    const el = (now - t0) % totalMs;
    const idx = Math.floor(el / 4000);
    const sc = scenes[idx];
    const prog = (el % 4000) / 4000;

    // Background metallic gradient
    const bg = ctx.createLinearGradient(0,0,720,405);
    bg.addColorStop(0,"#12141c"); bg.addColorStop(1,"#090a0e");
    ctx.fillStyle = bg; ctx.fillRect(0,0,720,405);

    // Gold border frame
    ctx.strokeStyle = "rgba(226,183,92,0.5)"; ctx.lineWidth = 2;
    ctx.strokeRect(24,24,672,357);

    // Header pill
    ctx.fillStyle = "#e2b75c"; ctx.font = "bold 14px sans-serif";
    ctx.fillText("DINELOOP  •  " + sc.badge, 48, 64);
    ctx.fillStyle = "#a39d93"; ctx.fillText(`Scene ${idx+1}/6`, 615, 64);

    // Animated Card
    ctx.fillStyle = "rgba(35,38,48,0.92)";
    ctx.fillRect(48, 92, 624, 225);
    ctx.strokeStyle = "rgba(226,183,92,0.35)"; ctx.strokeRect(48, 92, 624, 225);

    ctx.fillStyle = "#f6f1e7"; ctx.font = "bold 30px sans-serif";
    ctx.fillText(sc.t, 74, 150);

    ctx.fillStyle = "#e2b75c"; ctx.font = "19px sans-serif";
    ctx.fillText(sc.sub, 74, 192);

    ctx.fillStyle = "#34d399"; ctx.font = "bold 18px monospace";
    ctx.fillText(sc.line, 74, 248);

    // Progress bar
    ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(48, 342, 624, 8);
    ctx.fillStyle = "#e2b75c"; ctx.fillRect(48, 342, 624 * ((idx + prog)/6), 8);

    window._tourTimer = requestAnimationFrame(draw);
  }
  window._tourTimer = requestAnimationFrame(draw);
};

window.recordTourVideo = function(){
  const cv = $("#tourCv"); if(!cv || !cv.captureStream || !window.MediaRecorder) return toast("Use Chrome/Edge desktop to download video");
  const btn = $("#btnRecTour"); if(btn){btn.disabled=true;btn.textContent="Recording (24s)…";}
  window.startTourPlayer(0);
  const chunks = [];
  const rec = new MediaRecorder(cv.captureStream(30), {mimeType:"video/webm"});
  rec.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(chunks, {type:"video/webm"}));
    a.download = "dineloop-product-tour.webm"; a.click();
    if(btn){btn.disabled=false;btn.textContent="⬇ Download Video (.webm)";}
    toast("Tour video downloaded!");
  };
  rec.start();
  setTimeout(()=>{ if(rec.state==="recording") rec.stop(); }, 24000);
};

window.submitInlineDemo = async function(){
  const name = ($("#inDmNm").value||"").trim(), phone = ($("#inDmPh").value||"").replace(/\D/g,"");
  const rest = ($("#inDmRest").value||"").trim(), city = ($("#inDmCity").value||"").trim(), btype = $("#inDmType").value;
  if(!name || phone.length!==10) return toast("Enter your name & 10-digit mobile");
  if(sb){
    const r = await sb.from("demo_leads").insert({name, restaurant_name:`${rest} [${btype}]`, city, phone, outlets:1, status:"new"});
    if(r.error) return toast(r.error.message);
  }
  $("#inDmNm").value=""; $("#inDmPh").value=""; $("#inDmRest").value=""; $("#inDmCity").value="";
  toast("Demo booked! We'll call you shortly.");
};

window.acceptCookies = function(mode){
  try{localStorage.setItem("dl_cookie_ok",mode);}catch(e){}
  const el=$("#ckBar");if(el)el.remove();
};

window.openPrivacyMdl = function(){
  showMdl(`<b>Privacy Policy · DineLoop</b>
    <p class="mu" style="margin:10px 0;line-height:1.55">
      • We store only essential login & POS operational data required for your restaurant.<br>
      • Guest phone numbers belong strictly to each restaurant outlet and are never shared across outlets or sent to AI.<br>
      • WhatsApp marketing messages are sent only to guests who explicitly opt in.<br>
      • Guests can request deletion or export of their loyalty profile anytime (DPDP Act compliant).
    </p>
    <button class="pri" onclick="closeMdl()">Close</button>`);
};

window.openLoginModal = function(){
  showMdl(`<b>Staff & Owner Sign In</b>
    <p class="mu">Sign in with your DineLoop email & password</p>
    <input id="em" placeholder="Email" autocomplete="username" style="margin:8px 0">
    <input id="pw" type="password" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
    <div class="tbs" style="margin-top:12px">
      <button class="pri" style="flex:1" onclick="doLogin()">Open POS</button>
      <button onclick="closeMdl()">Cancel</button>
    </div>
    <p class="mu" style="margin-top:10px;text-align:center">New restaurant? <a href="javascript:void(0)" onclick="openSignupModal()">Start 14-day Free Trial →</a></p>`);
  setTimeout(()=>$("#em")?.focus(),50);
};

window.openSignupModal = function(){
  showMdl(`<b>🚀 Create Your Restaurant Account (14-Day Free Trial)</b>
    <p class="mu">Instant setup — start billing, kitchen display & UPI QR in 30 seconds.</p>
    <div style="margin:10px 0;display:grid;gap:8px">
      <input id="suRest" placeholder="Restaurant / Café Name * (e.g. Spice Villa)">
      <div class="g2">
        <input id="suCity" placeholder="City (e.g. Jaipur)">
        <input id="suPh" placeholder="10-digit Mobile *" inputmode="numeric" maxlength="10">
      </div>
      <input id="suName" placeholder="Owner Name *">
      <input id="suEm" placeholder="Email Address *">
      <input id="suPw" type="password" placeholder="Create Password (min 6 chars) *" onkeydown="if(event.key==='Enter')doSelfSignup()">
    </div>
    <div class="tbs">
      <button class="pri" id="suBtn" style="flex:1" onclick="doSelfSignup()">Launch My Restaurant POS</button>
      <button onclick="closeMdl()">Cancel</button>
    </div>
    <p class="mu" style="margin-top:8px;text-align:center">Already have an account? <a href="javascript:void(0)" onclick="openLoginModal()">Login →</a></p>`);
};

window.doSelfSignup = async function(){
  const restaurant_name = ($("#suRest").value||"").trim(), city = ($("#suCity").value||"").trim();
  const phone = ($("#suPh").value||"").replace(/\D/g,""), owner_name = ($("#suName").value||"").trim();
  const email = ($("#suEm").value||"").trim(), password = ($("#suPw").value||"");
  if(!restaurant_name || !email || password.length<6) return toast("Restaurant name, email & 6+ char password required");
  if(!sb) return toast("Requires Cloud connection");
  const btn=$("#suBtn"); if(btn){btn.disabled=true;btn.textContent="Creating your POS…";}
  const r = await sb.functions.invoke("self-signup",{body:{restaurant_name,city,phone,owner_name,email,password}});
  if(r.error || !r.data || !r.data.ok){
    if(btn){btn.disabled=false;btn.textContent="Launch My Restaurant POS";}
    return toast((r.data&&r.data.error) || (r.error&&r.error.message) || "Signup failed");
  }
  toast("Welcome to DineLoop! Logging in…");
  const li = await sb.auth.signInWithPassword({email,password});
  if(li.error) return toast(li.error.message);
  user = li.data.user; closeMdl();
  const hdr=document.querySelector("header");if(hdr)hdr.style.display="flex";
  if($("#st"))$("#st").style.display="inline-block";
  if($("#clk"))$("#clk").style.display="inline-block";
  boot();
};

window.openDemoModal = function(){
  showMdl(`<b>Book a Free DineLoop Demo</b>
    <p class="mu">Leave your details — our team will set up a live walkthrough for your restaurant.</p>
    <div style="margin:10px 0;display:grid;gap:8px">
      <input id="dmNm" placeholder="Your Name *">
      <input id="dmRest" placeholder="Restaurant / Café Name *">
      <div class="g2">
        <input id="dmCity" placeholder="City (e.g. Jaipur)">
        <input id="dmOut" type="number" min="1" value="1" placeholder="Outlets">
      </div>
      <input id="dmPh" placeholder="10-digit WhatsApp / Mobile *" inputmode="numeric" maxlength="10">
    </div>
    <div class="tbs">
      <button class="pri" onclick="submitDemoLead()">Request Free Demo</button>
      <button onclick="closeMdl()">Cancel</button>
    </div>`);
};

window.submitDemoLead = async function(){
  const name = ($("#dmNm").value||"").trim(), rest = ($("#dmRest").value||"").trim();
  const city = ($("#dmCity").value||"").trim(), outlets = +$("#dmOut").value||1;
  const phone = ($("#dmPh").value||"").replace(/\D/g,"");
  if(!name || phone.length!==10) return toast("Enter your name & 10-digit mobile");
  if(sb){
    const r = await sb.from("demo_leads").insert({name, restaurant_name:rest, city, phone, outlets, status:"new"});
    if(r.error) return toast(r.error.message);
  }
  closeMdl();
  toast("Demo request received! We will contact you shortly.");
};
