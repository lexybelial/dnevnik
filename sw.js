const C='dz-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const cacheable=u.origin===location.origin||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs'))||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(!cacheable||e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:u.origin===location.origin}).then(hit=>{
      const net=fetch(e.request).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}return res;}).catch(()=>hit||(u.origin===location.origin?caches.match('./index.html'):undefined));
      return hit||net;
    })
  );
});
