// DineLoop ERP: BOM Recipes, Suppliers, PO/GRN, Wastage, Stock Count, Expiry, Food Cost, GSTR-1, Tally, Expenses, P&L & Backups (Batch 4)
window.erpTab = window.erpTab || "stock";

window.vStock = function(){
  const tabs = [
    ["stock","Raw Materials & Expiry"],
    ["bom","Recipes (BOM) & Food Cost"],
    ["po","Suppliers, PO & GRN"],
    ["waste","Wastage & Stock Count"],
    ["acc","GST (GSTR-1), Expenses & P&L"]
  ];
  let body = "";
  if(window.erpTab==="stock") body = erpStockHtml();
  else if(window.erpTab==="bom") body = erpBomHtml();
  else if(window.erpTab==="po") body = erpPoHtml();
  else if(window.erpTab==="waste") body = erpWasteHtml();
  else body = erpAccHtml();

  return `<div class="card" style="padding:10px 14px">
    <div class="tbs" style="margin:0">
      ${tabs.map(([k,l])=>`<button class="sm ${window.erpTab===k?"on":""}" onclick="window.erpTab='${k}';render()">${l}</button>`).join("")}
      <button class="sm" style="margin-left:auto" onclick="exportBackupJson()">Backup JSON</button>
      <label class="tag" style="cursor:pointer;padding:5px 9px">Restore JSON<input type="file" accept=".json" style="display:none" onchange="importBackupJson(this)"></label>
    </div>
  </div>` + body;
};

function erpStockHtml(){
  const soonMs = Date.now() + 7*864e5;
  return `<div class="card tw">
    <div class="row" style="border:0;padding:0"><b>Inventory Stock (${S.stock.length})</b>
      <div class="tbs" style="margin:0">
        <button class="pri sm" onclick="openStockForm()">+ Add Stock Item</button>
        <button class="sm" onclick="dlCsv('stock')">Export CSV</button>
      </div>
    </div>
    <table style="margin-top:8px">
      <tr><th>Item</th><th>In Stock</th><th>Cost/Unit</th><th>Min</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
      ${S.stock.map((s,i)=>{
        const expMs = s.exp ? new Date(s.exp).getTime() : 0;
        const expSoon = expMs && expMs <= soonMs;
        return `<tr>
          <td><b>${esc(s.n)}</b>${s.sup?`<br><small class="mu">Sup: ${esc(s.sup)}</small>`:""}</td>
          <td>${s.q} ${esc(s.u)}</td>
          <td>₹${R(s.cost||0)}</td>
          <td>${s.min}</td>
          <td>${s.exp?`<span class="tag ${expSoon?"low":"okt"}">${esc(s.exp)}</span>`:"—"}</td>
          <td>${s.q<=s.min?`<span class="tag low">Low</span>`:`<span class="tag okt">OK</span>`}</td>
          <td>
            <button class="sm" onclick="S.stock[${i}].q=R(Math.max(0,S.stock[${i}].q-1));save();render()">−1</button>
            <button class="sm" onclick="S.stock[${i}].q=R(S.stock[${i}].q+5);save();render()">+5</button>
            <button class="sm" onclick="openStockForm(${i})">Edit</button>
            ${s.q<=s.min&&s.sup?`<button class="sm ok" onclick="autoReorderWA(${i})">Reorder WA</button>`:""}
            <button class="sm wr" onclick="S.stock.splice(${i},1);save();render()">Del</button>
          </td>
        </tr>`;
      }).join("")||`<tr><td colspan="7" class="mu">No stock items yet. Click "+ Add Stock Item".</td></tr>`}
    </table>
  </div>`;
}

