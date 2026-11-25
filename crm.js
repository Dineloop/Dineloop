// DineLoop CRM, Loyalty Pro, Gift Cards, Wallet, Journeys, Feedback & Reservations (Batch 3 + 5)
window.getTier = function(c){
  const sp = +(c&&c.spent)||0;
  if(sp >= 25000) return {n:"Platinum", mult:2, clr:"var(--ac)"};
  if(sp >= 10000) return {n:"Gold", mult:1.5, clr:"var(--wn)"};
  if(sp >= 3000) return {n:"Silver", mult:1.25, clr:"#cbd5e1"};
  return {n:"Bronze", mult:1, clr:"#cd7f32"};
};

window.crmTab = window.crmTab || "guests";
window.vCust = function(){
  const tabs = [
    ["guests","Guests & Tiers"],
    ["wa","WA Journeys & ROI"],
    ["wallet","Wallet & Gift Cards"],
    ["fb","Feedback & Reviews"],
    ["resv","Reservations & Waitlist"]
  ];
  let body = "";
  if(window.crmTab==="guests") body = crmGuestsHtml();
  else if(window.crmTab==="wa") body = crmWaHtml();
  else if(window.crmTab==="wallet") body = crmWalletHtml();
  else if(window.crmTab==="fb") body = crmFeedbackHtml();
  else body = crmResvHtml();

  return `<div class="card" style="padding:10px 14px">
    <div class="tbs" style="margin:0">
      ${tabs.map(([k,l])=>`<button class="sm ${window.crmTab===k?"on":""}" onclick="window.crmTab='${k}';render()">${l}</button>`).join("")}
      <button class="sm ok" style="margin-left:auto" onclick="openJoinQrMdl()">QR-to-Join Loyalty</button>
    </div>
  </div>` + body;
};

function crmGuestsHtml(){
  const A = Object.entries(S.cust).sort((a,b)=>(b[1].spent||0)-(a[1].spent||0));
  const curMonth = new Date().getMonth()+1;
  return `<div class="card tw">
    <div class="row" style="border:0;padding:0">
      <b>Guest Directory & Loyalty Tiers (${A.length})</b>
      <div class="tbs" style="margin:0">
        <button class="sm pri" onclick="openGuestMdl()">+ Add / Edit Guest</button>
        <button class="sm" onclick="dlCsv('cust')">Export CSV</button>
      </div>
    </div>
    <table style="margin-top:8px">
      <tr><th>Guest</th><th>Mobile</th><th>Tier</th><th>Pts</th><th>Wallet</th><th>Visits</th><th>Spent</th><th>Segment</th><th>Actions</th></tr>
      ${A.map(([p,c])=>{
        const tr = getTier(c);
        const isBday = c.dob && (+c.dob.split("-")[1]===curMonth);
        return `<tr>
          <td><b>${esc(c.name)}</b>${isBday?` <span class="tag wnt">🎂 Bday</span>`:""}${c.refCode?`<br><small class="mu">Ref: ${esc(c.refCode)}</small>`:""}</td>
          <td>${esc(p)}</td>
          <td><span class="tag" style="border-color:${tr.clr};color:${tr.clr}">${tr.n} (${tr.mult}x)</span></td>
          <td><b>${c.pts||0}</b></td>
          <td>₹${R(c.wallet||0)}</td>
          <td>${c.visits||0}</td>
          <td>₹${R(c.spent||0)}</td>
          <td><span class="tag">${seg(c)}</span></td>
          <td>
            <button class="sm" onclick="openGuestMdl('${esc(p)}')">Edit</button>
            <button class="sm ok" onclick="openMemberPass('${esc(p)}')">Pass</button>
          </td>
        </tr>`;
      }).join("")||`<tr><td colspan="9" class="mu">No guests recorded yet.</td></tr>`}
    </table>
  </div>`;
}

