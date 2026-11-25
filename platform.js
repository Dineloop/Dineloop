// DineLoop Platform & Analytics Pro: Shifts, Attendance, Cash Drawer, Audit Log, Petpooja Import, Delivery, Menu Engineering, Fraud Alerts, Forecast & Central Push (Batch 6 + 7)
window.opsTab = window.opsTab || "shifts";

window.logAudit = function(action, details={}){
  S.audit = S.audit || [];
  S.audit.push({t:Date.now(), by:activeName, role:myRole, action, details});
  if(S.audit.length>300) S.audit = S.audit.slice(-300);
  if(sb&&user){
    sb.from("audit_logs").insert({restaurant_id:activeOutlet, actor_email:user.email, actor_role:myRole, action, details}).then(()=>{});
  }
};

window.vOps = function(){
  const tabs = [
    ["shifts","Shifts, Tips & Cash Drawer"],
    ["deliv","Delivery Zones & Riders"],
    ["eng","Menu Engineering & Forecast"],
    ["fraud","Fraud Alerts & Audit Log"],
    ["import","Petpooja CSV & Webhooks"]
  ];
  let body = "";
  if(window.opsTab==="shifts") body = opsShiftsHtml();
  else if(window.opsTab==="deliv") body = opsDelivHtml();
  else if(window.opsTab==="eng") body = opsEngHtml();
  else if(window.opsTab==="fraud") body = opsFraudHtml();
  else body = opsImportHtml();

  return `<div class="card" style="padding:10px 14px">
    <div class="tbs" style="margin:0">
      ${tabs.map(([k,l])=>`<button class="sm ${window.opsTab===k?"on":""}" onclick="window.opsTab='${k}';render()">${l}</button>`).join("")}
      <button class="sm ok" style="margin-left:auto" onclick="sendOwnerSummaryWA()">Daily Summary WA</button>
    </div>
  </div>` + body;
};

function opsShiftsHtml(){
  const sh = S.shifts || [];
  const denoms = [500,200,100,50,20,10];
  return `<div class="g2">
    <div class="card"><b>Staff Attendance, Shifts & Tips</b>
      <div class="g3" style="margin-top:8px">
        <input id="shNm" placeholder="Staff Name" value="${esc(activeName)}">
        <input id="shTip" type="number" placeholder="Tips ₹" value="0">
        <button class="pri sm" onclick="clockInStaff()">Clock In</button>
      </div>
      <div style="margin-top:10px">
        ${sh.slice().reverse().slice(0,12).map((x,ri)=>{
          const idx = sh.length-1-ri;
          return `<div class="row">
            <span><b>${esc(x.name)}</b> (${esc(x.role)}) · In: ${new Date(x.in).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}${x.out?` → Out: ${new Date(x.out).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}`:""} · Tips: ₹${x.tips||0}</span>
            ${!x.out?`<button class="sm wr" onclick="clockOutStaff(${idx})">Clock Out</button>`:`<span class="tag okt">Done</span>`}
          </div>`;
        }).join("")||`<p class="mu">No shifts logged yet.</p>`}
      </div>
    </div>

    <div class="card"><b>Cash Drawer Denomination Counter</b>
      <p class="mu">Count physical notes to tally drawer cash:</p>
      <div style="display:grid;gap:6px;margin-top:8px">
        ${denoms.map(d=>`<div class="row"><span>₹${d} ×</span><input id="dn_${d}" type="number" min="0" value="0" style="width:90px" oninput="calcDrawerSum()"></div>`).join("")}
      </div>
      <div class="row" style="margin-top:8px"><b>Physical Cash Total</b><b id="dnTot" style="color:var(--ac);font-size:18px">₹0</b></div>
      <button class="pri sm" onclick="saveDrawerCount()">Save Closing Count</button>
    </div>
  </div>`;
}

