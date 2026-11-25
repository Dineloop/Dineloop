// DineLoop Public SaaS Landing Page (Original DineLoop copy & Brushed Metallic Luxury UI)
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

  $("#v").innerHTML = `
  <style>
    .lp-nav{position:sticky;top:0;z-index:25;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;background:var(--sf2);border-bottom:1px solid var(--ln);border-radius:16px;margin-bottom:22px;box-shadow:inset 0 1px 0 var(--rim),0 10px 30px rgba(0,0,0,.35)}
    .lp-links{display:flex;gap:18px;align-items:center}
    .lp-links a{color:var(--tx);text-decoration:none;font-weight:600;font-size:14px;opacity:.88}.lp-links a:hover{color:var(--ac);opacity:1}
    @media(max-width:820px){.lp-links{display:none}}
    .lp-hero{display:grid;grid-template-columns:1.05fr 1fr;gap:28px;align-items:center;padding:18px 6px 34px}
    @media(max-width:860px){.lp-hero{grid-template-columns:1fr}}
    .lp-h1{font:800 clamp(32px,5vw,54px)/1.06 Outfit,sans-serif;margin:14px 0;letter-spacing:-.02em}
    .lp-h1 span{background:var(--pri);-webkit-background-clip:text;background-clip:text;color:transparent}
    .lp-mock{position:relative;display:grid;gap:12px}
    .lp-win{background:var(--sf);border:1px solid var(--ln);border-radius:16px;padding:14px;box-shadow:inset 0 1px 0 var(--rim),0 18px 44px rgba(0,0,0,.45)}
    .lp-dots{display:flex;gap:6px;align-items:center;margin-bottom:10px;font-size:12px;color:var(--mu)}
    .lp-dots i{width:9px;height:9px;border-radius:99px;display:inline-block}
    .lp-sec{padding:28px 0}
    .lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    @media(max-width:820px){.lp-grid3{grid-template-columns:1fr}}
    .lp-cookie{position:fixed;left:16px;bottom:16px;max-width:390px;z-index:60;background:var(--sf2);border:1px solid var(--ln);border-radius:16px;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
    .lp-wa{position:fixed;right:18px;bottom:18px;z-index:60;width:54px;height:54px;border-radius:99px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;text-decoration:none;box-shadow:0 8px 24px rgba(37,211,102,.4)}
  </style>

  <div class="lp-nav">
    <div style="display:flex;align-items:center;gap:10px">
      <h1 style="margin:0">🍽️ DINELOOP</h1>
    </div>
    <div class="lp-links">
      <a href="#feat">${hi?"फीचर्स":"Features"}</a>
      <a href="#sol">${hi?"किसके लिए":"Solutions"}</a>
      <a href="#price">${hi?"प्राइसिंग":"Pricing"}</a>
      <a href="#faq">FAQ</a>
    </div>
    <div class="tbs" style="margin:0">
      <button class="sm" onclick="toggleLang()">${hi?"हिं":"EN"}</button>
      <button class="sm" onclick="cycleTheme()">🎨</button>
      <button class="sm" onclick="openLoginModal()">${hi?"स्टाफ लॉगिन":"Login"}</button>
      <button class="sm pri" onclick="openDemoModal()">${hi?"फ्री डेमो बुक करें":"Book a Free Demo"}</button>
    </div>
  </div>

  <section class="lp-hero">
    <div>
      <span class="tag okt">● ${hi?"भारत के रेस्टोरेंट्स के लिए ऑल-इन-वन POS":"All-in-One Restaurant POS + Loyalty for India"}</span>
      <h2 class="lp-h1">${hi?"बिलिंग, किचन, वेटर और <span>WhatsApp मार्केटिंग</span> — एक ही डेक पर।":"Turn every bill into a <span>repeat guest</span> automatically."}</h2>
      <p class="mu" style="font-size:17px;line-height:1.55">
        ${hi
          ?"POS बिलिंग, अलग वेटर ऐप, किचन डिस्प्ले, सटीक UPI QR, मेनू Photo/PDF स्कैनर, और ऑटोमैटिक लॉयल्टी — बिना किसी महंगे हार्डवेयर के।"
          :"DineLoop combines Petpooja-grade billing, Kitchen Display, separate Waiter PWA, exact-amount UPI QR, Menu Photo/PDF OCR, and Reelo-style WhatsApp loyalty in one lightweight platform."}
      </p>
      <div class="tbs" style="margin-top:18px">
        <button class="pri" style="padding:12px 20px;font-size:16px" onclick="openDemoModal()">${hi?"फ्री डेमो बुक करें →":"Book a Free Demo →"}</button>
        <button style="padding:12px 18px" onclick="openLoginModal()">${hi?"POS में लॉगिन करें":"Staff Login"}</button>
        <a href="/order.html?outlet=main" target="_blank" style="text-decoration:none"><button class="ok" style="padding:12px 16px">${hi?"QR मेनू देखें":"Preview QR Menu"}</button></a>
      </div>
    </div>

    <div class="lp-mock">
      <div class="lp-win">
        <div class="lp-dots"><i style="background:#fb7185"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span style="margin-left:6px">Billing · Table T4 · Dine-In</span><span class="tag okt" style="margin-left:auto">● Live Sync</span></div>
        <div class="row"><span>Masala Dosa ×2</span><b>₹240</b></div>
        <div class="row"><span>Paneer Tikka ×1</span><b>₹260</b></div>
        <div class="row"><span>CGST 2.5% + SGST 2.5%</span><span>₹25</span></div>
        <div class="row" style="border:0"><b style="font-size:17px">Total Payable</b><b style="font-size:20px;color:var(--ac)">₹525</b></div>
        <div class="tbs" style="margin-top:8px;margin-bottom:0">
          <button class="sm" style="flex:1">Send KOT</button>
          <button class="sm ok" style="flex:1">Show UPI QR ₹525</button>
          <button class="sm pri" style="flex:1">Cash / UPI</button>
        </div>
      </div>
      <div class="g2" style="gap:12px">
        <div class="lp-win" style="margin:0">
          <div class="lp-dots"><i style="background:#fbbf24"></i><span>Kitchen Display</span></div>
          <div><b>KOT #42 · T4</b> <span class="tag wnt">4m</span></div>
          <small class="mu">2× Masala Dosa · 1× Paneer Tikka</small>
        </div>
        <div class="lp-win" style="margin:0">
          <div class="lp-dots"><i style="background:#34d399"></i><span>Today · Main Outlet</span></div>
          <div style="font:800 22px Outfit,sans-serif;color:var(--ac)">₹48,250</div>
          <small style="color:var(--ok)">↑ 18% repeat guests via WhatsApp</small>
        </div>
      </div>
    </div>
  </section>

  <section id="feat" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"मुख्य फीचर्स":"Everything Your Restaurant Needs"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>⚡ Fast Billing & UPI QR</b><p class="mu">Dine-In, Parcel, Split Pay, Coupons, Exact-amount UPI QR on bill & Waiter phone, plus Prepaid Reception verification codes.</p></div>
      <div class="card"><b>📱 Separate Waiter PWA</b><p class="mu">Waiters install their own lightweight app to mark table occupancy, guest count, fire KOTs to stations, and show UPI QR at table.</p></div>
      <div class="card"><b>🍳 Smart Kitchen & Expo</b><p class="mu">Station routing (Main, Tandoor, Beverage), overdue prep timers with sound chimes, Recall tickets, and Expo table grouping.</p></div>
      <div class="card"><b>✦ Loyalty & WhatsApp CRM</b><p class="mu">Auto Bronze-to-Platinum tiers, Prepaid Wallet, Gift Cards, Birthday wishes, Google Review booster, and Win-back campaigns.</p></div>
      <div class="card"><b>📷 AI Menu OCR & PDF Scan</b><p class="mu">Upload a photo or PDF of your paper menu — DineLoop extracts dishes, categories, and prices in seconds.</p></div>
      <div class="card"><b>📦 BOM Recipes & GST Reports</b><p class="mu">Multi-ingredient stock deduction, Food Cost %, PO/GRN, GSTR-1 rate summary, Tally XML export, and Day-End Z-Report.</p></div>
    </div>
  </section>

  <section id="sol" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"हर फ़ॉर्मेट के लिए":"Built for Every Food Business"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>🍽️ Fine Dine & Cafes</b><p class="mu">Floor map, table move/merge, waiter occupancy sync, QR table ordering, and personalized VIP guest passes.</p></div>
      <div class="card"><b>🥡 QSR & Cloud Kitchens</b><p class="mu">Counter token numbers, quick cash-and-go billing, Swiggy/Zomato/ONDC inbox, and delivery rider COD tracking.</p></div>
      <div class="card"><b>🏢 Multi-Outlet Brands</b><p class="mu">Central menu push across branches, isolated per-outlet staff roles, audit logs, and SaaS Super Admin console.</p></div>
    </div>
  </section>

  <section id="price" class="lp-sec">
    <h3 class="ttl" style="font-size:15px;margin-bottom:12px">${hi?"पारदर्शी प्राइसिंग":"Simple, Transparent Pricing"}</h3>
    <div class="lp-grid3">
      <div class="card"><b>Starter</b><div style="font:800 28px Outfit,sans-serif;margin:8px 0">₹599 <small class="mu">/mo</small></div><p class="mu">Counter POS, KOT, GST Billing, Exact UPI QR, Day-End Z-Report, CSV Exports.</p><button class="sm" onclick="openDemoModal()">Get Started</button></div>
      <div class="card" style="border-color:var(--ac)"><b>Growth ★ Popular</b><div style="font:800 28px Outfit,sans-serif;color:var(--ac);margin:8px 0">₹1,199 <small class="mu">/mo</small></div><p class="mu">Everything in Starter + Waiter PWA, QR Table Ordering, Loyalty Tiers, WhatsApp Campaigns & Inventory BOM.</p><button class="sm pri" onclick="openDemoModal()">Book Free Demo</button></div>
      <div class="card"><b>Multi-Outlet Pro</b><div style="font:800 28px Outfit,sans-serif;margin:8px 0">₹2,199 <small class="mu">/mo</small></div><p class="mu">Central Menu Push, AI Menu OCR & Insights, Swiggy/Zomato Inbox, Audit Logs & Priority Support.</p><button class="sm" onclick="openDemoModal()">Contact Sales</button></div>
    </div>
  </section>

  <section id="faq" class="lp-sec">
    <div class="card"><b>Frequently Asked Questions</b>
      <div class="row"><span><b>Does DineLoop work on existing laptops & Android phones?</b><br><small class="mu">Yes! Install directly as a standalone Windows Desktop App or Android PWA — no proprietary hardware needed.</small></span></div>
      <div class="row"><span><b>How does Reception Prepaid + Waiter anti-fraud work?</b><br><small class="mu">Reception generates a single-use 4-digit code on prepaid slips. Waiters verify the code on their phone and QR only asks for extra items.</small></span></div>
      <div class="row" style="border:0"><span><b>Can I manage multiple restaurants from one place?</b><br><small class="mu">Yes, DineLoop is built with isolated multi-tenant SaaS security and central menu push.</small></span></div>
    </div>
  </section>

  <footer style="text-align:center;padding:20px 0 40px;border-top:1px solid var(--ln)" class="mu">
    © ${new Date().getFullYear()} DineLoop · Built for Indian Restaurants · <a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy Policy</a>
  </footer>

  ${!cookieOk?`<div class="lp-cookie" id="ckBar">
    <div style="font-size:13px;line-height:1.45;margin-bottom:10px">🍪 We use essential storage to run DineLoop POS & sync your session. <a href="javascript:void(0)" onclick="openPrivacyMdl()">Privacy policy</a></div>
    <div class="tbs" style="margin:0">
      <button class="pri sm" style="flex:1" onclick="acceptCookies('all')">Accept</button>
      <button class="sm" style="flex:1" onclick="acceptCookies('essential')">Only essential</button>
    </div>
  </div>`:""}

  <a class="lp-wa" href="${waHref}" ${waNum?`target="_blank"`:`onclick="event.preventDefault();openDemoModal()"`} title="Chat / Book Demo on WhatsApp">💬</a>
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
      • Guest phone numbers belong strictly to each restaurant outlet and are never shared across tenants or sent to AI.<br>
      • WhatsApp marketing messages are sent only to guests who opt in.<br>
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
    </div>`);
  setTimeout(()=>$("#em")?.focus(),50);
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
