const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let n=0;const handlers={},put=[],removed=[],files=new Map(),origin='https://geo.test/',scope=origin;
const caches={open:async()=>({put:async(k,v)=>{put.push(String(k.url||k));files.set(String(k.url||k),v);}}),keys:async()=>['geo-revision-pwa-v9','rs-revision-pwa-v9','other-cache'],delete:async k=>removed.push(k),match:async r=>files.get(String(r.url||r))};
let response={ok:true,redirected:false,type:'basic',clone(){return this;}};
vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),{URL,self:{registration:{scope},addEventListener:(k,f)=>handlers[k]=f,skipWaiting(){},clients:{claim(){}}},caches,fetch:async()=>response});
(async()=>{
let pending;handlers.install({waitUntil:p=>pending=p});await pending;
const assets=put.map(x=>new URL(x).pathname.slice(1));assert.equal(assets.length,10);for(const asset of assets.filter(Boolean))assert(fs.existsSync(path.join(root,asset)));n++;console.log('PASS Offline installation includes every runtime asset');
handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(removed,['geo-revision-pwa-v9']);n++;console.log('PASS Cache cleanup preserves sibling and unrelated apps');
function event(url,mode='navigate',method='GET'){let out,wait=[];handlers.fetch({request:{url,mode,method},respondWith:p=>out=p,waitUntil:p=>wait.push(p)});return{out,wait};}
assert.equal(event('https://external.test/file.js','no-cors').out,undefined);assert.equal(event(origin+'api/record','same-origin').out,undefined);assert.equal(event(origin,'navigate','POST').out,undefined);n++;console.log('PASS Service worker ignores external requests, APIs and writes');
put.length=0;response={ok:true,redirected:true,type:'basic',clone(){return this;}};let e=event(origin);await e.out;await Promise.all(e.wait);assert.equal(put.length,0);response={ok:false,redirected:false,type:'basic',clone(){return this;}};e=event(origin);await e.out;await Promise.all(e.wait);assert.equal(put.length,0);n++;console.log('PASS Redirected authentication and error responses are never cached');
const manifestPath=path.join(root,'.openai/hosting.json');if(fs.existsSync(manifestPath)){const manifest=JSON.parse(fs.readFileSync(manifestPath));assert(manifest.project_id);assert.equal(manifest.static.directory,'dist');}
for(const asset of ['index.html',...assets.filter(x=>x&&x!=='index.html')])assert.equal(fs.readFileSync(path.join(root,asset)).equals(fs.readFileSync(path.join(root,'dist',asset))),true);n++;console.log('PASS Packaged assets match validated source byte for byte');console.log(n+' offline/package checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
