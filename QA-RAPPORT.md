# QA-rapport — Cykelmov v2

Fuld kvalitetssikring gennemført på det byggede Astro-site (alle sider),
verificeret med headless browser (Chrome/puppeteer) på reelle viewports samt
statisk analyse af build-output. Alle fund er rettet, medmindre andet er noteret.

Format: **[ID] Alvorlighed — fil — fund → rettelse**. Alvorlighed: Høj / Middel / Lav / Info.

> Bemærk: Flere punkter i checklisten beskriver den **gamle statiske prototype**
> (flertrins-booking med tilvalg, "Nørrebro-pakken", datovælger, ordrenummer,
> `brandguide.html`, footer dupликeret på 4 sider). v2 er en Astro-ombygning med
> et **ét-trins reservationsflow** (Web3Forms + Sanity) og delte komponenter.
> Disse punkter er markeret **N/A (findes ikke i v2)** med forklaring.

---

## 1. Funktionel gennemgang

- **[F1] Info** — Alle 41 interne links og ankre crawlet på tværs af alle sider: **0 døde links / forkerte stier**. Ingen `console`- eller `pageerror`-fejl på nogen side.
- **[F2] Middel** — `ReserverModal.astro` — Modalen manglede fokusstyring. → Fokus flyttes nu til første felt ved åbning, **fokusfælde** holder Tab/Shift+Tab inde i modalen, og fokus føres **tilbage til den udløsende knap** ved lukning (Escape/kryds/klik udenfor).
- **[F3] Middel** — `Layout.astro`, `global.css` — Formularen havde ingen loading-state, dobbeltindsendelses-værn eller netværks-fallback. → Submit fanges nu i JS: knap deaktiveres og viser "Sender …", `data-sender` forhindrer dobbelt POST, indsendelse via `fetch`. **Ved netværksfejl (offline)** vises en fejlbesked med telefonnummer (`31 72 78 88`). Uden JS falder den tilbage til native POST → redirect (progressiv forbedring). Verificeret offline i DevTools-emulering.
- **[F4] Info** — `api/reserver.ts` — Web3Forms-payload indeholder alle felter: Navn, Telefon, Email, Vedrører, Ønsket tid, Besked, Type + honeypot. Verificeret i koden.
- **[F5] N/A (findes ikke i v2)** — Flertrins-booking, tilvalg til/fra, "Nørrebro-pakken" der fjerner enkeltdele, datovalg der nulstiller tidsvalg, disabled "næste"-knap, ordrenummer. v2's booking er ét trin (navn/telefon/e-mail/ønsket tid/besked). Modal-state (valgt objekt, ikon, pris, titel) sættes korrekt ved hver åbning.
- **[F6] Info** — Åbningstider: søndag vises som "Lukket", lørdag med kortere tid. Der er ingen datovælger i v2, så "dagens dato / sen aften"-datologik er N/A.

## 2. Responsivt design

Testet på 320, 360, 375, 414, 768, 1024, 1440 og 1920 px.

- **[R1] Høj** — `global.css` — **Vandret overflow** på 320–768 px. Årsager og rettelser:
  - Desktop-navigationen var for bred ved ~768 px (burger kom først ≤680) → **burger nu ≤860 px**.
  - Store overskrifter (`display-xl/l`) havde for høj min-fontstørrelse på smalle skærme → reduceret `clamp()`-min + `overflow-wrap:break-word` på overskrifter.
  - Kontaktkort og footer med ubrydelig e-mail/adresse tvang bredden → `overflow-wrap:anywhere` + `min-width:0` på grid-/flex-børn.
  - `html{overflow-x:clip}` som sikkerhedsnet (bryder ikke sticky header eller fixed modal). **Resultat: ingen vandret scroll muligt på nogen side/breakpoint.**
