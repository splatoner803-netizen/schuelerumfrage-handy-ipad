# Schülerumfrage zur Handy- und iPad-Regelung

Responsive Umfrage für Klassen 5–10 und EF/Q1/Q2. Teilnahme ohne Anmeldung.

## Antworten absenden

Die Website sendet Antworten erst nach einem Klick auf „Antworten absenden“ per HTTPS an einen temporären Cloudflare-Tunnel zum PC der Umfrageleitung. Der dort laufende Server prüft und speichert sie in SQLite. Die Erfolgsmeldung erscheint erst nach bestätigter Speicherung. Bei Fehlern bleiben Antworten im Tab; unveränderte Wiederholungsversuche werden nicht doppelt gezählt.

Der PC und der Tunnel müssen laufen. `SURVEY_CONFIG.apiUrl` enthält die aktuelle Tunneladresse. Nach einem Neustart des Tunnels muss sie aktualisiert werden. GitHub Pages selbst speichert keine Antworten. Die nur lokal erreichbare Auswertung läuft getrennt auf Port 8788; der Tunnel führt ausschließlich zum Empfang auf Port 8787.

## Fragen und Datenschutz

Die bereitgestellte Forms-Vorlage dient als inhaltlicher Leitfaden. Die frühere Regelung ist darin beschrieben und wurde entsprechend übernommen. Neutrale Skalen, einzelne Klassenstufen und die Einhaltungsfrage nur für EF/Q1/Q2 bleiben erhalten. Ohne Handy keine persönlichen Handynutzungsfragen, ohne Tasche keine Taschenfolgefragen, ohne schulisch genutztes iPad keine iPad-Erfahrungsfragen. Veraltete Antworten werden entfernt und serverseitig abgewiesen.

Keine Namen, genaue Klassen, E-Mail-Adressen oder Gerätekennungen. Keine IP-Adressen oder Antwortzeiten in der Antwortdatenbank. Eine zufällige Kennung pro Versand ermöglicht sichere Wiederholungsversuche. Freitexte können unbeabsichtigt persönliche Angaben enthalten. GitHub und Cloudflare können technische Verbindungsdaten verarbeiten.

## Test und Export

Der Testbereich enthält drei Beispielwege und eine Verzweigungsprüfung. Abgesendete Tests werden getrennt gezählt und aus den normalen Ergebnisexporten ausgeschlossen. Eine eigene lokale CSV-/JSON-Kopie ersetzt kein Absenden. Optionales Browserspeichern erfolgt ausschließlich nach einem Klick. Ohne Anmeldung gibt es keine zuverlässige Begrenzung auf eine Teilnahme pro Person.

GitHub Pages veröffentlicht `main` aus dem Stammverzeichnis. Die Oberfläche verwendet keine externen Bibliotheken, Schriftarten oder Tracking-Skripte.
