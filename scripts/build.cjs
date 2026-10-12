const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),assets=['index.html','advanced-banks.js','deep-knowledge.js','coverage-expansion.js','geo-exam-boost.js','geo-mega-tools.js','site-integration.js','sw.js','manifest.webmanifest','icon.svg'];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
for(const p of assets.filter(p=>p.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,p),'utf8'),{filename:p});
for(const m of html.matchAll(/<script src="([^"]+)"/g))if(!assets.includes(m[1]))throw Error('Unpackaged script '+m[1]);
const dist=path.join(root,'dist');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
for(const asset of assets)fs.copyFileSync(path.join(root,asset),path.join(dist,asset));
console.log('Validated JavaScript and packaged '+assets.length+' static assets.');