- **[R2] Middel** — `global.css` — Små knapper var 39 px høje (< 44 px touch target). → `min-height:44px` på `.btn`; lukkeknap i modal 44×44.
- **[R3] Middel** — `global.css` — Mobil-nav-links arvede lys tekst på den mørke herre/værksted-header, hvilket ville være usynligt på den lyse dropdown. → `color:var(--asfalt)` på mobil-nav-links.
- **[R4] Info** — Burger på mørk baggrund (herre) har korrekt lys farve. Burger får `aria-expanded`, og mobilmenuen lukker ved klik på et link.
- **[R5] Info** — Modal på mobil: scroller internt (`overflow-y:auto`, `max-height:92vh`), låser body under åbning og **frigiver body efter lukning**. Modalen er fuld bredde og interaktiv ved 320 px. Verificeret.

## 3. Tilgængelighed (WCAG AA)

- **[A1] Middel** — `global.css` — "Spar"-tekst i dame-universet var hindbær på hvid (~3:1, under 4,5:1). → Ny mørkere `--hindbaer-dyb: #C42B62` (~5:1).
- **[A2] Middel** — `global.css` — Manglende garanteret synligt tastaturfokus. → `:focus-visible`-outline (3 px cobalt) på alle interaktive elementer + formfelter.
- **[A3] Middel** — Fokusfælde + fokus-retur i modal (se F2).
- **[A4] Info** — `prefers-reduced-motion: reduce` slår **alle** animationer fra via `*{animation:none!important}` (ticker, kenburns, rytter, by-animation, scroll-reveal, hjul). Verificeret at reglen dækker de nye komponenter.
- **[A5] Info** — Præcis **ét `<h1>` pr. side** på alle 11 sider, ingen spring i overskriftsniveauer.
- **[A6] Info** — Alle `<img>` har alt-tekst. Dekorative SVG'er og ticker har `aria-hidden`. Alle formfelter har `<label>`. Modal har `role="dialog"`, `aria-modal`, `aria-labelledby`.
- **[A7] Info / til overvejelse** — Stjernerating er signalgul på hvid (lav kontrast). Det er et **konventionelt rating-grafikelement** (gule stjerner), ikke brødtekst, og bevaret som standard. Kan gøres mørkere hvis ønsket.

## 4. Performance

- **[P1] Høj** — `public/assets/IMG_4312.jpeg`, `index.astro` — Besøgsfotoet var **~7 MB** uden width/height. → Optimeret til **269 KB** (1200 px) + `width/height` (undgår layout shift). Havde allerede `loading="lazy"`.
- **[P2] Høj** — `public/assets/hero-butik.jpg` — Hero-baggrund **733 KB**. → **296 KB** (under 300 KB-målet). Billedet ligger bag mørk gradient/vignette + filtre, så hård komprimering er ikke synlig.
- **[P3] Lav** — `Billedgalleri.astro`, `ReserverModal.astro` — Manglende `width/height` på galleri-fallback og modal-thumbnail. → Tilføjet.
- **[P4] Middel** — `global.css`, `CykelGennemByen.astro` — Hero-rytteren animerede `left` (layout-property). → Konverteret til `transform:translateX` (GPU). Ticker (`translateX`), kenburns (`transform`), hjul (`rotate`), bob (`translateY`) og skyline (`translateX`) kører allerede på GPU. Undtagelse: de 3 dekorative Toy Story-skyer driver via `left` — bevidst valg for korrekt indramning; forsvindende omkostning (3 små, absolut-positionerede elementer, ~50 s cyklus).
- **[P5] Info** — Fonte er allerede minimale: Bricolage 800, Schibsted 400/700, Space Grotesk 500/700 — alle vægte er i brug. Ingen ubrugte vægte at fjerne.
- **[P6] Info** — WebP med JPEG-fallback for CSS-baggrunde kræver `image-set()`; da alle assets nu er godt under budget som optimeret JPEG, er kompleksiteten fravalgt. Produkt-/galleribilleder har `width/height` + `loading="lazy"`.

## 5. SEO & teknisk

