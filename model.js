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
export const notes=[
  ['The old identity','Open with the familiar logo. This is the visual language we are moving from: orange, lime, blue, navy, and Lato. Advance when ready.','Source: supplied old logo and mK Brand Guide.'],
  ['The fragmented picture','The whole collection accumulates. Silent video loops are deliberately small parts of the same canvas. Let the final collage hold, then advance to the white reset. Each asset arrives at the same steady interval, in mixed rows. The left and right Shorts preserve their portrait framing. P plays the opening automatically; R replays this beat.','Source: supplied product guide, collateral, employee screenshots, and videos.'],
  ['The shared-story gap','18% of 61 responses explained both the full offering and why it matters. 113 distinct personality descriptors appeared across 60 usable personality answers. The analysis reports 84% positive-only personality descriptions. Shared themes were innovation/curiosity and care/collaboration. This is a directional shared-story gap, alongside real employee pride. The quote is an illustrative response, not a claim about every employee.','Source: Brand Survey Insights, October 2026. May 26–June 1 survey; AI-assisted coding. Quote R03, Training & Deployment.'],
  ['Would you buy from us?','The old visual language clears completely. Let the question sit in silence before advancing. This is the first appearance of the new typography.','Creative question supplied by Kanishka.'],
  ['A new chapter','A white canvas holds for one second. The new white wordmark emerges with a subtle raised edge, then orange, raspberry, grey-lilac, lavender, and black flow through in overlapping passes. Half a second after black settles, a short burst of raspberry, lavender, and orange pattern strokes draws outward behind the wordmark, then disappears. The final artwork is the exact flat black supplied master. R replays; returning with Back shows the final state.','Source: supplied new vector logo; reveal direction from Kanishka.'],
  ['The Service Growth Platform','The three platform pillars connect visibility, continuity, and proof. The journey is an explanatory model, not another pillar set. The arrows connect Capture, Convert, Consult, and Complete. The interactive sales-enablement animation appears in New brand launch. Optimize spans the whole journey.\n\nThe platform works with the dealer’s existing DMS. The tone challenges conventional thinking while remaining practical, specific, and transparent.','Positioning and pillar names: Platform Positioning & Messaging Framework. Voice: board lookbook. Pillar summaries: condensed copy. Journey descriptions: latest agency brandbook.'],
  ['The evolved identity','The logo, color palette, and minimal graphic forms build a cohesive visual system. Black and white provide the foundation; brighter colors add emphasis.','Source: supplied new brand book and palette. Temporary white emboss and color animation follow the requested reveal direction.'],
  ['How it comes to life','The four phases retain the dates in the draft lookbook. Timing is proposed and needs final confirmation. Advance to the visual spreads, or choose any phase from the timeline at the top of each spread.','Source: 20261030_Draft Board Brand Lookbook.'],
  ['New brand launch','The refreshed website leads the spread, supported by the ServiceCart one pager and Ujj’s LinkedIn profile. Click any artwork to inspect it in full. Use next/back or the instrument controls to step through all four Cs. The large website visual opens the complete supplied homepage.','Source: supplied New Brand Launch folder. Four Cs: latest agency brandbook.'],
  ['NADA lead-up & channel activation','The demo landing page, the single Automation social artwork, and the service growth social post show the campaign across channels. The lower central collage brings together branded jotters, pointers, socks, and caps. Click any artwork to inspect it. The top timeline lets the presenter move directly between rollout phases.','Source: supplied NADA Lead-up & Channel Activation folder.'],
  ['NADA','The supplied booth front corner is the hero, supported by the Ujj interview concept, 4 visitors plus 25 myKaarma, and the column mockup. These are future-state concepts, not documentation of a completed event. Click to inspect any visual.','Source: supplied NADA folder; all four requested assets.'],
  ['Customers tell our story','All three supplied visuals are shown: the Zach Cochran testimonial, the revised BMW General Manager Car Dealership Guy LinkedIn concept, and the NADA 2027 recap blog concept. The media post testimonial and 3x RO headline are illustrative concept copy, not verified results. The recap is a future-state mockup. Click to read each visual in full.','Source: supplied Post-NADA folder.']
];
export function step(state,delta){
  const {scene,c}=state;
  if(scene===SCENE.launch&&delta>0&&c<3)return {scene,c:c+1};
  if(scene===SCENE.launch&&delta<0&&c>0)return {scene,c:c-1};
  const next=Math.max(0,Math.min(chapters.length-1,scene+delta));
  return {scene:next,c:next===SCENE.launch?(delta<0?3:0):c};
}
