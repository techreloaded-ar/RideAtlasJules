# RideAtlas – Visione di Prodotto v0.4 (26 maggio 2025)

## 1. Elevator Pitch

Per i **motoviaggiatori over‑50**, spesso poco tecnologici ma desiderosi d’avventura, **RideAtlas** è una piattaforma **web e mobile** che permette di **scaricare percorsi certificati** o **creare itinerari personalizzati** senza doversi occupare di aspetti tecnici. Offre pacchetti curati da ranger che hanno davvero percorso quelle strade, completi di GPX, punti imperdibili, soste consigliate e strutture prenotabili. Quando il viaggiatore ha esigenze particolari (es. “9 notti in Slovacchia, tappe max 200 km”), il nostro Trip Builder AI genera un percorso su misura, integrando i POI scelti dall’utente. “**Noi lo facciamo per te. Tu guidi l’avventura.**”

---

## 2. Vision Board

| Sezione                 | Dettagli                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Segmenti target**     | • **Motociclista Base** (50‑60 anni, pigro tech, vuole pacchetti pronti)  • **Planner Personalizzato** (utente che fornisce parametri e vuole itinerario sartoriale)  • **Ranger/Editor** (esploratore che produce contenuti)  • **Admin**                                                                                                                                                                                        |
| **Problemi / Esigenze** | **Base**: ottenere velocemente una traccia affidabile, con info su cosa vedere, dove mangiare/dormire, senza doversi sbattere. **Planner**: definire parametri (date, durata, trasferimento ≤ X h, tappe ≤ Y km) e ricevere percorso ottimizzato con POI filtrabili (viola/verde/blu). **Ranger**: monetizzare/condividere i propri viaggi reali, mantenere reputazione. **Admin**: gestire utenti, ruoli, pagamenti e contenuti. |
| **Proposta di Valore**  | • Pacchetti "pronti all’uso" testati sul campo  • Trip Builder AI che adatta tracce esistenti o ne crea di nuove  • Libreria gratuita 1° anno → abbonamento mensile  • Booking integrato di strutture moto‑friendly                                                                                                                                                                                                               |
| **Differenziatori**     | 1. Percorsi realmente percorsi da ranger  2. Pacchetto base con POI, soste food‑&‑sleep verificate  3. Personalizzazione che tiene conto di tempi di guida, preferenze e tappe  4. L’utente rimane la “guida” della propria avventura                                                                                                                                                                                             |
| **Metriche Obiettivo**  | • 10 k utenti registrati alla fine del periodo free  • 3 k abbonati paganti a +12 mesi  • ARPU > €9/mese  • NPS ≥ 50  • 300 percorsi certificati                                                                                                                                                                                                                                                                                  |

---

## 3. Informazioni tecniche

**Obiettivo**: fornire linee guida d’architettura per stimare effort, scegliere stack e mantenere la flessibilità necessaria a evolvere il prodotto.

* **Next.js**: framework React per frontend/server rendering e routing efficiente
* **PostgreSQL** per lo  storage. Stringa connessione 
* **Prisma** come ORM
* **NextAuth.JS** – gestione autenticazione e identità (email, Apple/Google login, ACL)
* **TailwindCSS** – sistema utility-first per styling veloce e responsivo

---

## 4. Backlog – User Stories (v1 – 26 maggio 2025)

### Epic 1 – Browse & Download

#### US 1.1 – Registrazione rapida (SP 1)

*Come* motociclista
*Voglio* registrarmi via e‑mail, Apple o Google in ≤ 60 s
*Così* posso iniziare subito a usare la piattaforma.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Signup with email magic‑link
  Given I am an unauthenticated visitor
  When I enter a valid email address and submit the registration form
  Then I receive a confirmation email within 1 minute
  And when I click the magic‑link contained in the email
  Then I am redirected to my new dashboard authenticated
  And the whole process takes 60 seconds or less

Scenario: Signup with Apple ID
  Given I am an unauthenticated visitor
  When I select 'Continue with Apple' and complete the OAuth flow
  Then an account linked to my verified Apple email is created
  And I land on the dashboard authenticated within 60 seconds
```

#### US 1.2 – Consultazione libreria con filtri (SP 3)

*Come* motociclista
*Voglio* filtrare la libreria pubblica per destinazione, durata, difficoltà, tema e tipologia di strada/moto
*Così* posso vedere solo i viaggi che rispondono alle mie esigenze.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Filter by single criterion
  Given I am on the library page
  When I set the destination filter to 'Toscana'
  Then each card in the result list shows a trip whose destination equals 'Toscana'

Scenario: Combine multiple filters
  Given I have selected destination 'Toscana' and duration '< 5 giorni'
  When I apply the filters
  Then only trips matching both criteria are displayed
  And the total number of results is shown above the list

Scenario: No results edge case
  Given I activate a filter combination that matches no trip
  Then the list area shows the empty‑state illustration and the text 'Nessun viaggio trovato — prova a cambiare filtro'
```

#### US 1.3 – Dettaglio viaggio (SP 2)

*Come* motociclista
*Voglio* visualizzare il dettaglio di un singolo viaggio
*Così* posso capire se è di mio interesse.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: View trip detail
  Given I click on a trip card titled 'Val d'Orcia Classic'
  Then I am navigated to /viaggi/val-d-orcia-classic
  And the page shows the long description, gallery, embedded video player and the 'Scarica pacchetto' button
```

#### US 1.4 – Condivisione social (SP 1)

*Come* motociclista
*Voglio* condividere il viaggio sui social
*Così* posso far conoscere il percorso ad altri motociclisti.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Share on WhatsApp
  Given I am on the trip detail page
  When I click the WhatsApp share icon
  Then WhatsApp Web opens with a pre‑filled message containing the public preview URL
```