window.openStockForm = function(idx=null){
  const s = idx!==null ? S.stock[idx] : {n:"",q:0,min:5,u:"kg",cost:0,exp:"",sup:""};
  showMdl(`<b>${idx!==null?"Edit Stock":"Add Stock Item"}</b>
    <div style="margin:10px 0;display:grid;gap:8px">
      <input id="sn" placeholder="Item Name (e.g. Milk, Batter, Paneer)" value="${esc(s.n)}">
      <div class="g3">
        <div><label class="mu">Qty</label><input id="sq" type="number" step="0.01" value="${s.q}"></div>
        <div><label class="mu">Min Alert</label><input id="sm" type="number" step="0.01" value="${s.min}"></div>
        <div><label class="mu">Unit</label><input id="su" value="${esc(s.u)}"></div>
      </div>
      <div class="g3">
        <div><label class="mu">Cost / Unit ₹</label><input id="scost" type="number" step="0.01" value="${s.cost||0}"></div>
        <div><label class="mu">Expiry Date</label><input id="sexp" type="date" value="${esc(s.exp||"")}"></div>
        <div><label class="mu">Supplier Name</label><input id="ssup" value="${esc(s.sup||"")}"></div>
      </div>
    </div>
    <div class="tbs"><button class="pri" onclick="saveStock(${idx===null?"null":idx})">Save</button><button onclick="closeMdl()">Cancel</button></div>`);
};

window.saveStock = function(idx){
  const n = $("#sn").value.trim(); if(!n) return toast("Name required");
  const obj = {n, q:+$("#sq").value||0, min:+$("#sm").value||0, u:$("#su").value.trim()||"pcs", cost:+$("#scost").value||0, exp:$("#sexp").value, sup:$("#ssup").value.trim()};
  if(idx!==null) S.stock[idx]=obj; else S.stock.push(obj);
  save(); closeMdl(); render(); toast("Stock saved");
};

window.autoReorderWA = function(idx){
  const s = S.stock[idx]; if(!s) return;
  const sup = (S.suppliers||[]).find(x=>x.name.toLowerCase()===String(s.sup||"").toLowerCase());
  const qty = Math.max(10, (s.min||5)*2);
  const msgText = `PO Reorder from ${S.cfg.rName}: Please supply ${qty} ${s.u} of ${s.n}.`;
  if(sup&&sup.ph&&sup.ph.length===10) sendWA(sup.ph, msgText);
  else window.open("https://wa.me/?text="+encodeURIComponent(msgText),"_blank");
};

function erpBomHtml(){
  return `<div class="card tw">
    <b>Dish Recipes (BOM) & Food Cost %</b>
    <p class="mu">Define ingredients per dish. All BOM ingredients auto-deduct on billing and compute real food margin!</p>
    <table style="margin-top:8px">
      <tr><th>Dish</th><th>Price</th><th>BOM Ingredients</th><th>Food Cost ₹</th><th>Food Cost %</th><th>Margin</th><th></th></tr>
      ${S.menu.map(m=>{
        const bom = m.bom || [];
        let fc = 0;
        bom.forEach(b=>{const st=S.stock.find(x=>x.n===b.n); if(st) fc += (+st.cost||0)*(+b.q||0);});
        if(!bom.length && m.s){const st=S.stock.find(x=>x.n===m.s); if(st) fc=(+st.cost||0)*(+m.u||0);}
        fc = R(fc);
        const pct = m.p>0 ? R((fc/m.p)*100) : 0;
        const margin = R(m.p - fc);
        return `<tr>
          <td><b>${esc(m.n)}</b></td><td>₹${m.p}</td>
          <td>${bom.length?bom.map(b=>`${esc(b.n)} (${b.q})`).join(", "):(m.s?`${esc(m.s)} (${m.u})`:`<span class="mu">None</span>`)}</td>
          <td>₹${fc}</td>
          <td><span class="tag ${pct>40?"low":"okt"}">${pct}%</span></td>
          <td>₹${margin}</td>
          <td><button class="sm" onclick="openBomMdl(${m.id})">Edit BOM</button></td>
        </tr>`;
      }).join("")}
    </table>
  </div>`;
}

