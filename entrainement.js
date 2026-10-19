/* Le labo fonctionne sans serveur : quiz, éditeur, validations, coach et exports. */
(() => {
'use strict';
const en = document.documentElement.lang === 'en';
const L = (fr, english) => en ? english : fr;
const $ = id => document.getElementById(id);
const questions = [
 { q:L('Quel langage donne sa structure à une page ?','Which language gives a page its structure?'), options:['HTML','CSS','JavaScript'], answer:0, why:L('HTML organise le contenu avec des balises : titres, paragraphes, liens…','HTML organises content with tags: headings, paragraphs, links…') },
 { q:L('Où relier style.css à une page HTML ?','Where do you link style.css to an HTML page?'), options:['<link rel="stylesheet" href="style.css">','<script src="style.css"></script>','<img src="style.css">'], answer:0, why:L('La balise <link rel="stylesheet"> se place dans le <head> du fichier HTML.','The <link rel="stylesheet"> tag belongs in the HTML file’s <head>.') },
 { q:L('Quel sélecteur CSS cible class="carte" ?','Which CSS selector targets class="carte"?'), options:['#carte','.carte','<carte>'], answer:1, why:L('Le point cible une classe. Le symbole # cible un identifiant id.','A dot targets a class. The # symbol targets an id.') },
 { q:L('À quoi sert padding ?','What does padding do?'), options:[L('Ajouter de l’espace à l’intérieur','Add space inside an element'),L('Changer la couleur du texte','Change the text colour'),L('Ouvrir un lien','Open a link')], answer:0, why:L('padding règle l’espace entre le contenu d’un élément et sa bordure.','padding sets the space between an element’s content and its border.') },
 { q:L('Pourquoi ajouter defer à <script src="script.js" defer> ?','Why add defer to <script src="script.js" defer>?'), options:[L('Pour supprimer le JavaScript','To remove JavaScript'),L('Pour exécuter le script après l’analyse du HTML','To run the script after HTML parsing'),L('Pour rendre le texte gras','To make text bold')], answer:1, why:L('defer attend que le HTML soit analysé : le script peut alors retrouver les boutons et paragraphes.','defer waits for the HTML to be parsed, so the script can find buttons and paragraphs.') },
 { q:L('Comment écouter un clic sur un bouton en JavaScript ?','How do you listen for a button click in JavaScript?'), options:['bouton.color = "click"','bouton.addEventListener("click", fonction)','<button href="click">'], answer:1, why:L('addEventListener associe un événement, ici click, à une fonction.','addEventListener connects an event, here click, to a function.') }
];
const baseCSS = 'body {\n  font-family: Arial, sans-serif;\n  color: #001810;\n  padding: 24px;\n  line-height: 1.6;\n}\n';
const exercises = [
 { id:'html-titre', lang:'html', title:L('Un titre et un paragraphe','A heading and a paragraph'), brief:L('Construis une petite présentation de HETIC avec un titre principal et une phrase.','Build a short HETIC introduction with a main heading and a sentence.'), goals:[L('Un seul titre <h1> contient « Bonjour HETIC ».','A single <h1> contains “Bonjour HETIC”.'),L('Un paragraphe <p> contient une phrase.','A <p> paragraph contains a sentence.')], initial:{html:'<!-- '+L('Ajoute ton titre et ton paragraphe ici.','Add your heading and paragraph here.')+' -->',css:baseCSS,js:''}, solution:{html:'<h1>Bonjour HETIC</h1>\n<p>Je découvre le développement web.</p>',css:baseCSS,js:''}, hints:[L('Commence par une balise <h1> et ferme-la avec </h1>.','Start with an <h1> tag and close it with </h1>.'),L('Entre les deux balises, écris Bonjour HETIC.','Write Bonjour HETIC between the two tags.'),L('Ajoute ensuite <p>Ta phrase ici.</p> sous ton titre.','Then add <p>Your sentence here.</p> below the heading.')] },
 { id:'html-lien', lang:'html', title:L('Un lien qui mène quelque part','A link that goes somewhere'), brief:L('Crée un lien interne vers une section de cours. Clique dessus dans l’aperçu pour voir le résultat.','Create an internal link to a lesson section. Click it in the preview to try it.'), goals:[L('Un lien <a> a href="#cours" et un texte.','An <a> link has href="#cours" and some text.'),L('Une section id="cours" contient un titre <h2>.','A section with id="cours" contains an <h2> heading.')], initial:{html:'<p>'+L('Crée ton lien et ta section ci-dessous.','Create your link and section below.')+'</p>',css:baseCSS,js:''}, solution:{html:'<a href="#cours">Voir le cours</a>\n<section id="cours">\n  <h2>Mon cours HTML</h2>\n</section>',css:baseCSS,js:''}, hints:[L('Un lien s’écrit <a href="destination">Texte</a>.','A link is written <a href="destination">Text</a>.'),L('Une destination qui commence par # pointe vers un id sur la même page.','A destination beginning with # points to an id on the same page.'),L('Utilise href="#cours" et <section id="cours"> avec un <h2> dedans.','Use href="#cours" and <section id="cours"> with an <h2> inside.')] },
 { id:'css-carte', lang:'css', title:L('Une carte aux couleurs HETIC','A card in HETIC colours'), brief:L('Mets en forme la carte déjà présente dans le HTML. Travaille dans l’onglet CSS.','Style the card already present in the HTML. Work in the CSS tab.'), goals:[L('Le fond de .carte est #2ee7c4.','The .carte background is #2ee7c4.'),L('L’espace intérieur est de 24px sur les quatre côtés.','Padding is 24px on all four sides.'),L('Les quatre coins sont arrondis à 16px.','All four corners have a 16px radius.')], initial:{html:'<article class="carte">\n  <h2>HETIC</h2>\n  <p>'+L('Ma première carte.','My first card.')+'</p>\n</article>',css:baseCSS+'\n.carte {\n  /* '+L('À toi de compléter.','Your turn.')+' */\n}',js:''}, solution:{html:'<article class="carte"><h2>HETIC</h2><p>Ma première carte.</p></article>',css:baseCSS+'\n.carte {\n  background: #2ee7c4;\n  padding: 24px;\n  border-radius: 16px;\n}',js:''}, hints:[L('La classe carte se cible avec .carte { … }.','Target the carte class with .carte { … }.'),L('Les propriétés à utiliser sont background, padding et border-radius.','Use background, padding and border-radius.'),L('Vise background: #2ee7c4; padding: 24px; border-radius: 16px;.','Aim for background: #2ee7c4; padding: 24px; border-radius: 16px;.')] },
 { id:'css-grille', lang:'css', title:L('Deux cartes côte à côte','Two cards side by side'), brief:L('Transforme le conteneur .cartes en grille de deux colonnes, espacées de 16px.','Turn the .cartes container into a two-column grid with a 16px gap.'), goals:[L('.cartes utilise display: grid.','.cartes uses display: grid.'),L('La grille a exactement deux colonnes.','The grid has exactly two columns.'),L('L’espace entre lignes et colonnes est de 16px.','The row and column gaps are 16px.')], initial:{html:'<div class="cartes">\n  <article>HTML</article>\n  <article>CSS</article>\n</div>',css:baseCSS+'\narticle { background: #2ee7c4; padding: 20px; border-radius: 12px; }\n\n.cartes {\n  /* '+L('Ajoute ta grille.','Add your grid.')+' */\n}',js:''}, solution:{html:'<div class="cartes"><article>HTML</article><article>CSS</article></div>',css:baseCSS+'\narticle { background: #2ee7c4; padding: 20px; border-radius: 12px; }\n.cartes {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}',js:''}, hints:[L('La grille se définit sur le parent .cartes, pas sur chaque article.','Define the grid on the .cartes parent, not on each article.'),L('Utilise display: grid et grid-template-columns pour créer les colonnes.','Use display: grid and grid-template-columns to create columns.'),L('Essaie grid-template-columns: repeat(2, 1fr); puis gap: 16px;.','Try grid-template-columns: repeat(2, 1fr); then gap: 16px;.')] },
 { id:'js-bonjour', lang:'js', title:L('Un bouton qui dit bonjour','A button that says hello'), brief:L('Au clic sur #saluer, remplace le texte de #message par « Bonjour HETIC ! ».','When #saluer is clicked, change #message to “Bonjour HETIC !”.'), goals:[L('Les éléments #saluer et #message sont présents.','The #saluer and #message elements exist.'),L('Un clic affiche exactement « Bonjour HETIC ! ».','One click displays exactly “Bonjour HETIC !”.')], initial:{html:'<button id="saluer">'+L('Dire bonjour','Say hello')+'</button>\n<p id="message">'+L('En attente de ton clic…','Waiting for your click…')+'</p>',css:baseCSS+'\nbutton { padding: 12px 20px; border: 0; border-radius: 12px; background: #2ee7c4; cursor: pointer; }',js:'const bouton = document.querySelector("#saluer");\nconst message = document.querySelector("#message");\n\n// '+L('Écoute le clic, puis change le texte.','Listen for a click, then change the text.')}, solution:{html:'<button id="saluer">Dire bonjour</button>\n<p id="message">En attente…</p>',css:baseCSS,js:'const bouton = document.querySelector("#saluer");\nconst message = document.querySelector("#message");\n\nbouton.addEventListener("click", function () {\n  message.textContent = "Bonjour HETIC !";\n});'}, hints:[L('Les deux éléments sont déjà récupérés dans les variables bouton et message.','The bouton and message variables already hold the two elements.'),L('Ajoute bouton.addEventListener("click", function () { … });.','Add bouton.addEventListener("click", function () { … });.'),L('À l’intérieur de la fonction, écris message.textContent = "Bonjour HETIC !";.','Inside the function, write message.textContent = "Bonjour HETIC !";.')] },
 { id:'js-classe', lang:'js', title:L('Activer, désactiver, recommencer','Switch it on, off, and on again'), brief:L('Au clic sur #theme, ajoute ou retire la classe actif sur #carte. Le style est déjà prévu.','When #theme is clicked, add or remove the actif class on #carte. The style is already provided.'), goals:[L('Les éléments #theme et #carte sont présents.','The #theme and #carte elements exist.'),L('Au premier clic, #carte reçoit la classe actif.','After the first click, #carte has the actif class.'),L('Au deuxième clic, la classe actif disparaît.','After the second click, the actif class is removed.')], initial:{html:'<button id="theme">'+L('Changer la carte','Change the card')+'</button>\n<article id="carte">HETIC</article>',css:baseCSS+'\nbutton { padding: 10px 16px; cursor: pointer; }\n#carte { margin-top: 20px; padding: 24px; border-radius: 16px; background: #eee; }\n#carte.actif { background: #2ee7c4; }',js:'const bouton = document.querySelector("#theme");\nconst carte = document.querySelector("#carte");\n\n// '+L('Fais basculer la classe à chaque clic.','Toggle the class on every click.')}, solution:{html:'<button id="theme">Changer la carte</button>\n<article id="carte">HETIC</article>',css:baseCSS+'\n#carte { padding: 24px; background: #eee; }\n#carte.actif { background: #2ee7c4; }',js:'const bouton = document.querySelector("#theme");\nconst carte = document.querySelector("#carte");\n\nbouton.addEventListener("click", function () {\n  carte.classList.toggle("actif");\n});'}, hints:[L('Commence par un écouteur click sur bouton.','Start with a click listener on bouton.'),L('classList permet de manipuler les classes d’un élément.','classList lets you change an element’s classes.'),L('Dans la fonction de clic, utilise carte.classList.toggle("actif");.','Inside the click function, use carte.classList.toggle("actif");.')] }
];
const storageKey='hetic-labo-v1';
let stored={};
try { const value=JSON.parse(localStorage.getItem(storageKey)); if(value && typeof value==='object') stored=value; } catch {}
let answers=questions.map((q,i)=>Number.isInteger(stored.answers?.[i]) && stored.answers[i]>=0 && stored.answers[i]<q.options.length ? stored.answers[i] : null);
const completed=new Set(Array.isArray(stored.completed) ? stored.completed.filter(id=>exercises.some(e=>e.id===id)) : []);
const drafts=stored.drafts && typeof stored.drafts==='object' && !Array.isArray(stored.drafts) ? stored.drafts : {};
let currentIndex=Math.max(0,exercises.findIndex(e=>e.id===stored.current));
let quizIndex=Math.max(0,answers.findIndex(a=>a===null));
let exercise=exercises[currentIndex];
let activeTab=exercise.lang;
let lastResults=[];
let hintIndex=0;
let previewVersion=0;
let previewTimer;
let previewTimeout;
let awaitingCheck=false;
const frame=$('apercu-code');
const editors={html:$('code-html'),css:$('code-css'),js:$('code-js')};
function persist() { try { localStorage.setItem(storageKey,JSON.stringify({answers,completed:[...completed],drafts,current:exercise.id})); } catch {} }
function currentCode() { return Object.fromEntries(Object.entries(editors).map(([kind,editor])=>[kind,editor.value])); }
function rememberDraft() { drafts[exercise.id]=currentCode();persist(); }
function setObservation(message) { $('observation-coach').textContent=message; }
function updateScores() {
 const count=answers.filter(a=>a!==null).length;
 const score=answers.reduce((sum,a,i)=>sum+(a===questions[i].answer?1:0),0);
 $('score-quiz').textContent=count ? score+' / 6' : '— / 6';
 $('score-code').textContent=completed.size+' / 6';
 $('quiz-progres').value=count;
}
function renderQuiz() {
 const done=answers.every(a=>a!==null);
 $('question-quiz').hidden=done;
 $('valider-quiz').hidden=done;
 $('suite-quiz').hidden=true;
 $('recommencer-quiz').hidden=!done;
 $('quiz-retour').textContent='';
 if(done) {
  const score=answers.reduce((sum,a,i)=>sum+(a===questions[i].answer?1:0),0);
  $('quiz-compteur').textContent='6 / 6';
  $('quiz-retour').textContent=L('Quiz terminé : ','Quiz complete: ')+score+L(' bonne(s) réponse(s) sur 6. Passe au code pour mettre ces notions en pratique.',' correct answers out of 6. Try the code exercises to put these ideas into practice.');
  const recap=document.createElement('ul');recap.className='recap-quiz';
  questions.forEach((q,i)=>{const li=document.createElement('li');li.textContent=(answers[i]===q.answer?'✓ ':'↗ ')+q.q+' '+q.why;recap.append(li)});
  $('quiz-retour').append(recap);
 } else {
  const q=questions[quizIndex];
  $('quiz-compteur').textContent=(quizIndex+1)+' / 6';
  $('quiz-question').textContent=q.q;
  $('quiz-options').replaceChildren();
  q.options.forEach((option,i)=>{
   const label=document.createElement('label');label.className='reponse-quiz';
   const radio=document.createElement('input');radio.type='radio';radio.name='reponse';radio.value=String(i);radio.required=true;
   const span=document.createElement('span');span.textContent=option;
   label.append(radio,span);$('quiz-options').append(label);
  });
  $('question-quiz').disabled=false;
 }
 updateScores();
}
$('form-quiz').addEventListener('submit',event=>{
 event.preventDefault();
 const chosen=$('form-quiz').querySelector('input[name="reponse"]:checked');
 if(!chosen || answers[quizIndex]!==null)return;
 const value=Number(chosen.value);const q=questions[quizIndex];answers[quizIndex]=value;
 $('question-quiz').disabled=true;
 $('valider-quiz').hidden=true;$('suite-quiz').hidden=false;
 $('suite-quiz').textContent=quizIndex===5?L('Voir mon bilan →','See my results →'):L('Question suivante →','Next question →');
 $('quiz-retour').textContent=(value===q.answer?L('Bien joué ! ','Well done! '):L('Presque ! La bonne réponse est : ','Not quite! The right answer is: ')+(q.options[q.answer])+'. ')+q.why;
 [...$('quiz-options').children].forEach((label,i)=>{if(i===q.answer)label.classList.add('reponse-correcte');else if(i===value)label.classList.add('reponse-incorrecte')});
 updateScores();persist();
});
$('suite-quiz').addEventListener('click',()=>{quizIndex=Math.max(0,answers.findIndex(a=>a===null));renderQuiz();$('quiz-question').focus?.()});
$('recommencer-quiz').addEventListener('click',()=>{answers=questions.map(()=>null);quizIndex=0;persist();renderQuiz()});
function showTab(kind,focus=false) {
 activeTab=kind;
 for(const key of Object.keys(editors)) {
  const selected=key===kind;
  $('onglet-'+key).setAttribute('aria-selected',String(selected));
  $('onglet-'+key).tabIndex=selected?0:-1;
  $('panneau-'+key).hidden=!selected;
 }
 if(focus)$('onglet-'+kind).focus();
}
Object.keys(editors).forEach((kind,index)=>{
 $('onglet-'+kind).addEventListener('click',()=>showTab(kind));
 $('onglet-'+kind).addEventListener('keydown',event=>{
  const keys=Object.keys(editors);let next;
  if(event.key==='ArrowRight')next=(index+1)%3;
  if(event.key==='ArrowLeft')next=(index+2)%3;
  if(event.key==='Home')next=0;if(event.key==='End')next=2;
  if(next!==undefined){event.preventDefault();showTab(keys[next],true)}
 });
 editors[kind].addEventListener('input',()=>{
  rememberDraft();lastResults=[];
  $('resultat-code').textContent=L('Modifié : vérifie à nouveau tes objectifs.','Edited: check your goals again.');
  setObservation(L('L’aperçu suit tes modifications. Clique sur « Vérifier mon code » pour savoir où tu en es.','The preview follows your edits. Click “Check my code” to see how you are doing.'));
  clearTimeout(previewTimer);
  if($('apercu-auto').checked)previewTimer=setTimeout(()=>renderPreview('preview'),450);
 });
});
function renderExerciseList() {
 $('liste-exercices').replaceChildren();
 exercises.forEach((e,i)=>{
  const button=document.createElement('button');button.type='button';button.className='choix-exercice';button.setAttribute('aria-pressed',String(i===currentIndex));
  const tag=document.createElement('span');tag.className='tag-exercice';tag.textContent=e.lang==='js'?'JS':e.lang.toUpperCase();
  const name=document.createElement('span');name.textContent=e.title;
  button.append(tag,name);
  if(completed.has(e.id)){const check=document.createElement('span');check.textContent=' ✓';check.setAttribute('aria-label',L('Exercice déjà réussi','Exercise passed'));button.append(check)}
  button.addEventListener('click',()=>{rememberDraft();currentIndex=i;loadExercise()});$('liste-exercices').append(button);
 });
}
function renderGoals(results=[]) {
 $('objectifs-exercice').replaceChildren();
 exercise.goals.forEach((goal,i)=>{
  const li=document.createElement('li');const passed=results[i]?.passed;
  li.className=passed===true?'objectif-ok':passed===false?'objectif-revoir':'';
  li.textContent=(passed===true?'✓ ':passed===false?'↗ ':'○ ')+goal;$('objectifs-exercice').append(li);
 });
}
function loadExercise() {
 $('verifier-code').disabled=false;
 exercise=exercises[currentIndex];lastResults=[];hintIndex=0;
 const draft=drafts[exercise.id];
 Object.keys(editors).forEach(kind=>editors[kind].value=typeof draft?.[kind]==='string'?draft[kind].slice(0,20000):exercise.initial[kind]);
 $('titre-exercice').textContent=exercise.title;$('consigne-exercice').textContent=exercise.brief;
 $('langage-exercice').textContent=exercise.lang==='js'?'JavaScript':exercise.lang.toUpperCase();
 $('etat-exercice').textContent=completed.has(exercise.id)?L('Déjà réussi ✓','Previously passed ✓'):L('À essayer','Give it a try');
 $('lien-cours').href=(exercise.lang==='js'?'javascript':exercise.lang)+(en?'-en':'')+'.html';
 $('resultat-code').textContent='';
 showTab(exercise.lang);renderGoals();renderExerciseList();updateScores();
 setObservation(L('Je t’accompagne sur cet exercice. Commence par la consigne, puis essaie un premier changement.','I’ll guide you through this exercise. Start with the instructions, then try one change.'));
 renderPreview('preview');persist();
}
/* Ces contrôles s’exécutent dans l’iframe isolée, sur le vrai résultat du code. */
function evaluateExercise(id) {
 const q=selector=>document.querySelector(selector);
 const text=el=>el?.textContent.trim()||'';
 if(id==='html-titre')return [document.querySelectorAll('h1').length===1 && /bonjour\s+hetic/i.test(text(q('h1'))),text(q('p')).length>=5];
 if(id==='html-lien')return [!!q('a[href="#cours"]') && !!text(q('a[href="#cours"]')),!!q('section#cours h2') && !!text(q('section#cours h2'))];
 if(id==='css-carte') {
  const card=q('.carte');if(!card)return [false,false,false];const s=getComputedStyle(card);
  return [s.backgroundColor==='rgb(46, 231, 196)',[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].every(v=>v==='24px'),[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomRightRadius,s.borderBottomLeftRadius].every(v=>v==='16px')];
 }
 if(id==='css-grille') {
  const grid=q('.cartes');if(!grid)return [false,false,false];const s=getComputedStyle(grid);
  return [s.display==='grid',s.display==='grid' && s.gridTemplateColumns.trim().split(/\s+/).length===2,s.rowGap==='16px' && s.columnGap==='16px'];
 }
 if(id==='js-bonjour') {
  const button=q('#saluer'),message=q('#message');if(!button||!message)return [false,false];
  const before=text(message);button.click();return [true,before!=='Bonjour HETIC !' && text(message)==='Bonjour HETIC !'];
 }
 if(id==='js-classe') {
  const button=q('#theme'),card=q('#carte');if(!button||!card)return [false,false,false];
  const initial=!card.classList.contains('actif');button.click();const on=card.classList.contains('actif');button.click();return [true,initial&&on,!card.classList.contains('actif')];
 }
 return [];
}
function safeScript(value) {return value.replace(/<\/script/gi,'<\\/script')}
function renderPreview(mode) {
 clearTimeout(previewTimer);clearTimeout(previewTimeout);
 const code=currentCode();const version=++previewVersion;const id=exercise.id;
 awaitingCheck=mode==='check';$('verifier-code').disabled=awaitingCheck;
 $('etat-apercu').textContent=L('Actualisation…','Refreshing…');
 const bootstrap=`window.__heticErrors=[];window.addEventListener('error',function(e){window.__heticErrors.push(e.message||'JavaScript error')});window.addEventListener('unhandledrejection',function(e){window.__heticErrors.push(String(e.reason))});`;
 const harness=`setTimeout(function(){let results=[];try{if(${JSON.stringify(mode)}==='check')results=(${evaluateExercise.toString()})(${JSON.stringify(id)});}catch(e){window.__heticErrors.push(String(e.message))}parent.postMessage({type:'hetic-lab-result',version:${version},exercise:${JSON.stringify(id)},mode:${JSON.stringify(mode)},results:results,errors:window.__heticErrors.slice(0,3)},'*');},80);`;
 frame.srcdoc='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; connect-src \'none\'; form-action \'none\'; base-uri \'none\'"><style>html{background:#f2fbf7}body{margin:0;font-family:Arial,sans-serif;padding:24px;color:#001810}*{box-sizing:border-box}button,a{font:inherit}'+code.css.replace(/<\/style/gi,'<\\/style')+'</style><script>'+safeScript(bootstrap)+'</script></head><body>'+code.html+'<script>'+safeScript(code.js)+'</script><script>'+safeScript(harness)+'</script></body></html>';
 previewTimeout=setTimeout(()=>{
  $('verifier-code').disabled=false;awaitingCheck=false;
  $('etat-apercu').textContent=L('L’aperçu n’a pas répondu. Vérifie ton code puis relance-le.','The preview did not respond. Check your code and refresh it.');
 },4500);
}
window.addEventListener('message',event=>{
 const d=event.data;
 if(event.source!==frame.contentWindow || !d || d.type!=='hetic-lab-result' || d.version!==previewVersion || d.exercise!==exercise.id)return;
 clearTimeout(previewTimeout);awaitingCheck=false;$('verifier-code').disabled=false;
 const errors=Array.isArray(d.errors)?d.errors.filter(e=>typeof e==='string').slice(0,3):[];
 $('etat-apercu').textContent=errors.length?L('Erreur JavaScript : ','JavaScript error: ')+errors[0]:L('Aperçu à jour. Tu peux cliquer et tester dedans.','Preview updated. You can click and try it out.');
 if(d.mode==='check') {
  const values=Array.isArray(d.results)?d.results:[];
  lastResults=exercise.goals.map((goal,i)=>({passed:values[i]===true}));renderGoals(lastResults);
  const passed=lastResults.filter(r=>r.passed).length;const all=passed===exercise.goals.length && !errors.length;
  $('resultat-code').textContent=(all?L('Bien joué ! ','Well done! '):L('Tu avances : ','Making progress: '))+passed+' / '+exercise.goals.length+L(' objectifs validés.',' goals passed.');
  if(all){completed.add(exercise.id);$('etat-exercice').textContent=L('Réussi ✓','Passed ✓');renderExerciseList();updateScores();persist();coachReply(L('Bravo, ton code remplit tous les objectifs ! Tu peux le télécharger, le personnaliser ou passer à l’exercice suivant.','Well done, your code meets every goal! Download it, customise it, or try the next exercise.'))}
  else {
   const next=lastResults.findIndex(r=>!r.passed);
   const advice=errors.length?L('Le navigateur signale : ','The browser reports: ')+errors[0]+L(' Vérifie d’abord les parenthèses, guillemets et noms de variables.',' Check parentheses, quotes and variable names first.'):L('La prochaine étape : ','Your next step: ')+(exercise.goals[next]||'');
   coachReply(advice+L(' Demande un indice si tu bloques.',' Ask for a hint if you get stuck.'));
  }
 }
});
$('verifier-code').addEventListener('click',()=>{rememberDraft();renderPreview('check')});
$('actualiser-code').addEventListener('click',()=>renderPreview('preview'));
$('apercu-auto').addEventListener('change',()=>{if($('apercu-auto').checked)renderPreview('preview')});
$('reset-code').addEventListener('click',()=>{drafts[exercise.id]={...exercise.initial};loadExercise()});
let lastCoachReply='';
function appendMessage(text,user=false) {
 const p=document.createElement('p');p.className=user?'message-utilisateur':'message-bot';
 const author=document.createElement('strong');author.textContent=user?L('Toi','You'):'Coach';
 const content=document.createElement('span');content.textContent=text;p.append(author,content);
 $('messages-coach').append(p);while($('messages-coach').children.length>10)$('messages-coach').firstElementChild.remove();
 $('messages-coach').scrollTop=$('messages-coach').scrollHeight;
}
function coachReply(text) {lastCoachReply=text;appendMessage(text);setObservation(text);readReply(text)}
function giveHint(){const i=Math.min(hintIndex++,exercise.hints.length-1);coachReply(L('Indice ','Hint ')+(i+1)+' / '+exercise.hints.length+' · '+exercise.hints[i])}
$('indice-coach').addEventListener('click',giveHint);
$('expliquer-coach').addEventListener('click',()=>coachReply(exercise.brief+' '+exercise.hints[0]));
function answerQuestion(text) {
 const normal=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(/fichier|\bfiles?\b|projet complet|complete project|telecharg|download/.test(normal)&&window.HeticGuidedProject){coachReply(window.HeticGuidedProject());return}
 if(/indice|hint|bloqu|stuck|aide|help/.test(normal)){giveHint();return}
 if(/github|publi|deploy|heberg/.test(normal)){coachReply(L('Télécharge ton projet en ZIP, décompresse-le et envoie les fichiers dans un dépôt GitHub. La page « Publier avec GitHub Pages », accessible dans le pied de page, explique les étapes.','Download your project as a ZIP, unzip it and upload the files to a GitHub repository. The “Publish with GitHub Pages” page in the footer explains every step.'));return}
 if(/telecharg|download|export|zip/.test(normal)){coachReply(L('Le bouton « Mon projet en ZIP » récupère tes trois fichiers reliés entre eux. Les boutons HTML, CSS et JavaScript permettent aussi de télécharger un seul fichier.','“My project as a ZIP” downloads your three linked files. The HTML, CSS and JavaScript buttons also let you download just one file.'));return}
 if(/relier|lier|connect|defer|script src|stylesheet/.test(normal)){coachReply(L('Dans le <head> de ton HTML, ajoute <link rel="stylesheet" href="style.css"> et <script src="script.js" defer></script>. Dans ce labo, les trois onglets sont déjà reliés pour l’aperçu et pour le téléchargement.','In your HTML <head>, add <link rel="stylesheet" href="style.css"> and <script src="script.js" defer></script>. In this lab, the three tabs are already connected for previews and downloads.'));return}
 if(/class|classe|selecteur|selector|identifiant|\bid\b/.test(normal)){coachReply(L('Une classe se cible avec un point : .carte en CSS ou document.querySelector(".carte") en JavaScript. Un id se cible avec #, par exemple #saluer. Sur cet exercice : ','Target a class with a dot: .carte in CSS or document.querySelector(".carte") in JavaScript. Target an id with #, for example #saluer. For this exercise: ')+exercise.hints[0]);return}
 if(/clic|click|bouton|button|event/.test(normal)){coachReply(L('Écoute le clic avec bouton.addEventListener("click", function () { … });. Le code entre les accolades s’exécute au clic. Vérifie que le sélecteur correspond à l’id du bouton HTML.','Listen for clicks with bouton.addEventListener("click", function () { … });. The code inside the braces runs on each click. Check that the selector matches your HTML button’s id.'));return}
 if(/erreur|error|marche|fonctionn|work|verifi|check/.test(normal)){coachReply(L('Clique sur « Vérifier mon code » : je contrôle le résultat dans l’aperçu. Les objectifs marqués ↗ indiquent quoi corriger, et les erreurs JavaScript apparaissent sous l’aperçu.','Click “Check my code”: I inspect the preview result. Goals marked ↗ show what to fix, and JavaScript errors appear below the preview.'));return}
 if(/css|couleur|color|padding|grid|grille|style/.test(normal)){coachReply(L('Le CSS décrit l’apparence. Écris tes règles dans l’onglet CSS : sélecteur { propriété: valeur; }. ','CSS describes appearance. Write rules in the CSS tab: selector { property: value; }. ')+(exercise.lang==='css'?exercise.hints[Math.min(hintIndex,exercise.hints.length-1)]:L('Par exemple, .carte { background: #2ee7c4; padding: 24px; }.','For example, .carte { background: #2ee7c4; padding: 24px; }.')));return}
 if(/html|balise|tag|titre|heading|paragrap/.test(normal)){coachReply(L('Le HTML structure le contenu. Une balise ouvrante et une balise fermante entourent le texte, par exemple <h1>Bonjour HETIC</h1>. Les attributs comme class, id et href précisent le rôle des éléments.','HTML structures content. Opening and closing tags surround text, for example <h1>Bonjour HETIC</h1>. Attributes such as class, id and href add information to elements.'));return}
 if(/merci|thank|salut|bonjour|hello|\bhi\b/.test(normal)){coachReply(L('Avec plaisir ! Choisis un exercice, modifie le code et demande-moi un indice quand tu veux.','You’re welcome! Choose an exercise, edit the code and ask for a hint whenever you like.'));return}
 coachReply(L('Je suis un coach guidé pour les exercices de ce labo. Je peux expliquer les balises, les classes, le CSS, les clics et la publication. Pour ton exercice actuel : ','I’m a guided coach for this lab’s exercises. I can explain tags, classes, CSS, clicks and publishing. For your current exercise: ')+exercise.hints[Math.min(hintIndex,exercise.hints.length-1)]);
}
$('form-coach').addEventListener('submit',event=>{
 event.preventDefault();const text=$('question-coach').value.trim();if(!text)return;
 stopListening();appendMessage(text,true);$('question-coach').value='';answerQuestion(text);
});
/* Le micro n’est demandé qu’à la suite d’un clic explicite sur Dicter. */
const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let recognition=null,recording=false,micTimer,prefix='',micError=false;
function setMic(active){recording=active;$('dicter-coach').setAttribute('aria-pressed',String(active));$('dicter-coach').textContent=active?L('■ Arrêter','■ Stop'):L('🎙 Dicter','🎙 Dictate')}
function stopListening(){if(recognition && recording){try{recognition.stop()}catch{}setMic(false)}clearTimeout(micTimer)}
if(Recognition) {
 try {
  recognition=new Recognition();recognition.lang=en?'en-GB':'fr-FR';recognition.continuous=false;recognition.interimResults=true;
  recognition.onstart=()=>{setMic(true);$('etat-micro').textContent=L('Je t’écoute… Clique sur Arrêter quand tu as terminé.','Listening… Click Stop when you have finished.');micTimer=setTimeout(stopListening,30000)};
  recognition.onresult=event=>{
   let transcript='';for(let i=0;i<event.results.length;i++)transcript+=event.results[i][0].transcript+' ';
   $('question-coach').value=(prefix+(prefix?' ':'')+transcript.trim()).slice(0,300);
   $('etat-micro').textContent=L('Ta dictée apparaît dans le champ. Relis-la, puis clique sur Envoyer.','Your dictation is in the text field. Review it, then click Send.');
  };
  recognition.onerror=event=>{micError=true;setMic(false);clearTimeout(micTimer);$('etat-micro').textContent=['not-allowed','service-not-allowed'].includes(event.error)?L('Micro non autorisé. Tu peux autoriser le micro dans le navigateur ou écrire ta question.','Microphone access was denied. Allow it in the browser or type your question.'):L('La dictée est indisponible pour le moment. Tu peux écrire ta question.','Dictation is unavailable right now. You can type your question.')};
  recognition.onend=()=>{setMic(false);clearTimeout(micTimer);if(!micError && !$('question-coach').value.trim())$('etat-micro').textContent=L('Je n’ai pas reçu de texte. Réessaie ou écris ta question.','No text was received. Try again or type your question.')};
 } catch {recognition=null}
}
if(!recognition){$('dicter-coach').disabled=true;$('etat-micro').textContent=L('La dictée n’est pas prise en charge dans ce navigateur. La discussion écrite fonctionne.','This browser does not support dictation. Written chat still works.')}
$('dicter-coach').addEventListener('click',()=>{
 if(!recognition)return;if(recording){stopListening();return}
 window.speechSynthesis?.cancel();prefix=$('question-coach').value.trim();micError=false;setMic(true);
 $('etat-micro').textContent=L('Si le navigateur le demande, autorise le micro pour commencer.','If the browser asks, allow the microphone to start.');
 try {recognition.start()}catch{setMic(false);$('etat-micro').textContent=L('Impossible de démarrer la dictée. Tu peux écrire ta question.','Dictation could not start. You can type your question.')}
});
function readReply(text){
 if(!$('lire-coach').checked || recording || !window.speechSynthesis || !window.SpeechSynthesisUtterance)return;
 speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=en?'en-GB':'fr-FR';utterance.rate=0.95;
 const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(en?'en':'fr'));if(voice)utterance.voice=voice;
 $('arreter-voix').disabled=false;utterance.onend=()=>{$('arreter-voix').disabled=true};utterance.onerror=()=>{$('arreter-voix').disabled=true};speechSynthesis.speak(utterance);
}
if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){$('lire-coach').disabled=true;$('lire-coach').closest('label').title=L('Lecture vocale non disponible dans ce navigateur.','Speech output is unavailable in this browser.')}
$('lire-coach').addEventListener('change',()=>{if($('lire-coach').checked && lastCoachReply)readReply(lastCoachReply);else{window.speechSynthesis?.cancel();$('arreter-voix').disabled=true}});
$('arreter-voix').addEventListener('click',()=>{window.speechSynthesis?.cancel();$('arreter-voix').disabled=true});
window.addEventListener('pagehide',()=>{stopListening();window.speechSynthesis?.cancel();rememberDraft()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopListening();window.speechSynthesis?.cancel()}});
/* ZIP sans dépendance externe : chaque fichier est stocké en UTF-8. */
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function createZip(files){
 const encoder=new TextEncoder();const local=[],central=[];let offset=0;
 for(const [name,text] of Object.entries(files)){
  const filename=encoder.encode(name),data=encoder.encode(text),crc=crc32(data);
  const head=new Uint8Array(30+filename.length),h=new DataView(head.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,filename.length,true);head.set(filename,30);local.push(head,data);
  const entry=new Uint8Array(46+filename.length),c=new DataView(entry.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,filename.length,true);c.setUint32(42,offset,true);entry.set(filename,46);central.push(entry);offset+=head.length+data.length;
 }
 const size=central.reduce((sum,item)=>sum+item.length,0);const end=new Uint8Array(22),view=new DataView(end.buffer);
 view.setUint32(0,0x06054b50,true);view.setUint16(8,central.length,true);view.setUint16(10,central.length,true);view.setUint32(12,size,true);view.setUint32(16,offset,true);
 return new Blob([...local,...central,end],{type:'application/zip'});
}
function exportFiles(){const code=currentCode();return {'index.html':'<!DOCTYPE html>\n<html lang="'+(en?'en':'fr')+'">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Mon projet HETIC</title>\n<link rel="stylesheet" href="style.css">\n<script src="script.js" defer></script>\n</head>\n<body>\n'+code.html+'\n</body>\n</html>\n','style.css':code.css,'script.js':code.js,'README.txt':L('Ouvre index.html dans ton navigateur. Garde les trois fichiers dans le même dossier.','Open index.html in your browser. Keep all three files in the same folder.')}}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('etat-export').textContent=L('Téléchargement préparé : ','Download prepared: ')+name}
$('telecharger-projet').addEventListener('click',()=>{rememberDraft();download(createZip(exportFiles()),'mon-projet-hetic.zip')});
document.querySelectorAll('[data-export]').forEach(button=>button.addEventListener('click',()=>{const names={html:'index.html',css:'style.css',js:'script.js'};const name=names[button.dataset.export];download(new Blob([exportFiles()[name]],{type:'text/plain;charset=utf-8'}),name)}));
document.addEventListener('hetic-coach-close',()=>{stopListening();window.speechSynthesis?.cancel()});
document.addEventListener('hetic-blocks-code',event=>{
 rememberDraft();currentIndex=0;loadExercise();
 for(const kind of Object.keys(editors))editors[kind].value=String(event.detail[kind]||'');
 rememberDraft();showTab('html');renderPreview('preview');
 $('titre-exercice').textContent=L('Ton projet en blocs — création libre','Your block project — free creation');
 $('consigne-exercice').textContent=L('Retrouve ici le code de tes blocs. Modifie-le et télécharge ton projet. Choisis un mini-exercice pour revenir aux objectifs guidés.','Here is the code from your blocks. Edit it and download your project. Choose a mini exercise to return to guided goals.');
 $('objectifs-exercice').replaceChildren();$('verifier-code').disabled=true;
 setObservation(L('Projet libre : teste ton résultat dans l’aperçu. Choisis ensuite un exercice pour obtenir une vérification par objectifs.','Free project: test the result in the preview. Then choose an exercise for goal-based checks.'));
});
renderQuiz();loadExercise();
coachReply(L('Salut ! Je suis ton coach guidé. Tu peux écrire, dicter une question ou demander un indice. Commence par modifier le code : je vérifierai tes objectifs quand tu cliqueras sur « Vérifier mon code ».','Hi! I’m your guided coach. Type or dictate a question, or ask for a hint. Start by editing the code; I’ll check your goals when you click “Check my code”.'));
})();
