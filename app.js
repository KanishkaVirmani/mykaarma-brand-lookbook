import {chapters,durations,journey,notes,step,SCENE,COLLAGE_APPEAR_SECONDS,COLLAGE_TRAVEL_SECONDS,collageInterval,mixedCollection} from './model.js';

const $=id=>document.getElementById(id);
const canvas=$('canvas'), scenes=[...document.querySelectorAll('.scene')];
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let scene=0,c=0,playing=false,paused=false,elapsed=0,last=performance.now(),journeyTimer,assetManifest=[];

function fit(){const r=$('viewport').getBoundingClientRect();const s=Math.min(r.width/1600,r.height/900);canvas.style.transform=`scale(${s})`;canvas.style.left=`${(r.width-1600*s)/2}px`;canvas.style.top=`${(r.height-900*s)/2}px`;}
addEventListener('resize',fit);document.addEventListener('fullscreenchange',fit);fit();

function buildTile(item,opts={}){
  const el=document.createElement('figure');el.className='asset-tile'+(item.kind==='video'?' video-tile':'');el.style.margin='0';
  const {x=0,y=0,w=250,h=180,rotation=0,delay=0,dx=60,dy=80,travel=.8}=opts;
  Object.assign(el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  for(const [k,v] of Object.entries({rotation:rotation+'deg',delay:delay+'s',dx:dx+'px',dy:dy+'px',travel:travel+'s'}))el.style.setProperty('--'+k,v);
  if(item.kind==='video'){
    const v=document.createElement('video');v.src='assets/'+item.file;v.poster='assets/'+item.poster;v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.setAttribute('muted','');v.setAttribute('aria-label',item.name.replace(/YTDown.*Media_/,'').replace(/_001.*/,''));el.append(v);
  }else{const img=document.createElement('img');img.src='assets/'+item.file;img.alt=item.kind==='page'?`${item.name}, page ${item.page}`:item.name;img.decoding='async';el.append(img);}
  return el;
}
const itemFor=(part,page)=>assetManifest.find(x=>x.name===part&&(page===undefined||x.page===page));
function addTile(parent,item,opts){if(item)$(parent).append(buildTile(item,opts));}
async function prepareCollection(){
  assetManifest=await fetch('assets/assets.json').then(r=>{if(!r.ok)throw Error('asset manifest');return r.json();});
  const pictures=assetManifest.filter(x=>x.kind!=='video'&&!['logo-dark_FULLRES.png','mk Logo 200 white.png','mykaarma.png'].includes(x.name));
  const mixed=mixedCollection(pictures);
  // Complete the final row with supplied assets so the collage reaches every edge.
  const columns=8,rows=Math.ceil(mixed.length/columns);
  const selection=Array.from({length:columns*rows},(_,i)=>mixed[i%mixed.length]);
  const findVideo=key=>assetManifest.find(x=>x.kind==='video'&&x.file.includes(key));
  const overlays=[
    {item:findVideo('puck'),at:9,x:70,y:405,w:180,front:true},
    {item:findVideo('nada'),at:23,x:1305,y:385,w:176,front:true},
    {item:findVideo('surcharging'),at:35,x:785,y:83,w:120},
    {item:findVideo('welcome'),at:47,x:975,y:690,w:280}
  ].filter(v=>v.item);
  const interval=collageInterval(selection.length+overlays.filter(v=>v.at<selection.length).length);
  let sequence=0;
  selection.forEach((item,i)=>{
    const row=Math.floor(i/columns),col=i%columns;
    addTile('collage-wall',item,{x:col*200-15+Math.sin(i*4)*5,y:row*(900/rows)-15+Math.cos(i*2.7)*5,w:230,h:900/rows+35,rotation:Math.sin(i*1.91)*3,delay:sequence++*interval,dx:i%2?55:-55,dy:60,travel:COLLAGE_TRAVEL_SECONDS});
    overlays.filter(v=>v.at===i).forEach(v=>{
      const ratio=v.item.width/v.item.height;
      const tile=buildTile(v.item,{x:v.x,y:v.y,w:v.w,h:v.w/ratio,rotation:v.front?(v.x<500?-3:3):-2,delay:sequence++*interval,dx:40,dy:60,travel:COLLAGE_TRAVEL_SECONDS});
      tile.style.zIndex=v.front?'100':'65';$('collage-wall').append(tile);
    });
  });
  durations[SCENE.collage]=(COLLAGE_APPEAR_SECONDS+3)*1000;
  if(scene===SCENE.collage){$('collage-wall').classList.add('animate');syncVideos();}

}

function drawInstrument(){
  const svg=$('instrument-svg'),NS='http://www.w3.org/2000/svg';
  const make=(tag,attrs)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));svg.append(e);return e;};
  const center={x:585,y:550};
  for(const r of [476,400,305])make('path',{d:`M ${center.x-r} ${center.y} A ${r} ${r} 0 0 1 ${center.x+r} ${center.y}`,fill:'none',stroke:r===476?'#4f4f56':'#3d3d44','stroke-width':.8,'stroke-dasharray':r===476?'5 8':'none'});
  for(let i=0;i<=78;i++){
    const a=(Math.PI*1.15)+(Math.PI*.7*i/78),r=305,l=i%6===0?18:9;
    make('line',{x1:center.x+Math.cos(a)*r,y1:center.y+Math.sin(a)*r,x2:center.x+Math.cos(a)*(r+l),y2:center.y+Math.sin(a)*(r+l),stroke:i%6===0?'#a6a6ae':'#686871','stroke-width':i%6===0?1.8:1.2});
  }
  make('line',{x1:585,y1:232,x2:585,y2:259,stroke:'#FF5500','stroke-width':1});
}
drawInstrument();
journey.forEach((j,i)=>{const b=document.createElement('button');b.textContent=j.title;b.addEventListener('click',()=>{stopPlay();setJourney(i);});$('journey-tabs').append(b);});
$('journey-prev').addEventListener('click',()=>{stopPlay();setJourney(Math.max(0,c-1));});
$('journey-next').addEventListener('click',()=>{stopPlay();setJourney(Math.min(3,c+1));});
function writeJourney(){
  const j=journey[c];$('journey-title').textContent=j.title;$('journey-lead').textContent=j.lead;$('journey-body').textContent=j.body;$('journey-count').textContent=`0${c+1} / 04`;
  [...$('journey-tabs').children].forEach((b,i)=>{b.classList.toggle('active',i===c);b.setAttribute('aria-pressed',String(i===c));});
  $('journey-prev').disabled=c===0;$('journey-next').disabled=c===3;
  $('announcer').textContent=`${j.title}. ${j.lead}`;
}
function setJourney(target,animate=true){
  if(target===c){writeJourney();return;}
  clearTimeout(journeyTimer);const copy=$('journey-copy');copy.classList.remove('enter-right','exit-left');
  if(animate&&!reduceMotion){copy.classList.add('exit-left');journeyTimer=setTimeout(()=>{c=target;writeJourney();copy.classList.remove('exit-left');copy.classList.add('enter-right');updateControls();},400);}
  else{c=target;writeJourney();updateControls();}
}