- **[S1] Info** — Al JSON-LD parset og **gyldig** på alle sider (BicycleStore/LocalBusiness, ItemList, Product, Service, FAQPage). Product-schema-pris matcher den viste pris (fx Trek Marlin 5: `"price":5499` = "5.499 kr.").
- **[S2] Info** — Unikke `title`/`description` pr. side, `lang="da"`, korrekt `canonical` (absolut, med efterstillet skråstreg).
- **[S3] Info** — Fuldt OG-sæt (type, site_name, title, description, url, image, locale) + Twitter-card (card, title, description, image) på **alle** sider via `Layout`.
- **[S4] Info** — `sitemap-index.xml` (+ `sitemap-0.xml`) auto-genereret; `robots.txt` med `Sitemap:`-henvisning; favicon som SVG (hjul-symbolet).
- **[S5] N/A (findes ikke i v2)** — `brandguide.html` med noindex/sitemap-eksklusion. Filen findes ikke i v2 (den lå i den gamle statiske prototype).

## 6. Kodekvalitet

- **[C1] Info** — Ingen **duplikerede id'er** på nogen side; HTML valid (Astro-genereret); **ingen console-fejl** på nogen side.
- **[C2] Info / bedre end antaget** — Footer/Header/Modal er **delte Astro-komponenter**, ikke duplikeret på 4 sider. Dermed er de per definition identiske (enkelt kilde).
- **[C3] Info** — Ingen lækkende globale variabler. Modal- og formular-listeners tilføjes én gang (Layout kører én gang pr. side); modalens åbne/luk bruger en enkelt delegeret `document`-listener, så listeners **ikke stakkes** ved genåbning.
- **[C4] Info** — Ingen udråbstegn i sitens **egne** tekster. Google-anmeldelserne er citater; her er de fleste udråbstegn fjernet, og en åbenlys tastefejl rettet ("Ejeren **af**" → "Ejeren **er**").

## 7. Indholdskonsistens

- **[CC1] Info** — Priser kommer fra **én kilde** (Sanity, med demo-fallback). Product/ItemList-schema og de viste priser trækker fra samme felt. Rabatprocent (`rabatProcent`) og "Spar"-beløb (`foerpris − pris`) er **udregnet fra samme data** → matematisk konsistente pr. konstruktion.
- **[CC2] Info** — Åbningstider kommer fra `site.ts` og bruges i forside, kontaktside og JSON-LD → identiske.
- **[CC3] Info** — Telefon og adresse kommer fra `site.ts` (inkl. `tel:`-links) → identiske på alle sider.

### Kræver bekræftelse fra ejer

- **[CC4]** — Der ligger **live-redigeret testdata** i Sanity: en **"TEST"-damecykel** (med et personfoto, -50 %) og **Kildemoes Logic Dame El** med prisen ændret til **5.000 kr.** (førpris 18.999 → -74 %). Dette er ejerens egne indtastninger i CMS'et, ikke en kodefejl. **Anbefaling:** Slet "TEST" og bekræft/ret Kildemoes Logic-prisen i Studio inden go-live. (Rabat-matematikken er korrekt uanset: 18.999 − 5.000 = Spar 13.999 = -74 %.)

---

## Anden gennemgang (verifikation)

Hele checklisten kørt igen efter rettelserne:

| Område | Resultat |
|---|---|
| Interne links (41) | ✅ 0 døde |
| Console/page-fejl (alle sider) | ✅ Ingen |
| Modal: fokus ved åbning / Escape / fokus-retur | ✅ Bestået |
| Formular offline-fallback (telefon vises) | ✅ Bestået |
| Vandret overflow 320–1920 px | ✅ Ingen scroll muligt |
| Touch targets ≥ 44 px | ✅ Bestået |
| Sticky header + modal ved 320 px m. clip | ✅ Bestået |
| JSON-LD gyldighed (alle sider) | ✅ Gyldig |
| Ét h1 pr. side | ✅ Bestået |
| OG/Twitter/canonical alle sider | ✅ Til stede |
| Pris = Product-schema | ✅ Match |

**Anden gennemgang bestået.** Alle rettede fund verificeret; resterende punkter er enten N/A (funktioner der ikke findes i v2) eller markeret til ejer-bekræftelse (CC4).