window.openGuestMdl = function(p=""){
  const c = p ? (S.cust[p]||{}) : {};
  showMdl(`<b>${p?"Edit Guest":"Add Guest"}</b>
    <div style="margin:10px 0;display:grid;gap:8px">
      <input id="gPh" placeholder="10-digit Mobile" maxlength="10" value="${esc(p)}" ${p?"readonly":""}>
      <input id="gNm" placeholder="Guest Name" value="${esc(c.name||"")}">
      <div class="g2">
        <div><label class="mu">Birthday</label><input id="gDob" type="date" value="${esc(c.dob||"")}"></div>
        <div><label class="mu">Anniversary</label><input id="gAnn" type="date" value="${esc(c.ann||"")}"></div>
      </div>
      <div class="g2">
        <input id="gRefBy" placeholder="Referred by (Mobile/Code)" value="${esc(c.refBy||"")}">
        <label style="display:flex;align-items:center;gap:6px"><input id="gOpt" type="checkbox" style="width:auto" ${c.opt?"checked":""}> WhatsApp Opt-in</label>
      </div>
    </div>
    <div class="tbs"><button class="pri" onclick="saveGuestMdl()">Save Guest</button><button onclick="closeMdl()">Cancel</button></div>`);
};

window.saveGuestMdl = function(){
  const p = $("#gPh").value.replace(/\D/g,"");
  if(p.length!==10) return toast("Need 10-digit mobile");
  const isNew = !S.cust[p];
  const c = S.cust[p] = S.cust[p] || {name:"",pts:0,visits:0,last:Date.now(),spent:0,opt:0,wallet:0};
  c.name = $("#gNm").value.trim() || c.name || "Guest";
  c.dob = $("#gDob").value; c.ann = $("#gAnn").value;
  c.opt = $("#gOpt").checked ? 1 : 0;
  if(!c.refCode) c.refCode = "DL"+p.slice(-4);
  const rb = $("#gRefBy").value.trim().toUpperCase();
  if(isNew && rb){
    const refEntry = Object.entries(S.cust).find(([rp,rc])=>rp===rb || (rc.refCode||"").toUpperCase()===rb);
    if(refEntry && refEntry[0]!==p){
      refEntry[1].pts = (refEntry[1].pts||0) + 50;
      c.pts = (c.pts||0) + 50; c.refBy = refEntry[0];
      toast("Referral applied! +50 pts to both.");
    }
  }
  save(); closeMdl(); render(); toast("Guest saved");
};

window.openMemberPass = function(p){
  const c = S.cust[p]; if(!c) return;
  const tr = getTier(c);
  const url = `${location.origin}/order.html?outlet=${encodeURIComponent(activeOutlet)}&mode=join&ref=${encodeURIComponent(c.refCode||p)}`;
  showMdl(`<b>✦ Digital Membership Pass</b>
    <div class="card" style="margin:10px 0;text-align:center;border-color:${tr.clr}">
      <div style="font:800 20px Outfit,sans-serif;color:${tr.clr}">${esc(S.cfg.rName)} · ${tr.n.toUpperCase()}</div>
      <div style="font-size:18px;margin:4px 0"><b>${esc(c.name)}</b> (${esc(p)})</div>
      <div class="tbs" style="justify-content:center;margin:8px 0">
        <span class="tag okt">Points: ${c.pts||0}</span>
        <span class="tag">Wallet: ₹${R(c.wallet||0)}</span>
        <span class="tag">Ref: ${esc(c.refCode||("DL"+p.slice(-4)))}</span>
      </div>
      <div class="qr-box">${makeQrSvg(url,160)}</div>
    </div>
    <div class="tbs"><button class="pri" onclick="sendWA('${p}','Your ${esc(S.cfg.rName)} ${tr.n} Pass: Points ${c.pts||0}, Wallet ₹${R(c.wallet||0)}. Share code ${esc(c.refCode||p)} with friends for 50 bonus pts!')">Send on WhatsApp</button><button onclick="closeMdl()">Close</button></div>`);
};

window.openJoinQrMdl = function(){
  const url = `${location.origin}/order.html?outlet=${encodeURIComponent(activeOutlet)}&mode=join`;
  showMdl(`<b>QR-to-Join Loyalty Club</b>
    <p class="mu">Print or display at counter. Guests scan to join Loyalty & get Welcome Points!</p>
    <div style="text-align:center"><div class="qr-box">${makeQrSvg(url,220)}</div></div>
    <div class="tbs" style="justify-content:center"><button class="pri" onclick="pt('${esc(S.cfg.rName)} LOYALTY CLUB\\nScan to Join & Earn Rewards!', makeQrSvg('${url}',160))">Print Standee</button><button onclick="closeMdl()">Close</button></div>`);
};

