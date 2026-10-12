/* One navigation row, browser-local progress guidance and a shared diagnostic workflow. */
(function(){
'use strict';
const bar=document.querySelector('.site-utilities');
for(const id of ['smart-launch','revision-plus-launch','study-lab-launch','geo-mega-launch']){const b=document.getElementById(id);if(b){b.classList.remove('smart-launch','plus-launch','lab-launch');bar.appendChild(b);}}
const css=document.createElement('style');css.textContent='#smart-launch,#revision-plus-launch,#study-lab-launch,#geo-mega-launch{position:static!important;box-shadow:none!important;margin:0!important;transform:none!important}.site-utilities{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem}.site-utilities button{min-height:44px}.utility-hint{display:none}.eb-table{min-width:0}.eb-table td,.eb-table th{min-width:0}html[data-theme=light] .sr-box,html[data-theme=light] .ph-box,html[data-theme=light] .lab-box,html[data-theme=light] .plus-box,html[data-theme=light] .tb-box{background:var(--panel);color:var(--text)}dialog h2{scroll-margin-top:1rem}';document.head.appendChild(css);
const help=document.createElement('section');help.className='callout no-print';help.innerHTML='<div class="row spread"><div><strong>Your revision session</strong><p class="small" style="margin:0">Find a gap → review it → apply the evidence → retry.</p></div><div class="row"><button id="session-diagnostic">Find knowledge gaps</button><button id="session-mistakes">Review mistakes</button><button id="session-backup">Transfer previous progress</button></div></div>';document.querySelector('.components').before(help);
function openLaunch(id){for(const d of document.querySelectorAll('dialog[open]'))d.close();document.getElementById(id)?.click();}
document.getElementById('session-diagnostic').addEventListener('click',()=>window.__aqaExamBoost.open('gap'));
document.getElementById('session-mistakes').addEventListener('click',()=>window.__aqaSmart.openMistakes());
document.getElementById('session-backup').addEventListener('click',()=>{openLaunch('revision-plus-launch');document.querySelector('[data-plus-tab="backup"]').click();});
// Keep primary launches at one modal depth, including keyboard-triggered launch clicks.
bar.addEventListener('click',ev=>{const b=ev.target.closest('button');if(b&&b.id.endsWith('launch'))for(const d of document.querySelectorAll('dialog[open]'))d.close();},true);
for(const d of document.querySelectorAll('dialog')){if(!d.hasAttribute('aria-labelledby')){const h=d.querySelector('h2,h3');if(h){h.id=h.id||d.id+'-title';d.setAttribute('aria-labelledby',h.id);}}}
const foot=document.querySelector('footer');const p=document.createElement('p');p.textContent='Progress stays in this browser. Back up or use a sync code to transfer it to another device. Existing saved progress at this address is retained.';foot.appendChild(p);
// Clipboard feedback is set by each feature; fall back to selectable text when copying is blocked.
})();
