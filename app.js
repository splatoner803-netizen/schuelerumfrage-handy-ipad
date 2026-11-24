'use strict';
const STORAGE_KEY='schulumfrage-handy-ipad-v2';
let answers={}, current=null, reviewing=false, testMode=false;
let sending=false, submitted=false, submissionId=null, pendingPayload=null;
const $=id=>document.getElementById(id);
function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function button(text,handler,cls='secondary'){const b=el('button',text,cls);b.type='button';b.addEventListener('click',handler);return b;}
function status(text){$('status').textContent=text;}
function askConfirm(message){return new Promise(resolve=>{
 const dialog=el('dialog',undefined,'confirm-dialog');const title=el('h2','Bitte kurz bestätigen');title.id='confirm-title';dialog.setAttribute('aria-labelledby',title.id);
 const finish=value=>{dialog.close();dialog.remove();resolve(value);};
 const actions=el('div',undefined,'nav');actions.append(button('Abbrechen',()=>finish(false)),button('Bestätigen',()=>finish(true),'primary'));
 dialog.append(title,el('p',message),actions);dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false);});document.body.append(dialog);dialog.showModal();
});}

function focusTitle(){const heading=$('content').querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});} if(matchMedia('(max-width:850px)').matches)$('main').scrollIntoView({behavior:'auto',block:'start'});}
function render(focus=true){
 answers=cleanAnswers(answers); const box=$('content');box.replaceChildren();
 $('test-banner').hidden=!testMode;$('save').disabled=testMode;
 if(current===null&&!reviewing){
  $('stage').textContent='Deine Perspektive zählt';$('progress-label').textContent='Start';$('progress').value=0;
  box.append(el('p','HANDY- UND IPAD-REGELUNG','question-meta'),el('h2','Sag, wie du es erlebst.','welcome'),el('p','Hier gibt es keine richtigen oder falschen Antworten. Die Fragen passen sich an deine Angaben an.'),el('p','Wir fragen nur nach deiner Klassenstufe, nicht nach deiner genauen Klasse. Freiwillige Fragen kannst du überspringen. Einige Fragen sind nötig, um dir passende Folgefragen zu zeigen.'),el('p','Am Ende kannst du deine Antworten prüfen und mit „Antworten absenden“ an die Umfrageleitung schicken.','hint'));
  box.append(button('Umfrage starten',()=>{current=1;render();},'primary'));return;
 }
 if(reviewing){renderReview();if(focus)focusTitle();return;}
 const q=QUESTIONS[current-1], path=activePath(answers), pos=path.indexOf(current)+1;
 $('stage').textContent=q.group;$('progress-label').textContent=`Schritt ${pos}`;$('progress').value=Math.round((pos-1)/Math.max(path.length,pos)*100);
 box.append(el('p',q.required?'Auswahl für passende Folgefragen':'Freiwillige Frage','question-meta'));
 const form=el('form');form.noValidate=true;const field=el('fieldset'), legend=el('legend');legend.append(el('h2',q.title));field.append(legend);
 let hint=q.hint;if(q.id===9)hint='Frühere Handyregelung: '+SURVEY_CONFIG.oldRule;
 if(hint){const p=el('p',hint,'hint');p.id='question-hint';field.append(p);field.setAttribute('aria-describedby',p.id);}
 if(q.options){const opts=el('div',undefined,'options'+(q.id===1?' grade-options':''));q.options.forEach((option,i)=>{const label=el('label',undefined,'option');const input=el('input');input.type='radio';input.name='answer';input.value=option;input.checked=answers[q.id]===option;input.id=`q${q.id}-${i}`;input.addEventListener('change',()=>{answers[q.id]=option;answers=cleanAnswers(answers);status('');});label.append(input,el('span',option));opts.append(label);});field.append(opts);}
 else {const input=el(q.type==='text'?'textarea':'input');input.name='answer';input.id='answer-field';input.setAttribute('aria-label',q.title);if(hint)input.setAttribute('aria-describedby','question-hint');if(q.type==='number'){input.type='number';input.min=q.min;input.step='1';input.inputMode='numeric';}else input.maxLength=1500;input.value=answers[q.id]??'';input.addEventListener('input',()=>{answers[q.id]=input.value;if(q.type==='text')$('counter').textContent=`${input.value.length} / 1500 Zeichen`;status('');});field.append(input);if(q.type==='text'){const count=el('p',`${input.value.length} / 1500 Zeichen`,'counter');count.id='counter';field.append(count);}}
 const err=el('p','','error');err.id='error';err.setAttribute('role','alert');form.append(field,err);
 const nav=el('div',undefined,'nav');nav.append(button('Zurück',()=>{const p=activePath(answers);const i=p.indexOf(current);current=i>0?p[i-1]:null;render();}));
 const next=el('button',current===25?'Antworten prüfen':'Weiter','primary');next.type='submit';nav.append(next);form.append(nav);
 form.addEventListener('submit',e=>{e.preventDefault();const msg=validationError(q,answers[q.id],answers);if(msg){err.textContent=msg;return;}if(!q.required && !answers[q.id]) delete answers[q.id];answers=cleanAnswers(answers);const n=nextQuestion(current,answers);if(n===null){reviewing=true;}else current=n;render();});box.append(form);if(focus)focusTitle();
}
function renderReview(){
 $('stage').textContent='Prüfen & absenden';$('progress-label').textContent='Abschluss';$('progress').value=100;const box=$('content');
 box.append(el('p',testMode?'TESTANTWORTEN':'DEINE ÜBERSICHT','question-meta'),el('h2','Bereit zum Absenden?'),el('p','Prüfe deine Angaben. Mit „Antworten absenden“ werden sie an die Umfrageleitung übertragen. Bitte nenne keine Namen oder andere persönliche Angaben.','hint'));
 if(testMode)box.append(el('p','Dieser Versand wird als Test gespeichert und zählt nicht zu den echten Antworten.','notice'));
 const send=button(testMode?'Testantworten absenden':'Antworten absenden',submitAnswers,'primary');send.id='submit-answers';box.append(send);
 const err=el('p','','error');err.id='send-error';err.setAttribute('role','alert');box.append(err);
 activePath(answers).forEach(id=>{const q=QUESTIONS[id-1],row=el('div',undefined,'review-item');row.append(el('h3',q.title),el('p',answers[id]||'Nicht beantwortet','review-meta'),button('Ändern',()=>{current=id;reviewing=false;pendingPayload=null;submissionId=null;render();},'linkbtn'));box.append(row);});
 const exports=el('details');exports.append(el('summary','Eigene Kopie herunterladen'));const actions=el('div',undefined,'export-actions');actions.append(button('JSON herunterladen',()=>download('json')),button('CSV herunterladen',()=>download('csv')));exports.append(actions);box.append(exports);
}
function lockControls(lock){document.querySelectorAll('button,input,select,textarea').forEach(n=>n.disabled=lock);if(!lock)$('save').disabled=testMode;}
async function submitAnswers(){
 if(sending||submitted)return;
 const clean=cleanAnswers(answers);for(const id of activePath(clean)){const msg=validationError(QUESTIONS[id-1],clean[id],clean);if(msg){current=id;reviewing=false;render();$('error').textContent=msg;return;}}
 if(!SURVEY_CONFIG.apiUrl){$('send-error').textContent='Der Empfang ist noch nicht eingerichtet. Deine Antworten bleiben im Tab.';return;}
 if(!pendingPayload){submissionId=crypto.randomUUID();pendingPayload={submission_id:submissionId,version:SURVEY_CONFIG.version,test:testMode,answers:clean};}
 sending=true;lockControls(true);$('submit-answers').textContent='Wird gesendet …';$('send-error').textContent='';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(SURVEY_CONFIG.apiUrl+'/api/responses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pendingPayload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
  const result=await response.json();if(!response.ok||result.ok!==true||result.submission_id!==submissionId)throw Error('server');
  submitted=true;try{localStorage.removeItem(STORAGE_KEY);}catch{}
  $('content').replaceChildren(el('p',testMode?'TEST ERFOLGREICH':'ERFOLGREICH GESENDET','question-meta'),el('h2',testMode?'Testantworten angekommen.':'Danke für deine Teilnahme!'),el('p',testMode?'Der Server hat die Testantworten gespeichert. Sie werden getrennt von echten Antworten ausgewertet.':'Deine Antworten sind bei der Umfrageleitung angekommen und auf dem Umfrage-PC gespeichert. Du kannst diese Seite jetzt schließen.'));
  $('stage').textContent='Abgeschlossen';$('status').textContent='';document.querySelector('.utilities').hidden=true;document.querySelector('.test-panel').hidden=true;focusTitle();
 }catch{
  $('send-error').textContent='Die Speicherung konnte nicht bestätigt werden. Der Umfrage-PC ist möglicherweise nicht erreichbar. Deine Antworten bleiben hier. Bitte versuche es erneut; ein unveränderter erneuter Versuch wird nicht doppelt gezählt.';
 }finally{clearTimeout(timer);sending=false;lockControls(false);if($('submit-answers'))$('submit-answers').textContent=testMode?'Testantworten erneut absenden':'Erneut absenden';}
}
function exportData(){const clean=cleanAnswers(answers);return {umfrage:'Handy- und iPad-Regelung',version:SURVEY_CONFIG.version,testdaten:testMode,erfassung:submitted?'gesendet':'persoenliche_kopie_nicht_als_versandbestaetigung',fruehere_regelung:SURVEY_CONFIG.oldRule.trim()||null,antworten:activePath(clean).map(id=>({frage_id:id,frage:QUESTIONS[id-1].title,antwort:clean[id]??null}))};}
function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function download(format){const data=exportData();let content;if(format==='json')content=JSON.stringify(data,null,2);else content='\uFEFF'+[['Testdaten','Frage_ID','Frage','Antwort'],...data.antworten.map(r=>[testMode?'Ja':'Nein',r.frage_id,r.frage,r.antwort])].map(row=>row.map(csvCell).join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:format==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8'}));const a=el('a');a.href=url;a.download=(testMode?'TEST-':'')+'schulumfrage-antworten.'+format;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Eigene Kopie heruntergeladen. Der Download allein sendet keine Antworten ab.');}
async function resetAll(deleteSaved=true){if(!await askConfirm(deleteSaved?'Alle Antworten in diesem Tab und den auf diesem Gerät gespeicherten Stand löschen? Bereits heruntergeladene Dateien bleiben erhalten.':'Aktuelle Antworten verwerfen und eine neue Umfrage beginnen? Ein gespeicherter Stand bleibt erhalten.'))return;answers={};current=null;reviewing=false;testMode=false;submissionId=null;pendingPayload=null;submitted=false;if(deleteSaved){try{localStorage.removeItem(STORAGE_KEY);}catch{status('Der Browserspeicher ist nicht zugänglich. Antworten im Tab wurden gelöscht.');render();return;}}status('Antworten im Tab'+(deleteSaved?' und gespeicherten Stand':'')+' gelöscht.');render();}
$('reset').addEventListener('click',()=>resetAll());
$('save').addEventListener('click',()=>{if(testMode)return;const q=QUESTIONS.find(q=>validationError(q,answers[q.id],answers)&&answers[q.id]);if(q){status('Bitte prüfe zuerst die Eingabe bei „'+q.title+'“.');return;}try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,answers:cleanAnswers(answers)}));status('Stand nur in diesem Browser gespeichert. Weitere Änderungen werden erst beim erneuten Speichern übernommen.');}catch{status('Speichern ist in diesem Browser nicht möglich. Du kannst am Ende eine Datei herunterladen.');}});
$('restore').addEventListener('click',async()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw){status('In diesem Browser ist kein Stand gespeichert.');return;}const data=JSON.parse(raw);if(data.version!==1||!data.answers||typeof data.answers!=='object')throw Error('format');const safe={};for(const q of QUESTIONS){const v=data.answers[q.id];if(typeof v==='string'&&v.length<=1500&&!validationError(q,v,data.answers))safe[q.id]=v;}if(Object.keys(answers).length&&!await askConfirm('Den aktuellen Stand im Tab durch den gespeicherten Stand ersetzen?'))return;pendingPayload=null;submissionId=null;answers=cleanAnswers(safe);current=1;reviewing=false;testMode=false;render();status('Gespeicherten Stand geladen. Du kannst ihn prüfen und ergänzen.');}catch{status('Der gespeicherte Stand kann nicht geladen werden.');}});
const SCENARIOS={none:{1:'5',4:'Nein',12:'Weder positiv noch negativ',19:'Nein'},os:{1:'Q1',2:'Ja',3:'Meistens',5:'Ja',6:'Ja',7:'2',8:'1',10:'Etwas mehr als bisher',11:'Ungefähr gleich viel',12:'Eher positiv',19:'Ja, ein geliehenes oder von der Schule bereitgestelltes iPad',20:'Ja',21:'Einmal',22:'Nie',23:'Eher wohl'},nobag:{1:'10',4:'Ja',5:'Nein',19:'Ja, ein eigenes iPad',20:'Nein'}};
$('load-test').addEventListener('click',async()=>{if(Object.keys(answers).length&&!await askConfirm('Aktuelle Antworten im Tab durch Beispieldaten ersetzen?'))return;pendingPayload=null;submissionId=null;answers={...SCENARIOS[$('scenario').value]};current=1;reviewing=false;testMode=true;render();status('Beispiel geladen. Gehe mit „Weiter“ durch die passenden Fragen.');});
function selfTest(){let checks=0;const assert=(v,msg)=>{if(!v)throw Error(msg);checks++;};const p0=activePath(SCENARIOS.none);assert(!p0.includes(3)&&!p0.includes(5)&&!p0.includes(10)&&!p0.includes(21),'Ohne Handy/iPad');const p1=activePath(SCENARIOS.os);assert(p1.includes(3)&&p1.includes(7)&&p1.includes(8)&&p1.includes(21)&&!p1.includes(4),'Oberstufe');const p2=activePath(SCENARIOS.nobag);assert(!p2.includes(3)&&!p2.includes(6)&&!p2.includes(7)&&!p2.includes(21),'Ohne Tasche');assert(!activePath(SCENARIOS.os,'').includes(9),'Leere Beschreibung');assert(activePath(SCENARIOS.os,'Bestätigte Regelung').includes(9),'Ergänzte Regelung');const changed={...SCENARIOS.os,2:'Nein'};const clean=cleanAnswers(changed);assert(!Object.hasOwn(clean,7)&&!Object.hasOwn(clean,3),'Veraltete Antworten');assert(!!validationError(QUESTIONS[7],'3',{7:'2'}),'Kostenanzahl');assert(!!validationError(QUESTIONS[6],'-1',{}),'Negative Zahl');assert(csvCell('=1+1').startsWith('"\''),'CSV-Schutz');return checks;}
$('self-test').addEventListener('click',()=>{try{$('test-result').textContent=`${selfTest()} Prüfungen bestanden. Es wurden keine Antworten verändert oder gespeichert.`;}catch(e){$('test-result').textContent='Prüfung fehlgeschlagen: '+e.message;}});
if(SURVEY_CONFIG.oldRule.trim())$('old-rule-info').textContent='Die frühere Handyregelung wird bei der entsprechenden Frage erklärt.';
render(false);