window.clockInStaff = function(){
  const name=$("#shNm").value.trim()||activeName, tips=+$("#shTip").value||0;
  S.shifts=S.shifts||[];S.shifts.push({name, role:myRole, in:Date.now(), out:0, tips});
  save(); render(); toast(name+" clocked in");
};
window.clockOutStaff = function(idx){
  const s=S.shifts[idx]; if(!s) return;
  s.out=Date.now(); s.tips=+(prompt("Total tips collected ₹:", s.tips||0))||0;
  save(); render(); toast("Clocked out");
};
window.calcDrawerSum = function(){
  let tot=0; [500,200,100,50,20,10].forEach(d=>{tot+=d*(+$("#dn_"+d)?.value||0);});
  if($("#dnTot"))$("#dnTot").textContent="₹"+tot;
  return tot;
};
window.saveDrawerCount = function(){
  const tot = calcDrawerSum();
  S.lastDrawerCount = {t:Date.now(), tot, by:activeName};
  logAudit("drawer_count",{tot});
  save(); toast("Drawer count ₹"+tot+" saved");
};

function opsDelivHtml(){
  const zones = S.cfg.deliveryZones || [], riders = S.riders || [];
  return `<div class="g2">
    <div class="card"><b>Delivery Zones & Fees</b>
      <div class="tbs" style="margin-top:8px">
        <input id="dzNm" placeholder="Zone (e.g. Malviya Nagar 3km)" style="flex:1">
        <input id="dzFee" type="number" placeholder="Fee ₹" style="width:85px">
        <button class="pri sm" onclick="addDelZone()">+ Add</button>
      </div>
      ${zones.map((z,i)=>`<div class="row"><span><b>${esc(z.n)}</b> · ₹${z.fee}</span><button class="sm wr" onclick="S.cfg.deliveryZones.splice(${i},1);save();render()">Del</button></div>`).join("")||`<p class="mu">No zones defined.</p>`}
    </div>

    <div class="card"><b>Own Delivery Boys / Riders</b>
      <div class="tbs" style="margin-top:8px">
        <input id="rdNm" placeholder="Rider Name" style="flex:1">
        <input id="rdPh" placeholder="Mobile" maxlength="10" style="width:120px">
        <button class="pri sm" onclick="addRider()">+ Add</button>
      </div>
      ${riders.map((r,i)=>`<div class="row"><span><b>${esc(r.n)}</b> (${esc(r.ph)}) · COD Hold: ₹${r.cod||0}</span>
        <div class="tbs" style="margin:0">
          ${r.cod>0?`<button class="sm ok" onclick="S.riders[${i}].cod=0;save();render()">Settle COD</button>`:""}
          <button class="sm wr" onclick="S.riders.splice(${i},1);save();render()">Del</button>
        </div>
      </div>`).join("")||`<p class="mu">No delivery riders added.</p>`}
    </div>
  </div>`;
}
window.addDelZone = function(){
  const n=$("#dzNm").value.trim(), fee=+$("#dzFee").value||0; if(!n) return;
  S.cfg.deliveryZones=S.cfg.deliveryZones||[]; S.cfg.deliveryZones.push({n,fee}); save(); render();
};
window.addRider = function(){
  const n=$("#rdNm").value.trim(), ph=$("#rdPh").value.replace(/\D/g,""); if(!n) return;
  S.riders=S.riders||[]; S.riders.push({n,ph,cod:0}); save(); render();
};

