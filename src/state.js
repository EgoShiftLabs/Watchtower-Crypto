// Standalone research origin and keys. Never import another product's localStorage.
import {validSignal,validCreator} from "./core.js";
export const STORAGE_KEY="watchtower.crypto.research.v1";
export const STATE_SCHEMA="watchtower-crypto-browser-v1";
export const blank=()=>({schema:STATE_SCHEMA,signals:[],creators:[]});
export function validate(s){
 return Boolean(s&&s.schema===STATE_SCHEMA&&Array.isArray(s.signals)&&s.signals.length<=120&&
 Array.isArray(s.creators)&&s.creators.length<=80&&
 s.signals.every(validSignal)&&s.creators.every(validCreator)&&
 new Set(s.signals.map(x=>x.id)).size===s.signals.length&&
 new Set(s.creators.map(x=>x.id)).size===s.creators.length);
}
export function load(){
 try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(validate(x))return x;}catch{}
 return blank();
}
export function save(s){
 if(!validate(s))return false;
 try{const json=JSON.stringify(s);if(json.length>330000)return false;localStorage.setItem(STORAGE_KEY,json);return true;}catch{return false;}
}