#### US 1.5 – Download pacchetto (SP 2)

*Come* motociclista
*Voglio* scaricare il pacchetto (GPX, POI, PDF)
*Così* posso consultarlo offline.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Download package successfully
  Given I am an authenticated user on a trip detail page
  When I click 'Scarica pacchetto'
  Then a ZIP file named '<slug>.zip' containing GPX, PDF and media_links.json starts downloading
```

### Epic 2 – Trip Builder personalizzato

#### US 2.1 – Impostazione parametri viaggio (SP 3)

*Come* motociclista planner
*Voglio* indicare durata, destinazione, trasferimento massimo e km/giorno
*Così* l'AI può generare un itinerario di base.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Create draft custom trip
  Given I am on the Trip Builder form
  When I enter '7' as durata_giorni, select 'Slovacchia' as destinazione, set trasferimento_max to '3h' and km_giorno to '250'
  And I press 'Genera'
  Then a draft trip with those constraints is created and shown in the builder canvas
```

#### US 2.2 – Selezione o modifica elementi (SP 5)

*Come* motociclista planner
*Voglio* aggiungere o rimuovere POI e segmenti proposti
*Così* il viaggio rispecchia i miei interessi.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Add POI from map
  Given I am editing a draft trip on the builder canvas
  When I click a POI icon colored 'verde' and hit 'Aggiungi al viaggio'
  Then the POI appears in the sidebar list under the correct day

Scenario: Remove segment
  Given a segment named 'Passo dello Stelvio' is in my itinerary
  When I click the trash icon next to that segment
  Then the segment is removed and total_km is recalculated
```

#### US 2.3 – Anteprima & conferma viaggio (SP 3)

*Come* motociclista planner
*Voglio* vedere un'anteprima riepilogativa del viaggio personalizzato
*Così* posso confermarne la coerenza.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Preview shows totals
  Given I have finished selecting elements
  When I click 'Anteprima'
  Then I see a modal with the map of the full route and a table of days, km per day and totali
  And the 'Conferma e salva' button is enabled
```

### Epic 3 – Ranger Content Management

#### US 3.1 – Creazione pacchetto base (SP 2)

*Come* ranger
*Voglio* creare un nuovo pacchetto impostando titolo, sommario e meta‑dati principali
*Così* posso proseguire con il caricamento dei contenuti.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Create draft package
  Given I am a logged‑in user with ranger role
  When I click 'Nuovo viaggio' and fill title, summary, area and duration
  Then a new package in stato 'Bozza' is stored and I am redirected to its edit page
```

#### US 3.2 – Upload media & tracce (SP 5)

*Come* ranger
*Voglio* caricare file GPX, immagini e video
*Così* posso arricchire il pacchetto.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Upload valid GPX and images
  Given my package is in stato 'Bozza'
  When I drag‑and‑drop a GPX file smaller than 20MB and three JPG images 1920×1080
  Then the files appear in the media gallery list with status 'In verifica'
```

#### US 3.3 – Assegnazione POI (SP 2)

*Come* ranger
*Voglio* assegnare POI direttamente sulla mappa
*Così* gli utenti li vedranno durante la pianificazione.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Create POI from long click
  Given I am in edit mode on the map tab
  When I long‑click on a location
  Then a POI form modal opens with lat/lon prefilled
```

#### US 3.4 – Assegnazione traccia GPX (SP 2)

*Come* ranger
*Voglio* associare una traccia GPX al viaggio
*Così* il percorso è georeferenziato.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Attach GPX to package
  Given I have uploaded a valid GPX file
  When I click 'Usa come traccia principale'
  Then the GPX is linked to the package and visible on the overview map
```

#### US 3.5 – Validazione automatica (SP 5)

*Come* ranger
*Voglio* che la piattaforma validi i file caricati
*Così* i contenuti rispettino gli standard.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: GPX with coordinate errors is rejected
  Given I upload a GPX with invalid waypoints
  Then the system marks the file as 'Errore' and shows the message 'Coordinate non valide alla riga 42'
```

#### US 3.6 – Creazione di POI o segmenti indipendenti (SP 3)

*Come* ranger
*Voglio* creare e pubblicare singoli **POI** o **segmenti GPX** non collegati a un viaggio specifico
*Così* gli utenti del Trip Builder possano arricchire i propri itinerari personalizzati.

**Criteri di accettazione (Gherkin)**

```gherkin
Scenario: Create a standalone POI
  Given I am on the 'Catalogo oggetti' page and have ranger role
  When I click 'Nuovo POI', set title to 'Castello di Spis', select category 'Cultura', upload a photo and click 'Salva'
  Then a new POI object in stato 'Bozza' is created
  And it appears in the list with the correct coordinates and thumbnail

Scenario: Publish POI after validation
  Given a POI in stato 'Bozza' has passed automatic validation
  When I click 'Pubblica'
  Then its stato changes to 'Pubblicato'
  And it becomes searchable in the Trip Builder within 15 minutes

Scenario: Upload and tag a GPX segment
  Given I am on the 'Segmenti' tab
  When I drag‑and‑drop a GPX file ≤ 30 km and enter description 'Panoramica Alta Tatra'
  Then the segment is stored, displayed on the mini‑map, and flagged 'In verifica'

Scenario: Delete an unpublished object
  Given I have a POI or segment in stato 'Bozza'
  When I click the delete icon and confirm
  Then the object is permanently removed from the catalog
```
