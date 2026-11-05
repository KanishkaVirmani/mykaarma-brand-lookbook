export const SCENE={cover:0,collage:1,survey:2,question:3,reveal:4,platform:5,identity:6,rollout:7,launch:8,activation:9,nada:10,post:11};
export const chapters=['The old identity','Fragmentation','Employee brand insights','The question','The reveal','Our platform','The visual identity','The rollout','New brand launch','NADA lead-up & activation','NADA','Customers tell our story'];
export const durations=[6000,13000,0,4000,13000,0,0,0,0,0,0,0];
export const COLLAGE_APPEAR_SECONDS=10;
export const COLLAGE_TRAVEL_SECONDS=.5;
export const collageInterval=count=>(COLLAGE_APPEAR_SECONDS-COLLAGE_TRAVEL_SECONDS)/Math.max(1,count-1);
export function mixedCollection(items){
  const category=x=>x.kind==='page'?(x.name.includes('Product Guide')?'guide':'collateral'):/linkedin/i.test(x.name)?'linkedin':/mku|learn/i.test(x.name)?'learning':'other';
  const hash=s=>[...s].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,17);
  const buckets=new Map();
  [...items].sort((a,b)=>hash(a.file)-hash(b.file)).forEach(item=>{const key=category(item);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(item);});
  const result=[];let last='';
  while(result.length<items.length){const available=[...buckets].filter(([,v])=>v.length);const alternatives=available.filter(([k])=>k!==last);const choices=alternatives.length?alternatives:available;choices.sort((a,b)=>b[1].length-a[1].length);const [key,list]=choices[0];result.push(list.shift());last=key;}
  return result;
}
export const journey = [
  {title:'Capture',lead:'Surface the service demand.',body:'Declined work, recalls, no-shows, and lapsed customers become visible next actions.'},
  {title:'Convert',lead:'Put the right work on the calendar.',body:'Booking is matched to real shop capacity, not a disconnected calendar.'},
  {title:'Consult',lead:'Let proof drive approval.',body:'Technician video turns a recommendation into a clear customer decision.'},
  {title:'Complete',lead:'Collect today. Retain tomorrow.',body:'Payment closes the visit while deferred work stays ready for follow-up.'}
];
export function step(state,delta){
  const {scene,c}=state;
  if(scene===SCENE.launch&&delta>0&&c<3)return {scene,c:c+1};
  if(scene===SCENE.launch&&delta<0&&c>0)return {scene,c:c-1};
  const next=Math.max(0,Math.min(chapters.length-1,scene+delta));
  return {scene:next,c:next===SCENE.launch?(delta<0?3:0):c};
}