window.openBomMdl = function(id){
  const m = M(id); if(!m) return;
  const str = (m.bom||[]).map(b=>`${b.n}:${b.q}`).join(", ");
  showMdl(`<b>Recipe BOM · ${esc(m.n)}</b>
    <p class="mu">Format: <code>StockItemName:QtyPerDish</code> separated by commas.<br>Example: <code>Batter:0.15, Potato:0.05, Oil:0.02</code></p>
    <textarea id="bomTxt" rows="3" style="margin:8px 0">${esc(str)}</textarea>
    <div class="tbs"><button class="pri" onclick="saveBom(${id})">Save Recipe</button><button onclick="closeMdl()">Cancel</button></div>`);
};
window.saveBom = function(id){
  const m = M(id); if(!m) return;
  m.bom = $("#bomTxt").value.split(",").map(x=>x.trim()).filter(Boolean).map(x=>{const [n,q]=x.split(":");return{n:(n||"").trim(),q:+q||0};}).filter(x=>x.n&&x.q>0);
  save(); closeMdl(); render(); toast("BOM recipe saved");
};

function erpPoHtml(){
  const sups = S.suppliers || [], pos = S.pos || [];
  return `<div class="g2">
    <div class="card"><b>Suppliers & Vendor Ledger (${sups.length})</b>
      <div class="tbs" style="margin-top:8px">
        <input id="supNm" placeholder="Supplier Name" style="flex:1">
        <input id="supPh" placeholder="Mobile" maxlength="10" style="width:120px">
        <button class="pri sm" onclick="addSupplier()">+ Add</button>
      </div>
      ${sups.map((sp,i)=>`<div class="row">
        <span><b>${esc(sp.name)}</b> (${esc(sp.ph||"—")}) · Due: <b style="color:var(--wr)">₹${R(sp.due||0)}</b></span>
        <div class="tbs" style="margin:0">
          ${sp.due>0?`<button class="sm ok" onclick="payVendor(${i})">Pay</button>`:""}
          <button class="sm wr" onclick="S.suppliers.splice(${i},1);save();render()">Del</button>
        </div>
      </div>`).join("")||`<p class="mu">No suppliers yet.</p>`}
    </div>

    <div class="card"><b>Purchase Orders (PO) & GRN</b>
      <div class="g2" style="margin-top:8px">
        <input id="poSup" placeholder="Supplier Name">
        <input id="poItem" placeholder="Stock Item Name">
      </div>
      <div class="g3" style="margin-top:6px">
        <input id="poQty" type="number" step="0.01" placeholder="Qty">
        <input id="poRate" type="number" step="0.01" placeholder="Total Cost ₹">
        <button class="pri sm" onclick="createPo()">+ Create PO</button>
      </div>
      <div style="margin-top:10px">
      ${pos.slice().reverse().map((p,ri)=>{
        const idx = pos.length-1-ri;
        return `<div class="row">
          <span><b>PO #${p.id}</b> · ${esc(p.sup)} → ${p.qty} ${esc(p.item)} (₹${p.tot})</span>
          ${p.st==="received"?`<span class="tag okt">GRN ✓</span>`:`<button class="sm ok" onclick="receiveGrn(${idx})">Receive GRN</button>`}
        </div>`;
      }).join("")||`<p class="mu">No purchase orders.</p>`}
      </div>
    </div>
  </div>`;
}

window.addSupplier = function(){
  const name = $("#supNm").value.trim(); if(!name) return toast("Name required");
  S.suppliers = S.suppliers || [];
  S.suppliers.push({name, ph:$("#supPh").value.replace(/\D/g,""), due:0});
  save(); render();
};
window.payVendor = function(i){
  const sp = S.suppliers[i]; if(!sp) return;
  const amt = +prompt("Amount paid to "+sp.name+" (Due ₹"+sp.due+"):", sp.due)||0;
  if(amt<=0) return;
  sp.due = R(Math.max(0, (sp.due||0)-amt));
  S.expenses = S.expenses || [];
  S.expenses.push({t:Date.now(), cat:"Vendor Payment", note:sp.name, amt});
  save(); render(); toast("Vendor payment logged");
};
window.createPo = function(){
  const sup=$("#poSup").value.trim(), item=$("#poItem").value.trim(), qty=+$("#poQty").value||0, tot=+$("#poRate").value||0;
  if(!sup||!item||qty<=0) return toast("Fill Supplier, Item & Qty");
  S.pos = S.pos || [];
  S.pos.push({id:S.pos.length+1, sup, item, qty, tot, st:"ordered", t:Date.now()});
  save(); render(); toast("PO created");
};
window.receiveGrn = function(idx){
  const p = S.pos[idx]; if(!p||p.st==="received") return;
  p.st = "received"; p.grnAt = Date.now();
  let st = S.stock.find(x=>x.n.toLowerCase()===p.item.toLowerCase());
  const unitCost = p.qty>0 ? R(p.tot/p.qty) : 0;
  if(st){ st.q = R(st.q + p.qty); if(unitCost) st.cost = unitCost; }
  else S.stock.push({n:p.item, q:p.qty, min:5, u:"kg", cost:unitCost, sup:p.sup});
  const sup = (S.suppliers||[]).find(x=>x.name.toLowerCase()===p.sup.toLowerCase());
  if(sup) sup.due = R((sup.due||0) + p.tot);
  save(); render(); toast("GRN received & stock updated!");
};