function opsEngHtml(){
  const B = S.bills.filter(b=>!b.voided);
  const sold = {}; B.forEach(b=>b.items.forEach(i=>{const k=i.n.split(" (")[0]; sold[k]=(sold[k]||0)+i.q;}));
  const avgSold = S.menu.length ? Object.values(sold).reduce((a,b)=>a+b,0)/S.menu.length : 0;

  // 7-day sales forecast
  const last7 = Array(7).fill(0);
  const now = Date.now();
  B.forEach(b=>{const d=Math.floor((now-b.t)/864e5); if(d>=0&&d<7) last7[d]+=b.tot;});
  const activeDays = last7.filter(x=>x>0).length || 1;
  const forecast = Math.round(last7.reduce((a,b)=>a+b,0)/activeDays);

  return `<div class="g2">
    <div class="card tw"><b>Menu Engineering (Stars vs Dogs)</b>
      <p class="mu">Classifies dishes by Popularity vs Profit Margin.</p>
      <table><tr><th>Dish</th><th>Sold</th><th>Margin ₹</th><th>Class</th></tr>
      ${S.menu.map(m=>{
        const q = sold[m.n]||0;
        let fc=0; (m.bom||[]).forEach(b=>{const st=S.stock.find(x=>x.n===b.n);if(st)fc+=(+st.cost||0)*(+b.q||0);});
        const margin = R(m.p - fc), pop = q >= avgSold, highM = margin >= (m.p*0.6);
        const cls = pop&&highM ? ["Star ★","okt"] : pop ? ["Plowhorse","wnt"] : highM ? ["Puzzle",""] : ["Dog","low"];
        return `<tr><td>${esc(m.n)}</td><td>${q}</td><td>₹${margin}</td><td><span class="tag ${cls[1]}">${cls[0]}</span></td></tr>`;
      }).join("")}
      </table>
    </div>

    <div class="card"><b>7-Day Sales Forecast</b>
      <div class="stats" style="margin-top:10px">
        <div class="card"><span class="mu">Projected Tomorrow</span><b>₹${forecast}</b></div>
        <div class="card"><span class="mu">7-Day Total</span><b>₹${R(last7.reduce((a,b)=>a+b,0))}</b></div>
      </div>
      <div class="bar" style="margin-top:12px">${[...last7].reverse().map(v=>`<i style="height:${v/Math.max(1,...last7)*100}%" title="₹${v}"></i>`).join("")}</div>
      <p class="mu" style="margin-top:6px">Based on your trailing 7-day moving average.</p>
    </div>
  </div>`;
}

