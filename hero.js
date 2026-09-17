/* eazyAI scroll-scrub hero. Frame assets belong in /public/frames/{desktop,mobile}. */
(() => {
  const CONFIG = { frameCount: 140, scrollLength: '+=300%', scrub: .5, mobileBreakpoint: 768, textTimings: [[0,.30],[.35,.65],[.70,1]] };
  const hero = document.querySelector('#hero'), canvas = document.querySelector('#hero-canvas'), video = document.querySelector('#hero-static-video'), loader = document.querySelector('#hero-loader');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lowData = connection?.saveData || ['slow-2g','2g','3g'].includes(connection?.effectiveType);
  if (!hero || reduced || lowData) { video?.play().catch(()=>{}); return; }
  const ctx = canvas.getContext('2d'), isMobile = innerWidth < CONFIG.mobileBreakpoint, folder = isMobile ? 'mobile' : 'desktop';
  const images = new Array(CONFIG.frameCount), loaded = new Set(); let current = -1, target = 0, started = false;
  const path = i => `/public/frames/${folder}/frame_${String(i + 1).padStart(4,'0')}.webp`;
  function cover(image) { const dpr = Math.min(devicePixelRatio || 1,2), w = innerWidth, h = innerHeight; canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight), iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;ctx.clearRect(0,0,w,h);ctx.drawImage(image,(w-iw)/2,(h-ih)/2,iw,ih); }
  function draw(index) { let i=Math.round(index); if(i===current)return; while(i>=0&&!loaded.has(i))i--; if(i<0){ for(i=Math.round(index);i<CONFIG.frameCount&&!loaded.has(i);i++); } if(!loaded.has(i))return; current=i; cover(images[i]); video.style.opacity='0'; }
  function get(i) { if(images[i]) return; const image = new Image(); image.decoding='async'; image.onload=()=>{loaded.add(i); if(i===0){ draw(0); init(); } else draw(target); if(started && loaded.size/CONFIG.frameCount < .3 && target > 3) loader.hidden=false; else loader.hidden=true;}; image.onerror=()=>{ if(i===0) video.style.opacity='.55';}; image.src=path(i); images[i]=image; }
  function progressive(){ get(0); for(let i=4;i<CONFIG.frameCount;i+=4)get(i); let i=1; const fill=()=>{while(i<CONFIG.frameCount&&images[i])i++;if(i<CONFIG.frameCount){get(i++);setTimeout(fill,45)}};setTimeout(fill,250); }
  function init(){ if(!window.gsap || !window.ScrollTrigger)return; gsap.registerPlugin(ScrollTrigger); const frame={value:0}; gsap.to(frame,{value:CONFIG.frameCount-1,ease:'none',snap:'value',scrollTrigger:{trigger:hero,start:'top top',end:CONFIG.scrollLength,pin:true,scrub:CONFIG.scrub,onUpdate:self=>{started=true;target=Math.round(frame.value);draw(target);}},onUpdate:()=>draw(frame.value)}); document.querySelectorAll('.hero-message').forEach((el,i)=>{const [start,end]=CONFIG.textTimings[i];gsap.fromTo(el,{autoAlpha:0,y:24},{autoAlpha:1,y:0,ease:'none',scrollTrigger:{trigger:hero,start:`top+=${start*300}% top`,end:`top+=${Math.min(end,start+.12)*300}% top`,scrub:true}}); gsap.to(el,{autoAlpha:0,y:-24,ease:'none',scrollTrigger:{trigger:hero,start:`top+=${Math.max(start+.18,end-.12)*300}% top`,end:`top+=${end*300}% top`,scrub:true}})}); ScrollTrigger.refresh(); }
  let resize; addEventListener('resize',()=>{clearTimeout(resize);resize=setTimeout(()=>{draw(current);window.ScrollTrigger?.refresh()},180)}); addEventListener('load',()=>setTimeout(()=>window.ScrollTrigger?.refresh(),100)); progressive();
})();

/* Lighter video-currentTime alternative (enable only after the all-intra transcodes in README):
const video = document.querySelector('#hero-video'); gsap.to(video,{currentTime:video.duration,ease:'none',scrollTrigger:{trigger:'#hero',pin:true,end:'+=300%',scrub:.5}});
*/
