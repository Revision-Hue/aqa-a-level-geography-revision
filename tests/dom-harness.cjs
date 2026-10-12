const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require(process.env.QA_JSDOM || 'jsdom');
function harness(seed={}){
 const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const errors=[],alerts=[],downloads=[],timers=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:process.env.QA_SITE_URL||'https://geography.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;
 w.prompt=()=>"Correct explanation";w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.alert=s=>alerts.push(s);w.confirm=()=>true;w.print=()=>{};w.open=()=>({document:{write(){},close(){}},focus(){},print(){}});w.scrollTo=()=>{};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){for(const d of w.document.querySelectorAll('dialog[open]'))d.close();this.setAttribute('open','');};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
 w.URL.createObjectURL=b=>{downloads.push(b);return 'blob:test';};w.URL.revokeObjectURL=()=>{};
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{},readText:async()=>''}});
 w.setTimeout=(f)=>{timers.push(f);return timers.length;};w.clearTimeout=()=>{};w.setInterval=()=>1;w.clearInterval=()=>{};
 for(const [k,v]of Object.entries(seed))w.localStorage.setItem(k,v);
 w.addEventListener('error',e=>errors.push(e.error?.stack||e.message));
 w.__qa={};let inline=0;
 const exportNames=[null,'srRate,srState,srDueCards,srRender','index,mark,cards','applySet,dataPool,getLab:()=>lab','sheetData','neaNums,neaSpearman,neaMannWhitney,neaChiSquare,neaResultHtml,getPerf:()=>perf','chooseTask'];
 for(const s of w.document.querySelectorAll('script')){
 let code=s.src?fs.readFileSync(path.join(root,path.basename(new URL(s.src).pathname)),'utf8'):s.textContent;
 if(!s.src){if(inline&&exportNames[inline])code=code.replace(/\}\)\(\);\s*$/,`window.__qa.m${inline}={${exportNames[inline]}};})();`);inline++;}
 else if(s.src.endsWith('geo-exam-boost.js'))code=code.replace(/\}\)\(\);\s*$/,`window.__qa.eb={STATS,MAPQ,mapSVG,DATASETS,getState:()=>st,getGap:()=>gap};})();`);
 else if(s.src.endsWith('geo-mega-tools.js'))code=code.replace(/\}\)\(\);\s*$/,`window.__qa.gm={newOS,getOS:()=>osQ,getState:()=>state,allCases,ao3Entries,curatedStats};})();`);
 try{vm.runInContext(code,dom.getInternalVMContext());}catch(e){errors.push((s.src||'inline '+(inline-1))+': '+e.stack);}
 }
 vm.runInContext('window.__qa.data={U,CASES,state,VIEWS};',dom.getInternalVMContext());
 function click(selector){const e=w.document.querySelector(selector);if(!e)throw Error('Missing control '+selector);e.click();flush();return e;}
 function input(selector,value,type='input'){const e=w.document.querySelector(selector);if(!e)throw Error('Missing input '+selector);e.value=String(value);e.dispatchEvent(new w.Event(type,{bubbles:true}));flush();return e;}
 function flush(){let n=0;while(timers.length&&n++<100)timers.shift()();}
 function snapshot(){return Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));}
 flush();return{w,d:w.document,errors,alerts,downloads,click,input,flush,snapshot,close:()=>dom.window.close()};
}
module.exports={harness};
if(require.main===module){const h=harness();console.log(JSON.stringify({errors:h.errors,topics:Object.fromEntries(Object.entries(h.w.__qa.data.U).map(([k,v])=>[k,{notes:v.notes.length,quiz:v.quiz.length,prompts:v.prompts.length}])),cases:h.w.__qa.data.CASES.length,launches:[...h.d.querySelectorAll('button[id$="launch"]')].map(b=>b.id)},null,2));h.close();}
