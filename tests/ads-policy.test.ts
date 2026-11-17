import {describe,it,expect} from 'vitest';
import {AdPolicy,parseAdMessage} from '../apps/client/src/native/ads-policy';
describe('Shared native interstitial placement policy',()=>{
 it('rejects profile payloads, unknown events, oversized and invalid sequence messages',()=>{
  expect(parseAdMessage(JSON.stringify({type:'lifespinner.ads.v1',event:'spin',seq:1}))).toEqual({event:'spin',seq:1});
  for(const data of [{type:'lifespinner.ads.v1',event:'spin',seq:1,name:'Alex'},{type:'lifespinner.ads.v1',event:'start',seq:1},{type:'lifespinner.ads.v1',event:'home',seq:-1},{type:'lifespinner.ads.v1',event:'spin',seq:1.3}])expect(parseAdMessage(JSON.stringify(data))).toBeNull();
  expect(parseAdMessage('x'.repeat(501))).toBeNull();
 });
 it('needs six successful spins and two active minutes, then reserves a single natural break',()=>{
  const p=new AdPolicy(null,0);p.setActive(true,0);p.ready(0);
  for(let i=0;i<5;i++)p.spin(10000+i);expect(p.eligible(130000)).toBe(false);
  p.spin(130000);expect(p.eligible(130000)).toBe(true);p.reserve(130000);expect(p.eligible(130001)).toBe(false);
 });
 it('never counts background time and keeps cooldown and spins across restarts',()=>{
  const p=new AdPolicy(null,0);p.setActive(true,0);p.ready(0);p.setActive(false,60000);p.setActive(true,600000);for(let i=0;i<6;i++)p.spin(600001+i);
  expect(p.eligible(600010)).toBe(false);expect(p.eligible(660010)).toBe(true);p.reserve(660010);
  const next=new AdPolicy(p.serialize(660010),660010);next.setActive(true,660010);next.ready(660010);for(let i=0;i<6;i++)next.spin(660011+i);
  expect(next.eligible(840009)).toBe(false);expect(next.eligible(840010)).toBe(true);
 });
 it('caps three per rolling thirty minutes, handles clock rollback conservatively',()=>{
  const p=new AdPolicy(JSON.stringify({spins:6,activeMs:120000,shownAt:[1000000,1300000,1600000]}),1600001);p.setActive(true,1600001);p.ready(1600001);
  expect(p.eligible(1900000)).toBe(false);expect(p.eligible(2800001)).toBe(true);
  const q=new AdPolicy(JSON.stringify({spins:6,activeMs:120000,shownAt:[3000000]}),2000000);q.setActive(true,2000000);q.ready(2000000);expect(q.eligible(2200000)).toBe(false);
 });
 it('handles corrupt persisted counters without granting immediate ad eligibility',()=>{
  for(const raw of ['bad',JSON.stringify({spins:Infinity,activeMs:-1,shownAt:[]}),JSON.stringify({spins:6,activeMs:120000,shownAt:['bad']})]){
   const p=new AdPolicy(raw,0);p.setActive(true,0);p.ready(0);expect(p.eligible(0)).toBe(false);
  }
 });
});