// Each fill stays in the exact vector logo mask. Only the moving color edge changes.
const colors=['#FF5500','#C61354','#EAECF4','#D1BBFF','#000000'];
colors.forEach(color=>{const layer=document.createElement('div');Object.assign(layer.style,{position:'absolute',inset:'0',background:color,clipPath:'inset(0 100% 0 0)'});$('logo-fill').append(layer);});
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>x*x*(3-2*x);
function updateReveal(t){
  const emboss=$('logo-emboss'),fill=$('logo-fill');
  const emergence=clamp((t-1)/.8),blackProgress=clamp((t-9)/1.7);
  emboss.style.opacity=String(emergence*(1-smooth(blackProgress)));
  fill.style.opacity=t<2.8?'0':'1';
  [...fill.children].forEach((layer,i)=>{const progress=smooth(clamp((t-(2.8+i*1.55))/1.7));layer.style.clipPath=`inset(0 ${(1-progress)*100}% 0 0)`;});
}
function updateQuestion(t){const text='Would you buy from us?';const count=reduceMotion?text.length:Math.floor(clamp((t-.22)/2)*text.length);$('question-text').textContent=text.slice(0,count);$('question-text').classList.toggle('typing',count>0&&count<text.length);}

function setScene(target,{settled=false,writeHash=true}={}){
  scene=Math.max(0,Math.min(chapters.length-1,target));elapsed=settled?durations[scene]||0:0;last=performance.now();clearTimeout(journeyTimer);
  scenes.forEach((s,i)=>{s.classList.toggle('active',i===scene);s.classList.toggle('scene-enter',i===scene&&scene!==SCENE.question&&!settled);s.setAttribute('aria-hidden',String(i!==scene));s.inert=i!==scene;});
  const wall=$('collage-wall');wall.classList.remove('animate','settled');void wall.offsetWidth;if(settled||reduceMotion)wall.classList.add('settled');else if(scene===SCENE.collage)wall.classList.add('animate');
  document.body.className=scene>=SCENE.rollout?'theme-black':'';
  if(scene===SCENE.question)updateQuestion(elapsed/1000);
  if(scene===SCENE.reveal)updateReveal(reduceMotion||settled?22:0);
  if(scene===SCENE.launch){$('journey-copy').classList.remove('enter-right','exit-left');writeJourney();}
  if(scene>=SCENE.survey){playing=false;paused=false;}
  if(writeHash)history.replaceState(null,'',`#${scene+1}`);
  updateLookbookTimeline();updateControls();syncVideos();
  $('announcer').textContent=`${scene+1} of ${chapters.length}. ${chapters[scene]}`;
}
function syncVideos(){document.querySelectorAll('video').forEach(v=>{if(scene===SCENE.collage&&!paused){v.play().catch(()=>{});}else v.pause();});}
function updateControls(){
  $('current-label').textContent=chapters[scene];$('page-count').textContent=`${String(scene+1).padStart(2,'0')} / ${chapters.length}`;
  $('previous-button').disabled=scene===0;$('next-button').disabled=scene===chapters.length-1;
  $('play-button').hidden=scene>SCENE.collage;$('play-button').textContent=paused?'Resume':playing?'Pause':'Play opening';
  [...$('progress').children].forEach((b,i)=>{b.classList.toggle('active',i===scene);b.classList.toggle('past',i<scene);if(i===scene)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  [...$('chapter-menu').children].forEach((b,i)=>b.classList.toggle('active',i===scene));
  const n=notes[scene];$('notes-title').textContent=n[0];$('notes-content').textContent=n[1];$('notes-source').textContent=n[2];
}
function stopPlay(){playing=false;paused=false;document.querySelectorAll('.animate').forEach(el=>el.style.animationPlayState='running');document.querySelectorAll('.asset-tile').forEach(el=>el.style.animationPlayState='running');updateControls();}
function navigate(delta){
  stopPlay();
  const next=step({scene,c},delta);
  if(next.scene===scene&&scene===SCENE.launch){setJourney(next.c);return;}
  if(next.scene===scene)return;
  c=next.c;setScene(next.scene,{settled:delta<0});
}
function togglePlay(){
  if(scene>SCENE.collage)return;
  if(!playing&&!paused&&elapsed>=durations[scene])setScene(scene);
  if(playing&&!paused){paused=true;document.querySelectorAll('.asset-tile').forEach(el=>el.style.animationPlayState='paused');}
  else{playing=true;paused=false;last=performance.now();document.querySelectorAll('.asset-tile').forEach(el=>el.style.animationPlayState='running');}
  syncVideos();updateControls();
}
function replay(){stopPlay();setScene(scene);}
chapters.forEach((name,i)=>{
  const b=document.createElement('button');b.title=name;b.setAttribute('aria-label',`Go to ${name}`);b.addEventListener('click',()=>{stopPlay();c=0;setScene(i);});$('progress').append(b);
  const item=document.createElement('button');const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');item.append(number,document.createTextNode(name));item.addEventListener('click',()=>{stopPlay();c=0;setScene(i);toggleMenu(false);});$('chapter-menu').append(item);
});
function toggleMenu(open=$('chapter-menu').hidden){$('chapter-menu').hidden=!open;$('chapters-button').setAttribute('aria-expanded',String(open));}
function toggleNotes(){$('notes-panel').hidden=!$('notes-panel').hidden;}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});}
$('next-button').addEventListener('click',()=>navigate(1));$('previous-button').addEventListener('click',()=>navigate(-1));$('replay-button').addEventListener('click',replay);$('play-button').addEventListener('click',togglePlay);$('chapters-button').addEventListener('click',()=>toggleMenu());$('notes-button').addEventListener('click',toggleNotes);$('close-notes').addEventListener('click',toggleNotes);$('fullscreen-button').addEventListener('click',fullscreen);
document.addEventListener('click',e=>{if(!e.target.closest('#chapter-menu')&&!e.target.closest('#chapters-button'))toggleMenu(false);});
$('viewport').addEventListener('click',e=>{if(!e.target.closest('button'))navigate(1);});
document.addEventListener('keydown',e=>{
  if($('artwork-viewer').open)return;
  if(e.target.closest('input,textarea,select'))return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();navigate(1);}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();navigate(-1);}
  else if(e.key.toLowerCase()==='r')replay();
  else if(e.key.toLowerCase()==='p')togglePlay();
  else if(e.key.toLowerCase()==='n')toggleNotes();
  else if(e.key.toLowerCase()==='f')fullscreen();
  else if(e.key==='Home'){stopPlay();c=0;setScene(0);}
  else if(e.key==='End'){stopPlay();setScene(chapters.length-1);}
  else if(e.key==='Escape'){toggleMenu(false);$('notes-panel').hidden=true;}
});
function tick(now){const delta=Math.min(100,now-last);last=now;if(!paused)elapsed+=delta;
  if(scene===SCENE.question)updateQuestion(elapsed/1000);
  if(scene===SCENE.reveal)updateReveal(reduceMotion?22:elapsed/1000);
  if(playing&&!paused&&scene<=SCENE.collage&&elapsed>=durations[scene])setScene(scene+1);
  requestAnimationFrame(tick);
}

