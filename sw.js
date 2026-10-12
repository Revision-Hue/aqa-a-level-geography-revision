/* Cache only this app's successful same-origin assets; never cache authentication responses. */
const CACHE_PREFIX='geo-revision-pwa-';
const CACHE=CACHE_PREFIX+'v11';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./deep-knowledge.js','./advanced-banks.js','./coverage-expansion.js','./geo-exam-boost.js','./geo-mega-tools.js','./site-integration.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(CORE.map(async asset=>{const url=new URL(asset,self.registration.scope);const response=await fetch(url);if(!response.ok||response.redirected||response.type==='opaque')throw Error('App asset unavailable');await cache.put(url.href,response);}))));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 const isAsset=CORE.some(p=>new URL(p,scope).pathname===url.pathname);
 if(event.request.mode!=='navigate'&&!isAsset)return;
 const network=async()=>{const response=await fetch(event.request);if(response.ok&&!response.redirected&&response.type!=='opaque'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;};
 if(event.request.mode==='navigate')event.respondWith(network().catch(()=>caches.match(event.request).then(response=>response||caches.match(new URL('./index.html',scope).href))));
 else event.respondWith(caches.match(event.request).then(response=>response||network()));
});
