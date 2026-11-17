import test from "node:test";import assert from "node:assert/strict";
import {createSignal,createExport,validSignal,creatorReference,validCreator,tabSummary,httpsUrl,DOMAINS} from "../src/core.js";
import {blank,validate,STORAGE_KEY} from "../src/state.js";
const example={title:"Original music communities",domain:"Music & IP",
 observation:"Independent creators published original cultural assets and recurring collaboration events.",
 risk:"This could be a short-lived marketing spike without returning users.",
 sourceUrl:"https://example.org/creator-report"};
test("source-linked research requires HTTPS, substantive observation and falsifier",()=>{
 const valid=createSignal(example);assert.ok(valid.value);
 assert.equal(valid.value.schema,"bodybagz.opportunity.v1");
 assert.equal(valid.value.evidenceStatus,"user-supplied-unverified");
 assert.equal(validSignal(valid.value),true);
 assert.ok(createSignal({...example,sourceUrl:"http://example.org/post"}).error);
 assert.ok(createSignal({...example,sourceUrl:"javascript:alert(1)"}).error);
 assert.ok(createSignal({...example,observation:"short"}).error);
 assert.ok(createSignal({...example,risk:"x"}).error);
 assert.ok(createSignal({...example,domain:"Fake domain"}).error);
 assert.equal(httpsUrl("https://trusted.example@evil.example"),false);
});
test("opportunity handoff exports only published V1 fields",()=>{
 const entry=createSignal(example).value;
 const extended={...entry,localPrivateNotes:"not part of schema"};
 const exported=createExport(extended);
 assert.equal(exported.localPrivateNotes,undefined);
 assert.deepEqual(Object.keys(exported).sort(),["schema","id","title","domain","observation","risk","sourceUrl","at","evidenceStatus"].sort());
 assert.deepEqual(exported.sourceUrl,entry.sourceUrl);
});
test("manual public creator watchlist is not a social API",()=>{
 const c=creatorReference({handle:"@originalbuilder",url:"https://example.org/user",note:"Look for independent evidence"});
 assert.ok(c.value);assert.equal(validCreator(c.value),true);
 assert.ok(creatorReference({handle:"@originalbuilder",url:"data:text/html,evil",note:""}).error);
});
test("storage namespace is independent and rejects oversized or malformed data",()=>{
 assert.equal(STORAGE_KEY,"watchtower.crypto.research.v1");
 const state=blank();assert.equal(validate(state),true);
 state.signals.push(createSignal(example).value);assert.equal(validate(state),true);
 state.signals[0].evidenceStatus="verified-by-insider";assert.equal(validate(state),false);
 state.signals[0].evidenceStatus="user-supplied-unverified";
 state.creators.push({id:"x",handle:"ab",url:"https://example.org",note:"n".repeat(501)});assert.equal(validate(state),false);
});
test("domain counts are derived from user notes, not invented live feeds",()=>{
 const state=[createSignal(example).value,createSignal({...example,domain:"Culture"}).value];
 const domains=tabSummary(state);
 assert.equal(domains["Music & IP"],1);
 assert.equal(domains.Culture,1);
 assert.equal(Object.keys(domains).length,DOMAINS.length);
});
test("pinned V1 contract is an unverified evidence record",async()=>{
 const {readFile}=await import("node:fs/promises");
 const schema=JSON.parse(await readFile(new URL("../contracts/opportunity.v1.schema.json",import.meta.url)));
 assert.equal(schema.properties.schema.const,"bodybagz.opportunity.v1");
 assert.equal(schema.properties.evidenceStatus.const,"user-supplied-unverified");
 assert.equal(schema.additionalProperties,false);
});
