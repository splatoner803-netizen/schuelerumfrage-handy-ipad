# Schülerumfrage zur Handy- und iPad-Regelung

Deutschsprachige responsive Umfrage für die Klassen 5–10 und EF/Q1/Q2.

## Website

Diese statische Website benötigt für Teilnehmer keine Anmeldung. Sie kann über GitHub Pages oder lokal durch Öffnen von `index.html` verwendet werden.

## Antworten und Datenschutz

- Keine zentrale Erfassung oder Übermittlung von Antworten.
- Antworten bleiben zunächst im geöffneten Tab und werden beim Schließen oder Neuladen verworfen.
- Optionales Speichern erfolgt ausschließlich nach einem Klick im lokalen Browser.
- JSON- und CSV-Export am Ende; kein automatischer Versand an die Schule.
- Keine Namens-, E-Mail-, Gerätekennungs- oder genaue Klassenabfrage. Freitexte können dennoch versehentlich personenbezogene Angaben enthalten.
- GitHub verarbeitet beim Hosting technische Zugriffsdaten unabhängig vom Umfragecode.

Für eine zentrale Befragung muss zusätzlich ein geeignetes Backend oder ein entsprechend eingerichtetes Microsoft-Forms-Formular verwendet werden.

## Verzweigungen

Die Einhaltungsfrage erscheint nur für EF/Q1/Q2 mit Handy. Ohne Handy werden persönliche Handynutzungsfragen übersprungen. Ohne Tasche entfallen Taschenfragen; Schaden- und Kostenanzahl erscheinen nur bei gemeldeten Schäden. iPad-Erfahrungsfragen setzen ein schulisch genutztes iPad und eine passende Sperrregelung voraus. Nicht mehr passende Antworten werden entfernt.

Die frühere Handyregelung ist unbekannt. `SURVEY_CONFIG.oldRule` in `questions.js` bleibt leer; die entsprechende Frage wird übersprungen. Erst eine bestätigte Beschreibung eintragen, um sie zu aktivieren.

## Testen

Der Testbereich enthält drei Beispielwege und eine automatische Verzweigungsprüfung. Testexporte sind gekennzeichnet. Keine echten Antworten zum Testen verwenden.

## Veröffentlichung

GitHub Pages wird aus dem Branch `main` und dessen Stammverzeichnis bereitgestellt. `.nojekyll` kennzeichnet die Website als statische Dateien ohne Jekyll-Verarbeitung.

Die Website verwendet keine externen Schriftarten, Bibliotheken oder Tracking-Skripte.