function erpWasteHtml(){
  const ws = S.wastage || [];
  return `<div class="g2">
    <div class="card"><b>Log Spoilage / Wastage</b>
      <div class="g2" style="margin-top:8px">
        <input id="wsItem" placeholder="Stock Item Name">
        <input id="wsQty" type="number" step="0.01" placeholder="Wasted Qty">
      </div>
      <input id="wsReason" placeholder="Reason (Expired, Burnt, Spilled)" style="margin:8px 0">
      <button class="wr sm" onclick="logWastage()">Deduct & Log Wastage</button>
      <div style="margin-top:10px">
        ${ws.slice(-10).reverse().map(w=>`<div class="row"><span>${esc(w.item)} (−${w.qty}) · ${esc(w.reason)}</span><small class="mu">${new Date(w.t).toLocaleDateString("en-IN")}</small></div>`).join("")}
      </div>
    </div>

    <div class="card"><b>Physical Stock Count Reconciliation</b>
      <p class="mu">Enter actual physical stock counted to adjust variance:</p>
      ${S.stock.map((s,i)=>`<div class="row">
        <span>${esc(s.n)} (Sys: ${s.q} ${esc(s.u)})</span>
        <span style="display:flex;gap:5px;width:150px">
          <input id="pc_${i}" type="number" step="0.01" value="${s.q}">
          <button class="sm ok" onclick="applyStockCount(${i})">Set</button>
        </span>
      </div>`).join("")||`<p class="mu">No stock items.</p>`}
    </div>
  </div>`;
}

window.logWastage = function(){
  const item=$("#wsItem").value.trim(), qty=+$("#wsQty").value||0, reason=$("#wsReason").value.trim()||"Spoilage";
  if(!item||qty<=0) return toast("Enter item & qty");
  const st = S.stock.find(x=>x.n.toLowerCase()===item.toLowerCase());
  if(st) st.q = R(Math.max(0, st.q-qty));
  S.wastage = S.wastage || [];
  S.wastage.push({item, qty, reason, cost:st?R((st.cost||0)*qty):0, t:Date.now()});
  save(); render(); toast("Wastage logged");
};
window.applyStockCount = function(i){
  const val = +$("#pc_"+i).value; if(isNaN(val)||val<0) return;
  S.stock[i].q = R(val); save(); render(); toast("Physical count updated");
};