function crmWaHtml(){
  const A = Object.entries(S.cust);
  const curM = new Date().getMonth()+1;
  const segFilter = ([p,c]) => {
    if(!c.opt) return false;
    if(sg==="All") return true;
    if(sg==="VIP") return (c.spent||0)>=10000;
    if(sg==="Birthday") return c.dob && (+c.dob.split("-")[1]===curM);
    return seg(c)===sg;
  };
  const T = A.filter(segFilter);
  const camps = S.campaigns || [];
  const totalSent = camps.reduce((a,x)=>a+(x.sent||0),0);
  const jr = S.cfg.journeys || {welcome:true, thankyou:true, winbackDays:14, bday:true};

  return `<div class="g2">
    <div class="card"><b>WhatsApp Campaigns & Smart Segments</b>
      <div class="g2" style="margin-top:8px">
        <select onchange="sg=this.value;render()">${["All","New","Regular","Lapsed","VIP","Birthday"].map(x=>`<option ${x===sg?"selected":""}>${x}</option>`).join("")}</select>
        <input type="number" min="1" value="${LD}" onchange="LD=+this.value||14;render()" title="Lapsed after N days">
      </div>
      <textarea id="campMsg" rows="3" style="margin-top:8px" onchange="msg=this.value">${esc(msg)}</textarea>
      <div class="tbs" style="margin-top:8px">
        <button class="pri" onclick="runCampaign(${T.length})">Send Campaign (${T.length} opted-in)</button>
      </div>
      ${T.slice(0,25).map(([p,c])=>`<div class="row"><span>${esc(c.name)} · ${p} <span class="tag">${getTier(c).n}</span></span><button class="sm" onclick="sendWA('${p}',wt('${p}'))">Send</button></div>`).join("")||`<p class="mu">No opted-in guests in "${sg}" segment.</p>`}
    </div>

    <div class="card"><b>Automatic Journeys & Campaign ROI</b>
      <div style="margin:8px 0;display:grid;gap:6px">
        <label><input type="checkbox" style="width:auto" ${jr.welcome?"checked":""} onchange="toggleJourney('welcome',this.checked)"> Welcome Message (New Guest 1st visit)</label>
        <label><input type="checkbox" style="width:auto" ${jr.thankyou?"checked":""} onchange="toggleJourney('thankyou',this.checked)"> Post-Bill Thank You + Feedback Link</label>
        <label><input type="checkbox" style="width:auto" ${jr.bday?"checked":""} onchange="toggleJourney('bday',this.checked)"> Birthday / Anniversary Offer</label>
      </div>
      <button class="sm ok" onclick="runBirthdayBatch()">Run Today's Birthday Wishes</button>
      <div class="stats" style="margin-top:12px">
        <div class="card"><span class="mu">Campaigns Run</span><b>${camps.length}</b></div>
        <div class="card"><span class="mu">Msgs Sent</span><b>${totalSent}</b></div>
      </div>
      ${camps.slice(-5).reverse().map(cp=>`<div class="row"><span>${esc(cp.seg)} (${cp.sent} sent)</span><small class="mu">${new Date(cp.t).toLocaleDateString("en-IN")}</small></div>`).join("")}
    </div>
  </div>`;
}

