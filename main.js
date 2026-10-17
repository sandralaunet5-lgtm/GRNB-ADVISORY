const PAGES=[['index.html','Accueil'],['presentation.html','Présentation'],['services.html','Nos services'],['solutions.html','Nos solutions'],['marches.html','Les marchés'],['publications.html','Publications'],['contact.html','Contact']];
const here=location.pathname.split('/').pop()||'index.html';
const API='api/api.php';
let isAdmin=false;
const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!==undefined)e.textContent=txt;return e};
const post=async(a,fd)=>{const r=await fetch(`${API}?a=${a}`,{method:'POST',body:fd,credentials:'same-origin'});const j=await r.json().catch(()=>({error:'Réponse serveur invalide (PHP actif ?)'}));if(!r.ok)throw new Error(j.error||'Erreur');return j};
const LOGO='<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="17" stroke="#2B4C7E" stroke-width="2.5"/><path d="M12 32l9-9 6 5 10-12" stroke="#c9a24b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#0A192F" stroke-width="2.5" stroke-linecap="round"/></svg>';
function layout(){
 const h=$('#site-header');
 if(h){h.className='site-header';h.innerHTML=`<div class="wrap"><div class="nav"><a class="logo" href="index.html" aria-label="GRNB Advisory">${LOGO}GRNB ADVISORY</a><button class="burger" aria-label="Menu">☰</button><ul class="menu">${PAGES.map(([u,l])=>`<li><a href="${u}" class="${u===here?'active':''}">${l}</a></li>`).join('')}<li class="mob"><a href="#" data-login>Accès Client</a></li></ul><button class="btn btn-steel" data-login>Accès Client</button></div></div>`;
  $('.burger').onclick=()=>$('.menu').classList.toggle('open')}
 const f=$('#site-footer');
 if(f)f.innerHTML=`<footer><div class="wrap"><nav>${PAGES.map(([u,l])=>`<a href="${u}">${l}</a>`).join('')}<a href="mentions.html">Mentions légales</a><a href="mentions.html#confidentialite">Confidentialité</a><a href="mentions.html#conformite">Conformité réglementaire</a></nav><div class="bot"><span>Contact : contact@grnb-advisory.com</span><span>© ${new Date().getFullYear()} GRNB Advisory</span></div></div></footer>`;
 const d=el('dialog');d.id='login';d.innerHTML='<h3>Espace administrateur</h3><form class="form"><label>Identifiant<input name="user" required autocomplete="username"></label><label>Mot de passe<input name="password" type="password" required autocomplete="current-password"></label><p class="msg"></p><button class="btn btn-steel">Se connecter</button><button type="button" class="btn btn-line" value="x">Fermer</button></form>';
 document.body.append(d);
 $('button[type=button]',d).onclick=()=>d.close();
 $('form',d).onsubmit=async e=>{e.preventDefault();const m=$('.msg',d);m.className='msg';m.textContent='Connexion…';try{await post('login',new FormData(e.target));location.reload()}catch(x){m.className='msg err';m.textContent=x.message}};
 document.addEventListener('click',e=>{if(e.target.closest('[data-login]')){e.preventDefault();isAdmin?(location.href='publications.html'):d.showModal()}});
}
const SPARK={up:'M0 22 L12 16 L24 19 L36 9 L48 12 L64 3',down:'M0 4 L14 8 L26 6 L40 16 L52 14 L64 22',flat:'M0 14 L10 10 L22 16 L34 11 L46 17 L64 12'};
function ticker(){const t=$('#ticker');if(!t)return;
 // Valeurs de démonstration : à remplacer par une API de données de marché
 const D=[['CAC 40','7 350,23','+0,3 %','up'],['S&P 500','4 882,11','−0,1 %','down'],['EUR/USD','1,0915','','flat'],['Taux US 10 ans','4,15 %','','up'],['Inflation Zone Euro','2,1 %','','flat']];
 t.innerHTML='<div class="wrap">'+D.map(([n,v,c,s])=>`<div class="tick"><div><small>${n}</small><b>${v}</b> <span class="chg ${s==='down'?'down':'up'}">${c}</span></div><svg viewBox="0 0 64 26" fill="none"><path d="${SPARK[s]}" stroke="${s==='down'?'#c0392b':s==='up'?'#1e8e5a':'#70A1D7'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`).join('')+'</div>'}
async function pubs(){
 const box=$('#pubs');if(!box)return;
 let data={items:[],admin:false};
 try{data=await (await fetch(`${API}?a=list`,{credentials:'same-origin'})).json()}catch(e){}
 isAdmin=data.admin;
 const limit=+box.dataset.limit||999;
 const host=$('#admin-panel');
 if(isAdmin&&host){host.innerHTML='';const b=el('div','admin-box');
  b.innerHTML='<div class="admin-bar"><h3>Publier un contenu</h3><button class="btn btn-line" id="out">Se déconnecter</button></div><form class="form"><label>Titre<input name="title" required maxlength="140"></label><label>Description<textarea name="desc" rows="2" maxlength="400"></textarea></label><label>Fichier (PDF, MP4 ou WebM)<input name="file" type="file" accept=".pdf,.mp4,.webm" required></label><p class="msg"></p><button class="btn btn-steel">Publier</button></form>';
  host.append(b);
  $('#out',b).onclick=async()=>{await post('logout',new FormData());location.reload()};
  $('form',b).onsubmit=async e=>{e.preventDefault();const m=$('.msg',b);m.className='msg';m.textContent='Envoi en cours…';try{await post('upload',new FormData(e.target));location.reload()}catch(x){m.className='msg err';m.textContent=x.message}}}
 else if(host&&!isAdmin){host.innerHTML='<p style="margin-bottom:20px"><a href="#" data-login class="btn btn-line">Connexion administrateur</a></p>'}
 box.innerHTML='';
 if(!data.items.length)box.append(el('div','empty','Aucune publication pour le moment. Les rapports et vidéos apparaîtront ici.'));
 data.items.slice(0,limit).forEach(p=>{
  const c=el('article','pub');
  if(p.type==='video'){const v=el('video');v.controls=true;v.preload='metadata';v.src=p.file;c.append(v)}else c.append(el('div','thumb','PDF'));
  const b=el('div','body');b.append(el('small','',new Date(p.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})+(p.type==='video'?' · Vidéo':' · Rapport')),el('h3','',p.title),el('p','',p.desc));
  const r=el('div','row');
  if(p.type==='pdf'){const a=el('a','btn btn-steel','Télécharger le PDF');a.href=p.file;a.download=p.title+'.pdf';const o=el('a','btn btn-line','Lire');o.href=p.file;o.target='_blank';o.rel='noopener';r.append(a,o)}
  else{const a=el('a','btn btn-line','Télécharger la vidéo');a.href=p.file;a.download='';r.append(a)}
  if(isAdmin){const d=el('button','btn btn-line','Supprimer');d.onclick=async()=>{if(!confirm('Supprimer « '+p.title+' » ?'))return;const fd=new FormData();fd.append('id',p.id);await post('delete',fd);location.reload()};r.append(d)}
  b.append(r);c.append(b);box.append(c)})}
document.addEventListener('DOMContentLoaded',()=>{layout();ticker();pubs()});
