const V='g2048-v11',F=['./','index.html','manifest.json','icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'reload'}).then(r=>c.put(u,r))))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
// 有网先拿最新版（最多等2.5秒），没网用手机里存的
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
  e.respondWith(new Promise(res=>{let done=false;const fromCache=()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'));
    const t=setTimeout(()=>{if(!done){done=true;fromCache().then(res)}},2500);
    fetch(req,{cache:'no-store'}).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(V).then(x=>x.put(req,c))}if(!done){done=true;clearTimeout(t);res(r)}})
      .catch(()=>{if(!done){done=true;clearTimeout(t);fromCache().then(res)}})}))});
