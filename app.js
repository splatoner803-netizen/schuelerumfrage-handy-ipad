'use strict';
const STORAGE_KEY='schulumfrage-handy-ipad-v1';
let answers={}, current=null, reviewing=false, testMode=false;
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
  box.append(el('p','HANDY- UND IPAD-REGELUNG','question-meta'),el('h2','Sag, wie du es erlebst.','welcome'),el('p','Hier gibt es keine richtigen oder falschen Antworten. Die Fragen passen sich an deine Angaben an.'),el('p','Wir fragen nur nach deiner Klassenstufe, nicht nach deiner genauen Klasse. Wenn du eine Frage nicht beantworten möchtest, kannst du sie überspringen oder die entsprechende Antwort wählen.'),el('p','Wichtig: Am Ende wird nichts abgeschickt. Du kannst deine Antworten prüfen und herunterladen.','hint'));
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
 $('stage').textContent='Prüfen & herunterladen';$('progress-label').textContent='Abschluss';$('progress').value=100;const box=$('content');
 box.append(el('p',testMode?'BEISPIELANTWORTEN':'DEINE ÜBERSICHT','question-meta'),el('h2','Deine Antworten sind fertig.'),el('p','Es wurde nichts übermittelt. Prüfe deine Angaben und lade sie bei Bedarf herunter. Ein Download wird nicht automatisch an die Schule geschickt.','hint'));
 if(!SURVEY_CONFIG.oldRule.trim())box.append(el('p','Die Frage zur früheren Handyregelung wurde übersprungen, weil deren Beschreibung noch fehlt.','notice'));
 const actions=el('div',undefined,'export-actions');actions.append(button('JSON herunterladen',()=>download('json'),'primary'),button('CSV herunterladen',()=>download('csv')));box.append(actions);
 activePath(answers).forEach(id=>{const q=QUESTIONS[id-1], row=el('div',undefined,'review-item');row.append(el('h3',q.title),el('p',answers[id]||'Keine Angabe','review-meta'),button('Ändern',()=>{current=id;reviewing=false;render();},'linkbtn'));box.append(row);});
 box.append(button('Neue leere Umfrage',()=>resetAll(false),'linkbtn'));
}
function exportData(){const clean=cleanAnswers(answers);return {umfrage:'Handy- und iPad-Regelung',version:SURVEY_CONFIG.version,testdaten:testMode,erfassung:'lokaler_export_ohne_uebermittlung',fruehere_regelung:SURVEY_CONFIG.oldRule.trim()||null,antworten:activePath(clean).map(id=>({frage_id:id,frage:QUESTIONS[id-1].title,antwort:clean[id]??null}))};}
function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function download(format){const data=exportData();let content;if(format==='json')content=JSON.stringify(data,null,2);else content='\uFEFF'+[['Testdaten','Frage_ID','Frage','Antwort'],...data.antworten.map(r=>[testMode?'Ja':'Nein',r.frage_id,r.frage,r.antwort])].map(row=>row.map(csvCell).join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:format==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8'}));const a=el('a');a.href=url;a.download=(testMode?'TEST-':'')+'schulumfrage-antworten.'+format;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Download erstellt. Es wurden keine Antworten an einen Server gesendet.');}
async function resetAll(deleteSaved=true){if(!await askConfirm(deleteSaved?'Alle Antworten in diesem Tab und den auf diesem Gerät gespeicherten Stand löschen? Bereits heruntergeladene Dateien bleiben erhalten.':'Aktuelle Antworten verwerfen und eine neue Umfrage beginnen? Ein gespeicherter Stand bleibt erhalten.'))return;answers={};current=null;reviewing=false;testMode=false;if(deleteSaved){try{localStorage.removeItem(STORAGE_KEY);}catch{status('Der Browserspeicher ist nicht zugänglich. Antworten im Tab wurden gelöscht.');render();return;}}status('Antworten im Tab'+(deleteSaved?' und gespeicherten Stand':'')+' gelöscht.');render();}
$('reset').addEventListener('click',()=>resetAll());
$('save').addEventListener('click',()=>{if(testMode)return;const q=QUESTIONS.find(q=>validationError(q,answers[q.id],answers)&&answers[q.id]);if(q){status('Bitte prüfe zuerst die Eingabe bei „'+q.title+'“.');return;}try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,answers:cleanAnswers(answers)}));status('Stand nur in diesem Browser gespeichert. Weitere Änderungen werden erst beim erneuten Speichern übernommen.');}catch{status('Speichern ist in diesem Browser nicht möglich. Du kannst am Ende eine Datei herunterladen.');}});
$('restore').addEventListener('click',async()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw){status('In diesem Browser ist kein Stand gespeichert.');return;}const data=JSON.parse(raw);if(data.version!==1||!data.answers||typeof data.answers!=='object')throw Error('format');const safe={};for(const q of QUESTIONS){const v=data.answers[q.id];if(typeof v==='string'&&v.length<=1500&&!validationError(q,v,data.answers))safe[q.id]=v;}if(Object.keys(answers).length&&!await askConfirm('Den aktuellen Stand im Tab durch den gespeicherten Stand ersetzen?'))return;answers=cleanAnswers(safe);current=1;reviewing=false;testMode=false;render();status('Gespeicherten Stand geladen. Du kannst ihn prüfen und ergänzen.');}catch{status('Der gespeicherte Stand kann nicht geladen werden.');}});
const SCENARIOS={none:{1:'5',4:'Nein',12:'Weder positiv noch negativ',19:'Nein'},os:{1:'Q1',2:'Ja',3:'Meistens',5:'Ja',6:'Ja',7:'2',8:'1',10:'Etwas mehr als bisher',11:'Ungefähr gleich viel',12:'Eher positiv',19:'Ja, ein geliehenes oder von der Schule bereitgestelltes iPad',20:'Ja',21:'Einmal',22:'Nie',23:'Eher wohl'},nobag:{1:'10',4:'Ja',5:'Nein',19:'Ja, ein eigenes iPad',20:'Nein'}};
$('load-test').addEventListener('click',async()=>{if(Object.keys(answers).length&&!await askConfirm('Aktuelle Antworten im Tab durch Beispieldaten ersetzen?'))return;answers={...SCENARIOS[$('scenario').value]};current=1;reviewing=false;testMode=true;render();status('Beispiel geladen. Gehe mit „Weiter“ durch die passenden Fragen.');});
function selfTest(){let checks=0;const assert=(v,msg)=>{if(!v)throw Error(msg);checks++;};const p0=activePath(SCENARIOS.none);assert(!p0.includes(3)&&!p0.includes(5)&&!p0.includes(10)&&!p0.includes(21),'Ohne Handy/iPad');const p1=activePath(SCENARIOS.os);assert(p1.includes(3)&&p1.includes(7)&&p1.includes(8)&&p1.includes(21)&&!p1.includes(4),'Oberstufe');const p2=activePath(SCENARIOS.nobag);assert(!p2.includes(3)&&!p2.includes(6)&&!p2.includes(7)&&!p2.includes(21),'Ohne Tasche');assert(!p1.includes(9),'Platzhalter');assert(activePath(SCENARIOS.os,'Bestätigte Regelung').includes(9),'Ergänzte Regelung');const changed={...SCENARIOS.os,2:'Nein'};const clean=cleanAnswers(changed);assert(!Object.hasOwn(clean,7)&&!Object.hasOwn(clean,3),'Veraltete Antworten');assert(!!validationError(QUESTIONS[7],'3',{7:'2'}),'Kostenanzahl');assert(!!validationError(QUESTIONS[6],'-1',{}),'Negative Zahl');assert(csvCell('=1+1').startsWith('"\''),'CSV-Schutz');return checks;}
$('self-test').addEventListener('click',()=>{try{$('test-result').textContent=`${selfTest()} Prüfungen bestanden. Es wurden keine Antworten verändert oder gespeichert.`;}catch(e){$('test-result').textContent='Prüfung fehlgeschlagen: '+e.message;}});
if(SURVEY_CONFIG.oldRule.trim())$('old-rule-info').textContent='Die frühere Handyregelung wird bei der entsprechenden Frage erklärt.';
render(false);
