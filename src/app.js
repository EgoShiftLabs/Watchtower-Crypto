import {DOMAINS,createSignal,creatorReference,createExport,esc,httpsUrl,tabSummary} from "./core.js";
import {load,save,STORAGE_KEY} from "./state.js";

let state=load(),domainFilter="All";
const main=document.querySelector("#main"),nav=document.querySelector("#nav"),title=document.querySelector("#pageTitle"),toast=document.querySelector("#toast");
let toastTimer;
const navPages=[["home","Intelligence Hub"],["signals","Signal Journal"],["creators","Creator / KOL Watch"],["contracts","Interoperability"]];
const current=()=>{const p=location.hash.replace(/^#\/?/,"");return navPages.some(x=>x[0]===p)?p:"home";};
const shortDate=x=>Number.isFinite(Date.parse(x))?new Date(x).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"Unknown date";
const sourceLink=(url,label="Inspect source")=>httpsUrl(url)?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>':"Invalid source";
const chip=(x)=>'<span class="chip">'+esc(x)+'</span>';
const counter=(label,value,sub)=>'<div class="counter"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong><small>'+esc(sub)+'</small></div>';
function notice(msg){toast.textContent=msg;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,5500);}
function persist(msg){if(!save(state)){state=load();notice("Could not save. Check browser storage and record length.");render();return;}render();notice(msg);}
function download(name,obj){
 const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)+"\n"],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function navRender(page){
 nav.innerHTML=navPages.map(([key,label],i)=>'<a href="#/'+key+'" class="nav-link '+(key===page?"active":"")+'"'+(key===page?' aria-current="page"':"")+'><span class="nav-icon">'+["⌂","⌁","◎","▣"][i]+'</span>'+esc(label)+'</a>').join("");
 title.textContent=navPages.find(x=>x[0]===page)[1].toUpperCase();
}
const researchPrompts=[
 ["01 / ORIGINAL IP","Music-native movements","How many independent releases and real returning participants support the claim?","Measure published output, ownership and repeat participation."],
 ["02 / CULTURAL TECHNOLOGY","Artist-built utilities","Does a tool work for creators even if the attached token has no price appreciation?","Test a usable demo, source provenance and user retention."],
 ["03 / COMMUNITY","Long-form contribution","Can communities retain engaged builders through practical education or collective projects?","Check completion evidence, repeated contribution and opportunity cost."]
];
function home(){
 const counts=tabSummary(state.signals);
 return '<section class="hero"><p class="eyebrow">WATCHTOWER / CULTURAL SIGNAL INTELLIGENCE</p><h1>Study the signal.<br><em>Challenge the noise.</em></h1><p>Do not mistake attention for adoption. Collect evidence, challenge the narrative, and decide what deserves to be built.</p><div class="hero-actions"><a class="button primary" href="#/signals">Research an opportunity ↗</a><a class="button ghost" href="#/creators">Track public creators ↗</a></div><span class="hero-art" aria-hidden="true">W.</span></section>'+
 '<div class="warning"><strong>Manual research preview:</strong> No live Pump.fun/DEX prices, trending feed, wallet analysis, KOL scraping, or verified endorsements. Everything below is your own local research or an explicitly marked question to investigate.</div>'+
 '<div class="metric-grid">'+counter("SOURCE-LINKED SIGNALS",state.signals.length,"User-entered, not independently verified")+
 counter("PUBLIC CREATOR NOTES",state.creators.length,"Manual links, not social monitoring")+
 counter("DOMAINS COVERED",Object.values(counts).filter(n=>n>0).length,"Based on your own saved notes")+'</div>'+
 '<div class="section-title"><div><p class="eyebrow">CULTURAL IMAGINATION RADAR</p><h2>Three questions worth investigating</h2></div><span class="subtle">RESEARCH STARTERS / NOT LIVE TREND REPORTS</span></div>'+
 '<div class="prompt-grid">'+researchPrompts.map(x=>'<article class="panel prompt"><span class="mini">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p><div class="line"></div><p><strong>Evidence check:</strong> '+x[3]+'</p></article>').join("")+'</div>'+
 '<section class="callout"><div><p class="eyebrow">IDEA → EVIDENCE → BUILD</p><h2>Original culture is the opportunity.</h2><p>Watchtower Crypto is an independent research workspace. It helps prepare evidence-linked proposals for future opt-in collaboration with BAGZ Forge. A source URL is not proof that a claim is true.</p></div><a class="button ghost" href="#/contracts">Review integration rules ↗</a></section>';
}
function signals(){
 const signals=state.signals.filter(s=>domainFilter==="All"||s.domain===domainFilter);
 return '<div class="page-head"><div><p class="eyebrow">01 / EVIDENCE JOURNAL</p><h1>Map your signals.</h1><p>Record the claim, original source, competing explanation and why a possible cultural meta matters.</p></div><span class="chip">LOCAL / UNVERIFIED</span></div>'+
 '<div class="warning"><strong>Claims are not facts:</strong> Every entry is manually entered. There is no live API connection. Use public HTTPS sources only and never submit keys, passwords, private addresses or personal financial information.</div>'+
 '<div class="two-col"><section class="panel"><h2>Create a research observation</h2><p>Well-framed opportunities have a traceable source and a reason they might be wrong.</p><form id="signalForm" class="form-stack" autocomplete="off">'+
 '<label>Research title<input required name="title" maxlength="130" minlength="5" placeholder="A community, narrative or builder opportunity"></label>'+
 '<label>Research domain<select name="domain">'+DOMAINS.map(d=>'<option value="'+esc(d)+'">'+esc(d)+'</option>').join("")+'</select></label>'+
 '<label>Public source link<input required name="sourceUrl" type="url" maxlength="600" placeholder="https://original-source.example"></label>'+
 '<label>What did you actually observe?<textarea required name="observation" maxlength="1500" minlength="20" rows="5" placeholder="Describe the actors, evidence, timestamp and specific behavior."></textarea></label>'+
 '<label>What could invalidate your interpretation?<textarea required name="risk" maxlength="700" minlength="10" rows="4" placeholder="Alternative explanation, copied IP, manipulation, selection bias..."></textarea></label>'+
 '<button type="submit" class="button primary">Save sourced observation ↗</button></form></section>'+
 '<section class="panel"><div class="row between"><div><h2>Research register</h2><p>'+state.signals.length+' total local records</p></div><label class="filter-label">Filter<select id="domainFilter"><option value="All">All domains</option>'+DOMAINS.map(d=>'<option value="'+esc(d)+'"'+(domainFilter===d?" selected":"")+'>'+esc(d)+'</option>').join("")+'</select></label></div>'+
 (signals.length?'<div class="stack">'+signals.slice().reverse().map(s=>
 '<article class="note-card" data-signal-id="'+esc(s.id)+'"><div class="row between">'+chip(s.domain)+'<span class="subtle">'+esc(shortDate(s.at))+'</span></div><h3>'+esc(s.title)+'</h3><p>'+esc(s.observation)+'</p><div class="risk"><strong>Challenge:</strong> '+esc(s.risk)+'</div><div class="source">'+sourceLink(s.sourceUrl)+'</div><div class="actions">'+
 '<button type="button" class="button ghost small" data-action="export-signal" data-id="'+esc(s.id)+'">Export V1 opportunity JSON ↗</button><button type="button" class="button danger small" data-action="remove-signal" data-id="'+esc(s.id)+'">Delete local signal</button></div></article>').join("")+'</div>':emptyState("No matching research observations. Add your own public evidence above."))+
 '</section></div>';
}
function creatorPage(){
 return '<div class="page-head"><div><p class="eyebrow">02 / RESEARCH WATCHLIST</p><h1>Observe creators.<br><em>Question influence.</em></h1><p>A public KOL bookmark is a source to investigate, never a recommendation or an endorsement.</p></div><span class="chip">NO AUTOMATED SOCIAL FEED</span></div>'+
 '<div class="warning"><strong>Manual links only:</strong> No follower counts, engagement signals, automated wallet attribution, ranking, surveillance or creator affiliations are inferred by this prototype.</div>'+
 '<div class="two-col"><section class="panel"><h2>Add a public creator to research</h2><p>Specify what you want to verify about the creator or project, not what you assume.</p><form id="creatorForm" class="form-stack" autocomplete="off">'+
 '<label>Name or public handle<input name="handle" required maxlength="90" placeholder="@publicbuilder"></label>'+
 '<label>Public profile URL<input name="url" required maxlength="600" type="url" placeholder="https://..."></label>'+
 '<label>Research objective<textarea name="note" maxlength="500" rows="4" placeholder="Claims to check, original work, conflicts, independent verification."></textarea></label>'+
 '<button type="submit" class="button primary">Save research reference ↗</button></form></section>'+
 '<section class="panel"><h2>Saved public profiles</h2><p>'+state.creators.length+' manually bookmarked research subjects.</p>'+
 (state.creators.length?'<div class="stack">'+state.creators.slice().reverse().map(c=>'<article class="note-card" data-creator-id="'+esc(c.id)+'"><div class="row between"><h3>'+esc(c.handle)+'</h3>'+chip("PUBLIC REFERENCE")+'</div><p>'+esc(c.note||"No notes yet. Research before drawing conclusions.")+'</p><p class="source">'+sourceLink(c.url,"Open public profile")+'</p><button type="button" class="button danger small" data-action="remove-creator" data-id="'+esc(c.id)+'">Remove from this device</button></article>').join("")+'</div>':emptyState("No creator bookmarks yet. Add a public profile for your own independent research."))+'</section></div>';
}
function contractPage(){
 const pinned="690ca6e66dc705ce6eb2b963932a873dea73342f";
 return '<div class="page-head"><div><p class="eyebrow">03 / VERSIONED HANDOFFS</p><h1>Research travels.<br><em>Permissions do not.</em></h1><p>Export a V1 opportunity record for future, user-authorized collaboration. No application receives data automatically.</p></div></div>'+
 '<div class="warning"><strong>No automatic BAGZ Forge submission:</strong> An exported JSON file is not an application, endorsement, launch recommendation, verified source, or credential. No cross-origin browser storage is shared.</div>'+
 '<div class="contract-grid"><article class="panel"><p class="eyebrow">CURRENT INTERCHANGE FORMAT</p><h2>bodybagz.opportunity.v1</h2><p>Each manually researched signal includes an ID, title, domain, observation, disconfirming risk, original source URL, entry timestamp and explicit unverified status.</p><code>bodybagz.opportunity.v1</code><p style="margin-top:17px"><a href="./contracts/opportunity.v1.schema.json" target="_blank" rel="noopener noreferrer">Open standalone schema ↗</a></p></article>'+
 '<article class="panel"><p class="eyebrow">IMMUTABLE COMPATIBILITY PIN</p><h2>Hub V0.2 baseline</h2><p>Contract source is pinned to an immutable source commit. Future breaking schema changes require a new envelope version and documented migration.</p><code>'+esc(pinned)+'</code><p style="margin-top:17px"><a href="https://github.com/EgoShiftLabs/BodyBagz-Ecosystem/tree/'+pinned+'/contracts" target="_blank" rel="noopener noreferrer">Inspect original contract source ↗</a></p></article></div>'+
 '<div class="section-title"><h2>Opt-in workflow</h2></div><div class="step-grid">'+[
 ["01","RESEARCH","You enter a claim with an HTTPS source and a reason it may be wrong."],
 ["02","EXPORT","You choose exactly which V1 opportunity you want to export."],
 ["03","REVIEW","You personally decide whether to use that data in another application."],
 ["04","BUILD","A separate Forge project must supply original work and accountable deliverables."]
 ].map(x=>'<article class="panel"><span class="eyebrow">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p></article>').join("")+'</div>';
}
function emptyState(msg){return '<div class="empty">'+esc(msg)+'</div>';}
function render(focus=false){
 const p=current();navRender(p);main.innerHTML=({home,signals,creators:creatorPage,contracts:contractPage})[p]();
 document.title=(p==="home"?"":navPages.find(x=>x[0]===p)[1]+" | ")+"Watchtower Crypto";
 if(focus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:"instant"});}
}
document.addEventListener("submit",e=>{
 const form=e.target;if(!(form instanceof HTMLFormElement)||!main.contains(form))return;
 e.preventDefault();const input=Object.fromEntries(new FormData(form).entries());
 if(form.id==="signalForm"){
  const entry=createSignal(input);if(entry.error){notice(entry.error);return;}
  if(state.signals.length>=120){notice("Research storage is full. Remove records before adding more.");return;}
  state.signals.push(entry.value);persist("Research observation saved in this browser, without external verification.");
 }
 if(form.id==="creatorForm"){
  const entry=creatorReference(input);if(entry.error){notice(entry.error);return;}
  if(state.creators.length>=80){notice("Creator bookmark storage is full.");return;}
  state.creators.push(entry.value);persist("Public research link saved locally. No social service was contacted.");
 }
});
document.addEventListener("change",e=>{
 if(e.target.id==="domainFilter"){domainFilter=String(e.target.value);render();}
});
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el||!main.contains(el))return;
 const id=el.dataset.id||"",action=el.dataset.action;
 if(action==="remove-signal"){
  state.signals=state.signals.filter(x=>x.id!==id);persist("Local signal deleted. No external data affected.");
 }
 if(action==="remove-creator"){
  state.creators=state.creators.filter(x=>x.id!==id);persist("Public creator bookmark deleted locally.");
 }
 if(action==="export-signal"){
  const x=state.signals.find(s=>s.id===id);if(!x)return;
  try{download("watchtower-opportunity-"+x.id+".json",createExport(x));notice("Unverified V1 opportunity exported for optional manual use.");}
  catch{notice("The selected research object is invalid.");}
 }
});
window.addEventListener("hashchange",()=>render(true));
render();
