/* Gemeinsamer Fragenkatalog. IDs entsprechen den Nummern im Forms-Import. */
const SURVEY_CONFIG = { version: '2.0', apiUrl: 'https://substantially-invite-sail-broker.trycloudflare.com', oldRule: "Handys durften nur ausgeschaltet im Ranzen mitgeführt werden. Bei unerlaubter Nutzung wurden sie direkt abgenommen. Ab Klasse 7 war die Nutzung in den Pausen erlaubt." };
const UNKNOWN = 'Kann ich nicht beurteilen';
const YESNO = ['Ja', 'Nein'];
const EFFECT = ['Sehr positiv', 'Eher positiv', 'Weder positiv noch negativ', 'Eher negativ', 'Sehr negativ', UNKNOWN];
const COMPARE = 'Kann ich nicht vergleichen (z. B. erst seit Kurzem an dieser Schule)';
const FREQUENCY = ['Nie', 'Einmal', '2–3 Mal', '4–5 Mal', '6 Mal oder häufiger', 'Weiß ich nicht', 'Trifft nicht zu'];
const QUESTIONS = [
 {id:1, group:'Einstieg', title:'Welche Klassenstufe besuchst du?', options:['5','6','7','8','9','10','EF','Q1','Q2'], required:true},
 {id:2, group:'Dein Handy', title:'Besitzt du ein Handy?', options:YESNO, required:true, hint:'Ein Smartphone zählt auch als Handy.'},
 {id:3, group:'Dein Handy', title:'Wie oft hast du dich in den letzten vier Schulwochen an die geltende Handyregelung gehalten?', options:['Immer','Meistens','Manchmal','Selten','Nie','Die Regelung ist mir nicht klar','Ich hatte in dieser Zeit kein Handy dabei'], required:true, hint:'Diese Frage wird zunächst nur in der Oberstufe gestellt. Gemeint ist die Handyregelung, die für dich an deiner Schule gilt.'},
 {id:4, group:'Dein Handy', title:'Besitzt du ein Handy?', options:YESNO, required:true, hint:'Ein Smartphone zählt auch als Handy.'},
 {id:5, group:'Handytasche', title:'Hast du eine Handytasche für die Handyregelung an deiner Schule?', options:YESNO, required:true, hint:'Gemeint ist die Tasche, die zur schulischen Handyregelung gehört, nicht eine normale Schutzhülle.'},
 {id:6, group:'Handytasche', title:'Ist seit Einführung der Handytaschenregelung mindestens eine deiner Handytaschen kaputt gegangen?', options:['Ja','Nein','Weiß ich nicht'], required:true},
 {id:7, group:'Handytasche', title:'Wie viele deiner Handytaschen sind seit Einführung der Handytaschenregelung insgesamt kaputt gegangen?', type:'number', min:1, hint:'Ganze Zahl. Lass das Feld leer, wenn du es nicht weißt.'},
 {id:8, group:'Handytasche', title:'Bei wie vielen dieser kaputten Handytaschen hat die Schule die Kosten für Reparatur oder Ersatz übernommen?', type:'number', min:0, hint:'Ganze Zahl, auch 0 ist möglich. Zähle volle und teilweise Kostenübernahmen durch die Schule zusammen. Leer lassen, wenn du es nicht weißt.'},
 {id:9, group:'Dein Handy', title:'Wenn die frühere Handyregelung wieder gelten würde: Würdest du dich aus heutiger Sicht daran halten?', options:['Auf jeden Fall','Eher ja','Eher nein','Auf keinen Fall','Ich kenne die frühere Regelung nicht gut genug',UNKNOWN], hint:'Frühere Handyregelung laut bereitgestellter Forms-Vorlage: Handys durften nur ausgeschaltet im Ranzen mitgeführt werden. Bei unerlaubter Nutzung wurden sie direkt abgenommen. Ab Klasse 7 war die Nutzung in den Pausen erlaubt. Wenn du sie nicht erlebt hast, wähle die entsprechende Antwort.'},
 {id:10, group:'Dein Handy', title:'Wie viel möchtest du selbst entscheiden dürfen, wann und wie du dein Handy in der Schule nutzt?', options:['Deutlich mehr als bisher','Etwas mehr als bisher','Genauso viel wie bisher','Etwas weniger als bisher','Deutlich weniger als bisher',UNKNOWN]},
 {id:11, group:'Dein Handy', title:'Wie hat sich die Zeit verändert, die du außerhalb der Schule am Handy verbringst, seit die aktuelle Handyregelung gilt?', options:['Deutlich weniger','Etwas weniger','Ungefähr gleich viel','Etwas mehr','Deutlich mehr',COMPARE], hint:'Denke zum Beispiel an die Zeit am Handy zu Hause. Eine Veränderung muss nicht durch die Handyregelung verursacht worden sein.'},
 {id:12, group:'Schulalltag', title:'Wie wirkt sich die aktuelle Handyregelung deiner Meinung nach auf das Miteinander an der Schule aus?', options:EFFECT, hint:'Zum Beispiel darauf, wie freundlich Schüler und Schülerinnen miteinander umgehen.'},
 {id:13, group:'Schulalltag', title:'Warum schätzt du die Wirkung auf das Miteinander so ein?', type:'text', hint:'Optional. Bitte keine Namen oder erkennbaren Beschreibungen einzelner Personen nennen.'},
 {id:14, group:'Schulalltag', title:'Wie wirkt sich die aktuelle Handyregelung deiner Meinung nach darauf aus, wie wohl sich Schüler und Schülerinnen in der Schule fühlen?', options:EFFECT},
 {id:15, group:'Schulalltag', title:'Welche Schwierigkeiten oder Nachteile sind dir bei der aktuellen Handyregelung aufgefallen?', type:'text', hint:'Optional. Wenn dir keine aufgefallen sind, kannst du das schreiben oder das Feld leer lassen. Bitte keine Personen nennen.'},
 {id:16, group:'Schulalltag', title:'Welche Vorteile sind dir bei der aktuellen Handyregelung aufgefallen?', type:'text', hint:'Optional. Wenn dir keine aufgefallen sind, kannst du das schreiben oder das Feld leer lassen. Bitte keine Personen nennen.'},
 {id:17, group:'Schulalltag', title:'Wie gut kannst du dich im Unterricht konzentrieren, seit die aktuelle Handyregelung gilt?', options:['Viel besser als vorher','Etwas besser als vorher','Ungefähr genauso gut wie vorher','Etwas schlechter als vorher','Viel schlechter als vorher',COMPARE], hint:'Denke an den Vergleich mit der Zeit vor Einführung der Regelung.'},
 {id:18, group:'Schulalltag', title:'Verbringst du seit Einführung der aktuellen Handyregelung in den Pausen mehr oder weniger Zeit direkt mit anderen?', options:['Viel mehr als vorher','Etwas mehr als vorher','Ungefähr gleich viel wie vorher','Etwas weniger als vorher','Viel weniger als vorher',COMPARE], hint:'Zum Beispiel: miteinander reden, spielen oder etwas gemeinsam unternehmen.'},
 {id:19, group:'Dein iPad', title:'Hast du ein iPad, das du für die Schule nutzt?', options:['Ja, ein eigenes iPad','Ja, ein geliehenes oder von der Schule bereitgestelltes iPad','Nein'], required:true},
 {id:20, group:'Dein iPad', title:'Gilt für dieses iPad eine schulische Regelung zur Sperrung von Funktionen oder Apps?', options:['Ja','Nein','Weiß ich nicht'], required:true},
 {id:21, group:'Dein iPad', title:'Wie oft war dein iPad in den letzten vier Schulwochen zu Hause gesperrt, obwohl es nach der schulischen Regelung nutzbar sein sollte?', options:FREQUENCY, hint:'Gemeint sind unerwartete Sperren durch die schulische Verwaltung, nicht ein vergessener Gerätecode. Eine durchgehende Sperre zählt als ein Vorfall.'},
 {id:22, group:'Dein iPad', title:'Wie oft war dein iPad in den letzten vier Schulwochen im Unterricht gesperrt, obwohl es in dieser Stunde nach der schulischen Regelung nutzbar sein sollte?', options:FREQUENCY, hint:'Gemeint sind unerwartete Sperren durch die schulische Verwaltung. Eine durchgehende Sperre zählt als ein Vorfall.'},
 {id:23, group:'Dein iPad', title:'Wie wohl fühlst du dich mit der schulischen iPad-Regelung zur Sperrung von Funktionen oder Apps?', options:['Sehr wohl','Eher wohl','Weder wohl noch unwohl','Eher unwohl','Sehr unwohl',UNKNOWN]},
 {id:24, group:'Dein iPad', title:'Was möchtest du zur iPad-Regelung noch sagen?', type:'text', hint:'Optional. Zum Beispiel Vorteile, Probleme oder Wünsche. Bitte keine Namen, Gerätekennungen oder andere persönlichen Daten nennen.'},
 {id:25, group:'Abschluss', title:'Was möchtest du zur Handy- oder iPad-Regelung noch mitteilen oder in der Schulkonferenz ansprechen lassen?', type:'text', hint:'Optional. Bitte keine Namen, Kontaktdaten, genaue Klasse (z. B. 7b) oder Beschreibungen, an denen einzelne Personen erkennbar sind.'}
];
function isOS(a) { return ['EF','Q1','Q2'].includes(a[1]); }
function hasPhone(a) { return a[isOS(a)?2:4] === 'Ja'; }
function nextQuestion(id,a,oldRule=SURVEY_CONFIG.oldRule) {
 const personalStart = oldRule.trim() ? 9 : 10;
 if(id===1) return isOS(a)?2:4;
 if(id===2) return a[2]==='Ja'?3:12;
 if(id===3) return 5;
 if(id===4) return a[4]==='Ja'?5:12;
 if(id===5) return a[5]==='Ja'?6:personalStart;
 if(id===6) return a[6]==='Ja'?7:personalStart;
 if(id===8) return personalStart;
 if(id===19) return [QUESTIONS[18].options[0],QUESTIONS[18].options[1]].includes(a[19])?20:25;
 if(id===20) return a[20]==='Ja'?21:25;
 return id===25 ? null : id+1;
}
function activePath(a,oldRule=SURVEY_CONFIG.oldRule) {
 const path=[]; let id=1;
 while(id!==null) {path.push(id); const q=QUESTIONS[id-1]; if(q.required && !a[id]) break; id=nextQuestion(id,a,oldRule);}
 return path;
}
function cleanAnswers(a,oldRule=SURVEY_CONFIG.oldRule) {
 const clean={}; activePath(a,oldRule).forEach(id=>{if(a[id]!==undefined && a[id]!=='') clean[id]=a[id];}); return clean;
}
function validationError(q,value,a) {
 if(q.required && !value) return 'Bitte wähle eine Antwort.';
 if(q.type==='number' && value!=='' && value!==undefined) {
  if(!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value)<q.min) return `Bitte gib eine ganze Zahl ab ${q.min} ein oder lass das Feld leer.`;
  if(q.id===8 && a[7]!==undefined && a[7]!=='' && Number(value)>Number(a[7])) return 'Die Anzahl übernommener Fälle darf nicht höher sein als die Anzahl kaputter Taschen.';
 }
 if(q.options && value && !q.options.includes(value)) return 'Bitte wähle eine angebotene Antwort.';
 if(q.type==='text' && value && value.length>1500) return 'Bitte kürze deinen Text auf höchstens 1500 Zeichen.';
 return '';
}
if(typeof module!=='undefined') module.exports={QUESTIONS,SURVEY_CONFIG,activePath,cleanAnswers,nextQuestion,validationError};