window.toggleJourney = function(k,v){S.cfg.journeys=S.cfg.journeys||{};S.cfg.journeys[k]=v;save();toast("Journey updated");};
window.runCampaign = function(cnt){
  if(!cnt) return toast("No opted-in guests");
  const A = Object.entries(S.cust).filter(([,c])=>c.opt&&(sg==="All"||seg(c)===sg||(sg==="VIP"&&(c.spent||0)>=10000)||(sg==="Birthday"&&c.dob&&(+c.dob.split("-")[1]===new Date().getMonth()+1))));
  A.forEach(([p],i)=>setTimeout(()=>sendWA(p,wt(p)),i*1000));
  S.campaigns = S.campaigns || [];
  S.campaigns.push({t:Date.now(), seg:sg, sent:A.length});
  save(); render(); toast("Queued "+A.length+" messages");
};
window.runBirthdayBatch = function(){
  const md = new Date().toISOString().slice(5,10);
  const list = Object.entries(S.cust).filter(([,c])=>c.opt && ((c.dob||"").slice(5,10)===md || (c.ann||"").slice(5,10)===md));
  if(!list.length) return toast("No opted-in birthdays/anniversaries today");
  list.forEach(([p,c],i)=>setTimeout(()=>sendWA(p,`Happy Special Day ${c.name}! Enjoy 15% off at ${S.cfg.rName} today!`),i*1000));
  toast("Sent to "+list.length+" guests");
};

function crmWalletHtml(){
  const gcs = S.giftCards || [];
  return `<div class="g2">
    <div class="card"><b>Guest Prepaid Wallet Top-up</b>
      <div style="margin:8px 0;display:grid;gap:8px">
        <input id="wlPh" placeholder="Guest 10-digit mobile" maxlength="10">
        <input id="wlAmt" type="number" min="1" placeholder="Top-up Amount ₹">
        <button class="pri" onclick="topupWallet()">Add to Wallet</button>
      </div>
      <p class="mu">Guests can pay directly from their Wallet balance at Billing.</p>
    </div>

    <div class="card"><b>Issue & Manage Gift Cards (${gcs.length})</b>
      <div class="tbs" style="margin-top:8px">
        <input id="gcCode" placeholder="Code (auto if blank)" style="flex:1">
        <input id="gcVal" type="number" min="1" placeholder="Value ₹" style="width:100px">
        <button class="pri sm" onclick="issueGiftCard()">Issue Card</button>
      </div>
      ${gcs.map((g,i)=>`<div class="row">
        <span><b>${esc(g.code)}</b> · Bal: <b style="color:var(--ok)">₹${g.bal}</b> / ₹${g.init}</span>
        <button class="sm wr" onclick="S.giftCards.splice(${i},1);save();render()">Del</button>
      </div>`).join("")||`<p class="mu">No gift cards issued yet.</p>`}
    </div>
  </div>`;
}

window.topupWallet = function(){
  const p = $("#wlPh").value.replace(/\D/g,""), amt = +$("#wlAmt").value||0;
  if(p.length!==10||amt<=0) return toast("Enter 10-digit mobile & amount");
  const c = S.cust[p] = S.cust[p] || {name:"Guest",pts:0,visits:0,last:Date.now(),spent:0,opt:0,wallet:0};
  c.wallet = R((c.wallet||0)+amt);
  save(); render(); toast("Added ₹"+amt+" to "+c.name+"'s wallet");
};
window.issueGiftCard = function(){
  const val = +$("#gcVal").value||0; if(val<=0) return toast("Enter value");
  const code = ($("#gcCode").value.trim() || ("GC-"+Math.floor(100000+Math.random()*900000))).toUpperCase();
  S.giftCards = S.giftCards || [];
  S.giftCards.push({code, init:val, bal:val, t:Date.now()});
  save(); render(); toast("Issued Gift Card "+code+" (₹"+val+")");
};

function crmFeedbackHtml(){
  const fbs = S.feedbacks || [];
  const low = fbs.filter(f=>f.rating<=3);
  return `<div class="g2">
    <div class="card"><b>Google Review Booster & Feedback Link</b>
      <p class="mu">4–5★ guests automatically see your Google Review link. ≤3★ triggers an alert here!</p>
      <input id="gRevUrl" placeholder="Your Google Review Link (https://g.page/r/...)" value="${esc(S.cfg.googleReviewUrl||"")}" style="margin:8px 0">
      <button class="pri sm" onclick="S.cfg.googleReviewUrl=$('#gRevUrl').value.trim();save();toast('Review URL saved')">Save Google Review URL</button>
      <div class="tbs" style="margin-top:10px">
        <span class="tag ${low.length?"low":"okt"}">Low-Rating Alerts (≤3★): ${low.length}</span>
      </div>
    </div>
    <div class="card"><b>Recent Guest Feedback (${fbs.length})</b>
      ${[...fbs].reverse().slice(0,15).map(f=>`<div class="row">
        <span><b>${"★".repeat(f.rating)}${"☆".repeat(5-f.rating)}</b> ${esc(f.name||"Guest")} (${esc(f.ph||"—")})<br><small class="mu">${esc(f.msg||"")}</small></span>
        <span class="tag ${f.rating<=3?"low":"okt"}">${f.rating<=3?"Alert":"Happy"}</span>
      </div>`).join("")||`<p class="mu">No feedback received yet.</p>`}
    </div>
  </div>`;
}