const phaseButtons=[...document.querySelectorAll('#lookbook-timeline button')];
function updateLookbookTimeline(){
  const active=scene-SCENE.launch, visible=active>=0;
  $('lookbook-timeline').hidden=!visible;
  phaseButtons.forEach((b,i)=>{b.classList.toggle('active',visible&&i===active);if(visible&&i===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
}
phaseButtons.forEach((b,i)=>b.addEventListener('click',()=>{stopPlay();c=0;setScene(SCENE.launch+i);}));
const viewer=$('artwork-viewer');
document.querySelectorAll('[data-artwork]').forEach(button=>button.addEventListener('click',()=>{
  stopPlay();const im=$('viewer-image');im.src=button.dataset.artwork;im.alt=button.dataset.caption;$('viewer-caption').textContent=button.dataset.caption;viewer.showModal();$('close-artwork').focus();viewer.querySelector('.viewer-scroll').scrollTop=0;
}));
$('close-artwork').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});

const initial=Number(location.hash.slice(1));setScene(Number.isFinite(initial)&&initial>=1&&initial<=chapters.length?initial-1:0,{writeHash:false});
prepareCollection().catch(error=>{console.error(error);$('announcer').textContent='Some artwork could not load. Please reload the presentation.';});
requestAnimationFrame(tick);