function opsFraudHtml(){
  const td = new Date().toDateString();
  const tdVoids = S.bills.filter(b=>b.voided && new Date(b.t).toDateString()===td);
  const highDisc = S.bills.filter(b=>!b.voided && b.disc > (b.sub*0.25) && new Date(b.t).toDateString()===td);
  const alerts = [];
  if(tdVoids.length>=2) alerts.push(`High Voids Today: ${tdVoids.length} bills voided.`);
  if(highDisc.length) alerts.push(`High Discounts (>25%): ${highDisc.length} bills today.`);
  if(S.lastDrawerCount){
    const cashSales = S.bills.filter(b=>!b.voided && b.pay==="Cash" && new Date(b.t).toDateString()===td).reduce((a,b)=>a+b.tot,0);
    const diff = R(S.lastDrawerCount.tot - ((+S.cfg.openCash||0)+cashSales));
    if(Math.abs(diff)>50) alerts.push(`Cash Drawer Variance: ₹${diff}`);
  }
  const aud = S.audit || [];

  return `<div class="g2">
    <div class="card"><b>Fraud & Leakage Alerts</b>
      ${alerts.map(a=>`<div class="row"><span style="color:var(--wr)">⚠ ${esc(a)}</span></div>`).join("")||`<p style="color:var(--ok)">✓ No suspicious activity or cash leakage detected today.</p>`}
    </div>
    <div class="card tw"><b>Audit Log (${aud.length})</b>
      <table style="margin-top:8px"><tr><th>Time</th><th>Staff</th><th>Action</th></tr>
      ${aud.slice(-20).reverse().map(a=>`<tr><td>${new Date(a.t).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</td><td>${esc(a.by)} (${esc(a.role)})</td><td>${esc(a.action)}</td></tr>`).join("")||`<tr><td colspan="3" class="mu">No events logged yet.</td></tr>`}
      </table>
    </div>
  </div>`;
}

function opsImportHtml(){
  return `<div class="g2">
    <div class="card"><b>Import Menu from Petpooja / CSV</b>
      <p class="mu">Paste CSV rows (<code>DishName, Category, Price, GST%</code>) or upload a CSV file:</p>
      <label class="tag" style="padding:8px;cursor:pointer;display:inline-block;margin:6px 0">Upload CSV File
        <input type="file" accept=".csv,.txt" style="display:none" onchange="handleCsvImport(this)">
      </label>
      <textarea id="csvMenuIn" rows="4" placeholder="Paneer Butter Masala, Mains, 260, 5&#10;Garlic Naan, Breads, 60, 5"></textarea>
      <button class="pri sm" style="margin-top:8px" onclick="importMenuCsvText($('#csvMenuIn').value)">Import CSV to Menu</button>
    </div>

    <div class="card"><b>Webhooks & Owner Daily Summary</b>
      <p class="mu">Trigger external webhook on every paid bill, or set Owner WhatsApp number:</p>
      <input id="whUrl" placeholder="Webhook URL (https://...)" value="${esc(S.cfg.webhookUrl||"")}" style="margin:6px 0">
      <input id="owPh" placeholder="Owner 10-digit WhatsApp" maxlength="10" value="${esc(S.cfg.ownerPh||"")}" style="margin:6px 0">
      <button class="pri sm" onclick="S.cfg.webhookUrl=$('#whUrl').value.trim();S.cfg.ownerPh=$('#owPh').value.replace(/\\D/g,'');save();toast('Saved')">Save Integrations</button>
    </div>
  </div>`;
}

window.handleCsvImport = async function(inp){
  const f=inp.files&&inp.files[0]; if(!f) return;
  importMenuCsvText(await f.text());
};
window.importMenuCsvText = function(txt){
  const lines = String(txt||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  let nextId = S.menu.reduce((mx,x)=>Math.max(mx,x.id),0)+1, added=0;
  lines.forEach(line=>{
    const cols = line.split(",").map(x=>x.replace(/^"|"$/g,"").trim());
    if(cols.length>=2){
      const p = parseFloat(cols.find(c=>/^\d+(\.\d+)?$/.test(c)));
      if(p>0 && !/^price$/i.test(cols[0])){
        S.menu.push({id:nextId++, n:cols[0], c:cols[1]||"Mains", p, g:cols[3]?+cols[3]:null, s:"", u:0, v:[], a:[], oos:false});
        added++;
      }
    }
  });
  save(); render(); toast("Imported "+added+" dishes from CSV!");
};

window.sendOwnerSummaryWA = function(){
  const td=new Date().toDateString(), B=S.bills.filter(b=>!b.voided&&new Date(b.t).toDateString()===td);
  const tot=B.reduce((a,b)=>a+b.tot,0);
  const cash=B.filter(b=>b.pay==="Cash").reduce((a,b)=>a+b.tot,0), upi=B.filter(b=>b.pay==="UPI").reduce((a,b)=>a+b.tot,0);
  const msgText=`*${S.cfg.rName} Daily Report* | Bills: ${B.length} | Sales: ₹${tot} (Cash ₹${cash}, UPI ₹${upi})`;
  const ph = S.cfg.ownerPh || "";
  if(ph.length===10) sendWA(ph, msgText);
  else window.open("https://wa.me/?text="+encodeURIComponent(msgText),"_blank");
};

window.pushMenuToOutlet = async function(targetId){
  if(trueRole!=="superadmin"||!sb) return;
  const r = await sb.from("app_state").select("data").eq("id",targetId).maybeSingle();
  const targetData = normState(r.data&&r.data.data ? r.data.data : null);
  targetData.menu = JSON.parse(JSON.stringify(S.menu));
  const up = await sb.from("app_state").upsert({id:targetId, data:targetData});
  if(up.error) return toast(up.error.message);
  toast("Central Menu pushed to "+targetId+"!");
};