function erpAccHtml(){
  const B = S.bills.filter(b=>!b.voided);
  const netSales = R(B.reduce((a,b)=>a+b.tot,0));
  const gstTot = R(B.reduce((a,b)=>a+(b.tax||0),0));
  const exps = S.expenses || [];
  const expTot = R(exps.reduce((a,e)=>a+(+e.amt||0),0));
  const poTot = R((S.pos||[]).filter(p=>p.st==="received").reduce((a,p)=>a+(+p.tot||0),0));
  const pnl = R(netSales - gstTot - expTot - poTot);
  const byRate = {};
  B.forEach(b=>{
    const rate = b.sub>0 && b.tax>0 ? Math.round((b.tax/Math.max(1,b.sub-(b.disc||0)))*100) : 0;
    byRate[rate] = byRate[rate] || {taxable:0, cgst:0, sgst:0};
    byRate[rate].taxable = R(byRate[rate].taxable + Math.max(0,(b.sub||0)-(b.disc||0)));
    byRate[rate].cgst = R(byRate[rate].cgst + (b.cgst||(b.tax||0)/2));
    byRate[rate].sgst = R(byRate[rate].sgst + (b.sgst||(b.tax||0)/2));
  });

  return `<div class="g2">
    <div class="card tw"><b>GSTR-1 Rate-Wise Summary & Tally Export</b>
      <div class="tbs" style="margin-top:8px">
        <button class="sm pri" onclick="exportTallyXml()">Export Tally XML</button>
        <button class="sm" onclick="dlCsv('bills')">Bills CSV</button>
      </div>
      <table><tr><th>GST %</th><th>Taxable ₹</th><th>CGST ₹</th><th>SGST ₹</th></tr>
      ${Object.entries(byRate).map(([r,v])=>`<tr><td>${r}%</td><td>₹${v.taxable}</td><td>₹${v.cgst}</td><td>₹${v.sgst}</td></tr>`).join("")||`<tr><td colspan="4" class="mu">No sales yet.</td></tr>`}
      </table>
    </div>

    <div class="card"><b>Expenses / Petty Cash & Simple P&L</b>
      <div class="tbs" style="margin-top:8px">
        <input id="exCat" placeholder="Category (Milk, Gas, Staff)" style="flex:1">
        <input id="exAmt" type="number" placeholder="₹" style="width:90px">
        <button class="pri sm" onclick="addExpense()">+ Add</button>
      </div>
      <div class="row"><span>Sales (ex-GST)</span><b>₹${R(netSales-gstTot)}</b></div>
      <div class="row"><span>Purchases (GRN)</span><span style="color:var(--wr)">−₹${poTot}</span></div>
      <div class="row"><span>Petty Cash / Expenses</span><span style="color:var(--wr)">−₹${expTot}</span></div>
      <div class="row"><b>Estimated Net Profit</b><b style="color:${pnl>=0?"var(--ok)":"var(--wr)"};font-size:18px">₹${pnl}</b></div>
      ${exps.slice(-6).reverse().map((e,ri)=>`<div class="row"><span>${esc(e.cat)} ${e.note?"("+esc(e.note)+")":""}</span><span>₹${e.amt}</span></div>`).join("")}
    </div>
  </div>`;
}

window.addExpense = function(){
  const cat=$("#exCat").value.trim(), amt=+$("#exAmt").value||0;
  if(!cat||amt<=0) return toast("Enter expense & amount");
  S.expenses = S.expenses || [];
  S.expenses.push({t:Date.now(), cat, amt});
  save(); render(); toast("Expense saved");
};
window.exportTallyXml = function(){
  const B = S.bills.filter(b=>!b.voided);
  const xml = `<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC><REQUESTDATA>`+
    B.map(b=>`<TALLYMESSAGE><VOUCHER VCHTYPE="Sales" ACTION="Create"><DATE>${new Date(b.t).toISOString().slice(0,10).replace(/-/g,"")}</DATE><VOUCHERNUMBER>${esc(b.invNo||b.no)}</VOUCHERNUMBER><PARTYLEDGERNAME>${esc(b.pay||"Cash")}</PARTYLEDGERNAME><AMOUNT>${b.tot}</AMOUNT></VOUCHER></TALLYMESSAGE>`).join("")+
    `</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>`;
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([xml],{type:"application/xml"}));
  a.download=`dineloop-${activeOutlet}-tally.xml`;a.click();
};
window.exportBackupJson = function(){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));
  a.download=`dineloop-backup-${activeOutlet}-${new Date().toISOString().slice(0,10)}.json`;a.click();
};
window.importBackupJson = async function(inp){
  const f=inp.files&&inp.files[0];if(!f)return;
  if(!confirm("Restore full state from this backup JSON? This overwrites current outlet data."))return;
  try{const obj=JSON.parse(await f.text());S=normState(obj);save();render();toast("Backup restored!");}
  catch(e){toast("Invalid JSON backup");}
};