function crmResvHtml(){
  const resv = S.reservations || [], wl = S.waitlist || [];
  return `<div class="g2">
    <div class="card"><b>Table Reservations (${resv.length})</b>
      <div class="g2" style="margin-top:8px">
        <input id="rvNm" placeholder="Guest Name">
        <input id="rvPh" placeholder="Mobile" maxlength="10">
      </div>
      <div class="g3" style="margin-top:6px">
        <input id="rvDt" type="datetime-local">
        <input id="rvPx" type="number" min="1" value="2" placeholder="Guests">
        <input id="rvTb" placeholder="Table (e.g. T2)">
      </div>
      <button class="pri sm" style="margin-top:8px" onclick="addReservation()">+ Book Table</button>
      ${resv.map((r,i)=>`<div class="row">
        <span><b>${esc(r.name)}</b> (${r.pax}p · ${esc(r.tb||"Any")})<br><small class="mu">${r.dt?new Date(r.dt).toLocaleString("en-IN"):""} · ${esc(r.ph)}</small></span>
        <div class="tbs" style="margin:0">
          ${r.ph?`<button class="sm" onclick="sendWA('${r.ph}','Hi ${esc(r.name)}, your table for ${r.pax} at ${esc(S.cfg.rName)} is confirmed!')">WA</button>`:""}
          <button class="sm wr" onclick="S.reservations.splice(${i},1);save();render()">Done</button>
        </div>
      </div>`).join("")||`<p class="mu">No reservations.</p>`}
    </div>

    <div class="card"><b>Walk-in Waiting List (${wl.length})</b>
      <div class="tbs" style="margin-top:8px">
        <input id="wtNm" placeholder="Guest Name" style="flex:1">
        <input id="wtPh" placeholder="Mobile" maxlength="10" style="width:115px">
        <input id="wtPx" type="number" value="2" style="width:65px">
        <button class="pri sm" onclick="addWaitlist()">+ Queue</button>
      </div>
      ${wl.map((w,i)=>`<div class="row">
        <span><b>#${i+1} ${esc(w.name)}</b> (${w.pax} Guests · ${esc(w.ph)})</span>
        <div class="tbs" style="margin:0">
          ${w.ph?`<button class="sm ok" onclick="sendWA('${w.ph}','Hi ${esc(w.name)}, your table for ${w.pax} is ready now at ${esc(S.cfg.rName)}!')">Table Ready WA</button>`:""}
          <button class="sm wr" onclick="S.waitlist.splice(${i},1);save();render()">Seat/Del</button>
        </div>
      </div>`).join("")||`<p class="mu">No guests waiting.</p>`}
    </div>
  </div>`;
}

window.addReservation = function(){
  const name = $("#rvNm").value.trim(); if(!name) return toast("Guest name required");
  S.reservations = S.reservations || [];
  S.reservations.push({name, ph:$("#rvPh").value.replace(/\D/g,""), dt:$("#rvDt").value, pax:+$("#rvPx").value||2, tb:$("#rvTb").value.trim()});
  save(); render(); toast("Reservation added");
};
window.addWaitlist = function(){
  const name = $("#wtNm").value.trim(); if(!name) return toast("Guest name required");
  S.waitlist = S.waitlist || [];
  S.waitlist.push({name, ph:$("#wtPh").value.replace(/\D/g,""), pax:+$("#wtPx").value||2, t:Date.now()});
  save(); render(); toast("Added to waitlist");
};
