// DineLoop Official SaaS Landing Page — 100% Original Brand, Interactive Showcase & ROI Calculator
window.lpTab = window.lpTab || "pos";
window.lpBills = window.lpBills || 50;
window.lpAvg = window.lpAvg || 350;

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

  const mockHtml = window.lpTab === "pos" ? `
    <div class="lp-dots"><i style="background:#fb7185"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span style="margin-left:6px">Billing · Table T4 · 🪑 4 Guests</span><span class="tag okt" style="margin-left:auto">● Live Sync</span></div>
    <div class="row"><span>🟢 Paneer Tikka Masala ×1</span><b>₹290</b></div>
    <div class="row"><span>🟢 Butter Garlic Naan ×3</span><b>₹180</b></div>
    <div class="row"><span>🟢 Masala Chaas ×2</span><b>₹120</b></div>
    <div class="row"><span>CGST 2.5% + SGST 2.5%</span><span>₹29.50</span></div>
    <div class="row" style="border:0"><b style="font-size:17px">Exact Payable</b><b style="font-size:22px;color:var(--ac)">₹620</b></div>
    <div class="tbs" style="margin-top:8px;margin-bottom:0">
      <button class="sm" style="flex:1" onclick="openSignupModal()">Send KOT</button>
      <button class="sm ok" style="flex:1" onclick="openSignupModal()">Show UPI QR ₹620</button>
      <button class="sm pri" style="flex:1" onclick="openSignupModal()">Cash / Split</button>
    </div>`
  : window.lpTab === "waiter" ? `
    <div class="lp-dots"><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span style="margin-left:6px">Waiter Mobile App · Table T4</span><span class="tag okt" style="margin-left:auto">✓ VERIFIED</span></div>
    <div style="background:rgba(52,211,153,.13);border:1px solid var(--ok);border-radius:10px;padding:10px;margin-bottom:8px">
      <b style="color:var(--ok)">✓ PREPAID ₹620 AT RECEPTION</b>
      <div class="mu">4-Digit Slip Code: <b style="color:var(--tx)">4829</b> · Verified by Waiter</div>
    </div>
    <div class="row"><span>🔔 Kitchen Alert</span><span class="tag okt">T4 Food Ready!</span></div>
    <div class="row" style="border:0"><span>Extra Chai added later?</span><b style="color:var(--ac)">QR asks only ₹40</b></div>`
  : `
    <div class="lp-dots"><i style="background:#e2b75c"></i><span style="margin-left:6px">DineLoop Growth Engine</span><span class="tag wnt" style="margin-left:auto">Gold Tier · 1.5x</span></div>
    <div class="row"><span>WhatsApp E-Bill sent</span><span class="tag okt">Paper Saved</span></div>
    <div class="row"><span>Loyalty Points Credited</span><b>+93 pts</b></div>
    <div class="row"><span>14-Day Win-Back Trigger</span><span class="tag">Auto Offer</span></div>
    <div class="row" style="border:0"><span>Menu Imported via Photo OCR</span><b style="color:var(--ac)">42 Dishes in 8s</b></div>`;

  $("#v").innerHTML = `
  <style>
    .lp-nav{position:sticky;top:0;z-index:25;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;background:var(--sf2);border-bottom:1px solid var(--ln);border-radius:16px;margin-bottom:22px;box-shadow:inset 0 1px 0 var(--rim),0 10px 30px rgba(0,0,0,.35)}
    .lp-links{display:flex;gap:18px;align-items:center}
    .lp-links a{color:var(--tx);text-decoration:none;font-weight:600;font-size:14px;opacity:.88}.lp-links a:hover{color:var(--ac);opacity:1}
    @media(max-width:860px){.lp-links{display:none}}
    .lp-hero{display:grid;grid-template-columns:1.05fr 1fr;gap:28px;align-items:center;padding:14px 6px 32px}
    @media(max-width:880px){.lp-hero{grid-template-columns:1fr}}
    .lp-h1{font:800 clamp(32px,4.8vw,52px)/1.06 Outfit,sans-serif;margin:14px 0;letter-spacing:-.02em}
    .lp-h1 span{background:var(--pri);-webkit-background-clip:text;background-clip:text;color:transparent}
    .lp-win{background:var(--sf);border:1px solid var(--ln);border-radius:18px;padding:16px;box-shadow:inset 0 1px 0 var(--rim),0 22px 50px rgba(0,0,0,.5)}
    .lp-dots{display:flex;gap:6px;align-items:center;margin-bottom:10px;font-size:12px;color:var(--mu)}
    .lp-dots i{width:9px;height:9px;border-radius:99px;display:inline-block}
    .lp-sec{padding:26px 0}
    .lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .lp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    @media(max-width:860px){.lp-grid3,.lp-grid4{grid-template-columns:1fr}}
    .lp-cookie{position:fixed;left:16px;bottom:16px;max-width:390px;z-index:60;background:var(--sf2);border:1px solid var(--ln);border-radius:16px;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
    .lp-wa{position:fixed;right:18px;bottom:18px;z-index:60;width:54px;height:54px;border-radius:99px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;text-decoration:none;box-shadow:0 8px 24px rgba(37,211,102,.4)}
  </style>

  <div class="lp-nav">
    <h1 style="margin:0">🍽️ DINELOOP</h1>
    <div class="lp-links">
      <a href="#loop">${hi?"कैसे काम करता है":"The Loop"}</a>
      <a href="#feat">${hi?"फीचर्स":"Capabilities"}</a>
      <a href="#roi">${hi?"मुनाफ़ा कैलकुलेटर":"ROI Calculator"}</a>
      <a href="#price">${hi?"प्लान्स":"Pricing"}</a>
    </div>
    <div class="tbs" style="margin:0">
      <button class="sm" onclick="toggleLang()">${hi?"हिं":"EN"}</button>
      <button class="sm" onclick="cycleTheme()">🎨</button>
      <button class="sm" onclick="openLoginModal()">${hi?"लॉगिन":"Login"}</button>
      <button class="sm ok" onclick="openDemoModal()">${hi?"डेमो":"Free Demo"}</button>
      <button class="sm pri" onclick="openSignupModal()">${hi?"फ्री ट्रायल":"Start Free Trial"}</button>
    </div>
  </div>

  <section class="lp-hero">
    <div>
      <span class="tag okt">● ${hi?"भारत का पहला एंटी-लीकेज + रिपीट-गेस्ट रेस्टोरेंट ओएस":"India's Anti-Leakage Restaurant OS"}</span>
      <h2 class="lp-h1">${hi?"हर ग्राहक को बनाएं <span>पक्का रिपीट गेस्ट</span> — बिना किसी महंगे हार्डवेयर के।":"Stop losing guests after <span>one visit.</span> Put your restaurant on a loop."}</h2>
      <p class="mu" style="font-size:17px;line-height:1.58">
        ${hi
          ?"DineLoop एक ही प्लेटफॉर्म पर तेज़ बिलिंग, किचन डिस्प्ले, वेटर फोन ऐप, एंटी-फ्रॉड 4-डिजिट प्रीपेड कोड, AI मेनू स्कैनर और WhatsApp लॉयल्टी इंजन देता है।"
          :"DineLoop unites counter billing, a dedicated Waiter app, anti-fraud 4-digit prepaid codes, station-wise Kitchen Display, AI menu photo scanning, and automated WhatsApp loyalty — running smoothly on the laptop and phones you already own."}
      </p>
      <div class="tbs" style="margin-top:18px">
        <button class="pri" style="padding:12px 20px;font-size:16px" onclick="openSignupModal()">${hi?"14 दिन फ्री ट्रायल शुरू करें →":"Start 14-Day Free Trial →"}</button>
        <button style="padding:12px 18px" onclick="openDemoModal()">${hi?"लाइव डेमो बुक करें":"Book a Free Demo"}</button>
        <button style="padding:12px 16px" onclick="openLoginModal()">${hi?"लॉगिन":"Login"}</button>
      </div>
      <div class="tbs" style="margin-top:12px">
        <span class="tag">✓ Windows & Android Installable App</span>
        <span class="tag">✓ 5-Min AI Menu Photo Scan</span>
        <span class="tag">✓ Zero Hardware Lock-in</span>
      </div>
    </div>

    <div>
      <div class="tbs" style="justify-content:center;margin-bottom:10px">
        <button class="sm ${window.lpTab==="pos"?"on":""}" onclick="window.lpTab='pos';renderLanding()">⚡ Counter & UPI QR</button>
        <button class="sm ${window.lpTab==="waiter"?"on":""}" onclick="window.lpTab='waiter';renderLanding()">🛡 Waiter Anti-Fraud</button>
        <button class="sm ${window.lpTab==="growth"?"on":""}" onclick="window.lpTab='growth';renderLanding()">✦ Loyalty Loop</button>
      </div>
      <div class="lp-win">${mockHtml}</div>
    </div>
  </section>

  <section id="loop" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"DineLoop कैसे हर बिल से कमाई बढ़ाता है":"The 4-Step DineLoop Cycle"}</h3>
    <div class="lp-grid4">
      <div class="card"><b>01 · Seat & Fire</b><p class="mu">Waiter taps table & guest count on their phone. Reception sees live floor occupancy outside while Kitchen stations get instant KOTs.</p></div>
      <div class="card"><b>02 · Verify & Collect</b><p class="mu">Reception prepaid slips print a single-use 4-digit verify code. Extra table orders update the exact balance UPI QR automatically.</p></div>
      <div class="card"><b>03 · Reward & Save</b><p class="mu">Every settled bill sends a paperless WhatsApp E-Bill, awards Bronze-to-Platinum tier points, and deducts BOM recipe stock.</p></div>
      <div class="card"><b>04 · Loop Back</b><p class="mu">Smart segments spot lapsed guests & birthdays automatically — bringing them back with 1-click WhatsApp offers & Google review links.</p></div>
    </div>
  </section>

  <section id="roi" class="lp-sec">
    <div class="card">
      <div class="g2" style="align-items:center">
        <div>
          <b style="font-size:15px">${hi?"अपना मासिक मुनाफ़ा देखें (ROI कैलकुलेटर)":"See How Much DineLoop Earns You Back"}</b>
          <p class="mu">Slide or enter your daily volume to see estimated repeat revenue + paper & leakage savings.</p>
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
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"क्यों चुनें DineLoop":"Built Different From Legacy Billing Software"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>🛡 Zero-Loophole Prepaid Control</b><p class="mu">No guest can falsely claim "I paid at reception." Waiters verify the 4-digit code in 1 second, and QR only charges extra items.</p></div>
      <div class="card"><b>📷 Instant Menu OCR & PDF Import</b><p class="mu">Skip typing 200 dishes manually. Snap a photo or upload your PDF menu — AI populates items, categories & prices in seconds.</p></div>
      <div class="card"><b>📱 4 Apps in One Platform</b><p class="mu">Reception POS, Waiter Mobile PWA, Kitchen Station Display, Counter Customer Screen & QR Self-Ordering — all synced in real time.</p></div>
      <div class="card"><b>📦 Real BOM Food Cost & GSTR-1</b><p class="mu">Track recipe-level ingredient usage, supplier GRN, wastage, GSTR-1 slabs, Tally XML export, and Menu Engineering Stars vs Dogs.</p></div>
      <div class="card"><b>✦ Built-in Wallet, Gift Cards & Tiers</b><p class="mu">No separate expensive CRM add-on needed. Run prepaid wallets, gift cards, referrals & automated WhatsApp journeys natively.</p></div>
      <div class="card"><b>🏢 Ready for 1 Outlet or 50</b><p class="mu">Start with a single café or scale to a multi-city brand with central menu push, staff attendance, cash drawer tallies & audit logs.</p></div>
    </div>
  </section>

  <section id="price" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"साफ और किफायती प्लान्स":"Transparent Plans · Start 14 Days Free"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>Starter</b><div style="font:800 28px Outfit,sans-serif;margin:8px 0">₹599 <small class="mu">/mo</small></div><p class="mu">Counter POS, Kitchen Display, Exact UPI QR, GST Billing, Z-Report & CSV Exports.</p><button class="sm" onclick="openSignupModal()">Start Free Trial</button></div>
      <div class="card" style="border-color:var(--ac)"><b>Growth ★ Most Popular</b><div style="font:800 28px Outfit,sans-serif;color:var(--ac);margin:8px 0">₹1,199 <small class="mu">/mo</small></div><p class="mu">Everything in Starter + Waiter PWA, Anti-Fraud Prepaid Codes, QR Table Ordering, Loyalty Tiers, Wallet & BOM Inventory.</p><button class="sm pri" onclick="openSignupModal()">Start 14-Day Trial</button></div>
      <div class="card"><b>Multi-Outlet Pro</b><div style="font:800 28px Outfit,sans-serif;margin:8px 0">₹2,199 <small class="mu">/mo</small></div><p class="mu">AI Menu OCR & Insights, Central Menu Push, Aggregator Inbox, Webhooks, Audit Logs & Dedicated Onboarding.</p><button class="sm ok" onclick="openDemoModal()">Book Demo</button></div>
    </div>
  </section>

  <footer style="text-align:center;padding:22px 0 44px;border-top:1px solid var(--ln)" class="mu">
    © ${new Date().getFullYear()} DineLoop · Smart Hospitality Platform · <a href="/order.html?outlet=main" target="_blank">Live QR Menu Preview</a> · <a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy Policy</a>
  </footer>

  ${!cookieOk?`<div class="lp-cookie" id="ckBar">
    <div style="font-size:13px;line-height:1.45;margin-bottom:10px">🍪 We use essential storage to run DineLoop POS & sync your session securely. <a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy policy</a></div>
    <div class="tbs" style="margin:0">
      <button class="pri sm" style="flex:1" onclick="acceptCookies('all')">Accept</button>
      <button class="sm" style="flex:1" onclick="acceptCookies('essential')">Only essential</button>
    </div>
  </div>`:""}

  <a class="lp-wa" href="${waHref}" ${waNum?`target="_blank"`:`onclick="event.preventDefault();openDemoModal()"`} title="Chat on WhatsApp">💬</a>
  `;
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
