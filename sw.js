
const CACHE="aikatsu-encore-v2";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=="GET")return;
 // Cache local app shell; external card images remain network-first with cache fallback.
 if(u.origin===location.origin){
   e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
     const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
   })));
 } else if(e.request.destination==="image"){
   e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
     const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
   }).catch(()=>new Response("",{status:503}))));
 }
});
