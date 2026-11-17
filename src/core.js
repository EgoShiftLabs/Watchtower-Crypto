// Pure, offline-first cultural research objects.
export const SIGNAL_SCHEMA="bodybagz.opportunity.v1";
export const DOMAINS=["Culture","Music & IP","AI & tools","Web3 & utilities","Community","Other"];
export const trim=(x,max=1500)=>String(x??"").trim().slice(0,max);
export const httpsUrl=x=>{try{const u=new URL(String(x));return u.protocol==="https:"&&Boolean(u.hostname);}catch{return false;}};
export const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const id=(p="local")=>p+"-"+(typeof crypto!=="undefined"&&typeof crypto.randomUUID==="function"?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
export const now=()=>new Date().toISOString();
export function createSignal(input){
 const s={schema:SIGNAL_SCHEMA,id:id("signal"),title:trim(input.title,130),domain:trim(input.domain,60),
  observation:trim(input.observation,1500),risk:trim(input.risk,700),sourceUrl:trim(input.sourceUrl,600),
  at:now(),evidenceStatus:"user-supplied-unverified"};
 if(s.title.length<5||s.observation.length<20||s.risk.length<10||!httpsUrl(s.sourceUrl))return {error:"Enter a title (5+), observation (20+), risk (10+), and HTTPS evidence URL."};
 if(!DOMAINS.includes(s.domain))return {error:"Choose a valid research domain."};
 return {value:s};
}
export function validSignal(s){
 return Boolean(s&&s.schema===SIGNAL_SCHEMA&&typeof s.id==="string"&&s.id.length<=100&&
  typeof s.title==="string"&&s.title.length>=5&&s.title.length<=130&&DOMAINS.includes(s.domain)&&
  typeof s.observation==="string"&&s.observation.length>=20&&s.observation.length<=1500&&
  typeof s.risk==="string"&&s.risk.length>=10&&s.risk.length<=700&&
  typeof s.sourceUrl==="string"&&s.sourceUrl.length<=600&&httpsUrl(s.sourceUrl)&&
  typeof s.at==="string"&&s.at.length<=40&&Number.isFinite(Date.parse(s.at))&&
  s.evidenceStatus==="user-supplied-unverified");
}
export function creatorReference(input){
 const k={id:id("creator"),handle:trim(input.handle,90),url:trim(input.url,600),note:trim(input.note,500)};
 if(k.handle.length<2||!httpsUrl(k.url))return {error:"Provide a public name or handle and an HTTPS profile URL."};
 return {value:k};
}
export function validCreator(k){return Boolean(k&&typeof k.id==="string"&&k.id.length<=100&&typeof k.handle==="string"&&k.handle.length>=2&&k.handle.length<=90&&typeof k.url==="string"&&k.url.length<=600&&httpsUrl(k.url)&&typeof k.note==="string"&&k.note.length<=500);}
export function createExport(s){if(!validSignal(s))throw Error("Not a valid source-linked opportunity");return {...s};}
export function tabSummary(signals){
 const domains=Object.fromEntries(DOMAINS.map(k=>[k,0]));
 for(const s of signals)if(validSignal(s))domains[s.domain]++;
 return domains;
}
