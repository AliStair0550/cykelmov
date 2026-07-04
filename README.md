# Cykelmov v2

Cykelmov, gadens cykelbutik på Nørrebro. Version 2 er det eksisterende site
bygget om til **Astro** med et **Sanity-styret produktkatalog** og hosting på
**Cloudflare Pages**. Design, farver, typografi og den animerede cykelbane er
genbrugt 1:1 fra det oprindelige site.

- **Frontend:** Astro + TypeScript, statiske sider genereret ved build.
- **Indhold:** Sanity CMS (cykler + værkstedsydelser), hentet ved build-time.
- **Formularer:** Web3Forms (mail) + Sanity-mutation (overblik i Studio).
- **Hosting:** Cloudflare Pages. Ny cykel i Sanity → webhook → nyt build på ~30 sek.

---

## 1. Hvad projektet består af

```
cykelmov-v2/
├── src/                 Astro-site (frontend)
│   ├── layouts/         Hovedlayout med SEO, header og footer
│   ├── components/      Header, Footer, CykelKort, Filtre, galleri, modal m.m.
│   ├── pages/           Forside, cykler/, vaerksted/, om, kontakt, reserver + api/
│   ├── lib/             Sanity-klient, GROQ, datalag, typer og demo-data
│   └── styles/          global.css (designsystemet)
├── sanity/              Sanity Studio (indtastning) + seed-script
│   ├── schemas/         cykel, vaerkstedsydelse, foresporgsel
│   └── seed/seed.mjs    Opret 6 demo-cykler + 4 ydelser med billeder
├── public/              Statiske filer (billeder, favicon, robots.txt)
├── astro.config.mjs
├── tailwind.config.mjs
└── .env.example
```

**Demo-data:** Så længe Sanity ikke er konfigureret (eller er tomt), viser sitet
6 demo-cykler og 4 ydelser fra `src/lib/demo.ts`. Sitet står altså aldrig tomt,
heller ikke ved første deploy. Så snart Sanity har indhold, bruges det i stedet.

---

## 2. Lokal opsætning

Kræver Node 18+ og npm.

### Frontend (Astro)

```bash
# fra projektroden
npm install
cp .env.example .env      # udfyld værdier (kan køre uden – bruger demo-data)
npm run dev               # http://localhost:4321
```

### Sanity Studio

```bash
cd sanity
npm install
cp .env.example .env      # udfyld SANITY_STUDIO_PROJECT_ID
npm run dev               # http://localhost:3333
```

Har du ikke et Sanity-projekt endnu:

```bash
cd sanity
npx sanity login
npx sanity init --project-plan free   # opret projekt, vælg dataset "production"
# skriv det viste projectId ind i både sanity/.env og projektets .env
```

### Seed demo-indhold ind i Sanity

Uploader produktbilleder og opretter de 6 cykler + 4 ydelser:

```bash
cd sanity
SANITY_STUDIO_PROJECT_ID=dit_id SANITY_API_TOKEN=dit_token npm run seed
```

Tokenet oprettes i **Sanity Manage → API → Tokens** med rollen *Editor*.

---

## 3. Sådan tilføjer du en cykel (for butikken)

1. Gå til Studio (lokalt på `localhost:3333` eller det deployede
   `cykelmov.sanity.studio`) og log ind.
2. Klik **Cykler** i venstre menu, og tryk på det blå **+** (eller "Create").
3. Udfyld felterne:
   - **Titel** – fx "Kildemoes Street Herre, 7 gear".
   - **Slug** – tryk *Generate*, så laves den ud fra titlen.
   - **Køn** – Herre / Dame / Børn (bestemmer hvilken kategoriside cyklen vises på).
   - **Type** – Bycykel, Mountainbike, Elcykel osv. (bruges i filtrene).
   - **Brand**, **Pris**, evt. **Førpris** (giver en rabat-badge automatisk).
   - **Kort beskrivelse** – vises på kort og som intro (maks. 200 tegn).
   - **Lang beskrivelse** – fri tekst med overskrifter og punktlister.
   - **Billeder** – træk 1-6 fotos ind. Sæt gerne en **Alt-tekst** på hvert (godt for Google).
   - **Specifikationer** – gear, størrelser, vægt, farver (vises i tabellen).
   - **Status** – På lager / Kommer snart / Udsolgt.
   - **Fremhæv på forsiden** – slå til for at vise cyklen i "Nye i butikken".
4. Tryk **Publish** nederst.
5. Cloudflare bygger sitet automatisk (se webhook, afsnit 5). Efter ~30 sekunder
   er cyklen live på cykelmov.dk.

Værkstedsydelser tilføjes på samme måde under **Værkstedsydelser** (husk
*Rækkefølge* – lavere tal vises først).

**Forespørgsler:** Hver reservation fra sitet lander både som mail og som et
dokument under **Forespørgsler** i Studio, hvor status kan sættes til Ny,
Kontaktet eller Afsluttet.

---

## 4. Deploy til Cloudflare Pages

1. Push projektet til et GitHub-repo (se nederst).
2. Log ind på Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
3. Vælg repoet.
4. Byggeindstillinger:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Environment variables** (Settings → Environment variables) – kopier fra `.env`:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET` = `production`
   - `PUBLIC_SANITY_API_VERSION` = `2024-01-01`
   - `SANITY_API_TOKEN` (skrivetoken, kun til formularen)
   - `PUBLIC_WEB3FORMS_KEY`
   - `PUBLIC_SITE_URL` = `https://cykelmov.dk`
6. **Custom domain:** Pages → Custom domains → tilføj `cykelmov.dk`. Opret det
   viste CNAME hos Simply DNS (peg `www`/`@` mod Pages-adressen efter Cloudflares
   anvisning).
7. Deploy Studio: `cd sanity && npm run deploy` → tilgængeligt på
   `cykelmov.sanity.studio`.

Sitet er statisk med én dynamisk edge-funktion (`/api/reserver`), der håndteres
af `@astrojs/cloudflare`-adapteren. Ingen ekstra opsætning nødvendig.

---

## 5. Webhook: Sanity → nyt build

Så sitet bygger igen, hver gang butikken retter en cykel:

1. Cloudflare Pages → dit projekt → **Settings → Builds & deployments →
   Deploy hooks** → opret et hook (fx navn "sanity"), og **kopiér URL'en**.
2. **Sanity Manage** (manage.sanity.io) → dit projekt → **API → Webhooks →
   Create webhook**:
   - **URL:** indsæt Deploy Hook-URL'en fra Cloudflare.
   - **Trigger on:** Create, Update, Delete.
   - **Filter:** `_type == "cykel" || _type == "vaerkstedsydelse"`
     (så en indkommen forespørgsel ikke trigger et build).
   - **HTTP method:** POST.
3. Gem. Nu udløser hver publicering et nyt build, og ændringen er live på ~30 sek.

---

## 6. Miljøvariabler

| Variabel | Hvor | Beskrivelse |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Astro + Studio | Sanity-projektets ID |
| `PUBLIC_SANITY_DATASET` | Astro | Normalt `production` |
| `PUBLIC_SANITY_API_VERSION` | Astro | API-dato, fx `2024-01-01` |
| `SANITY_API_TOKEN` | Astro (server) + seed | Skrivetoken – kun til formular/seed |
| `PUBLIC_WEB3FORMS_KEY` | Astro | Web3Forms access key (samme som gl. site) |
| `PUBLIC_SITE_URL` | Astro | Fx `https://cykelmov.dk` |

`PUBLIC_`-variabler er synlige i browseren. `SANITY_API_TOKEN` er det **ikke** –
den bruges kun serverside i `/api/reserver`.

---

## 7. Fejlfinding

- **Sitet viser demo-cykler i stedet for mine egne.** `PUBLIC_SANITY_PROJECT_ID`
  mangler, eller datasettet er tomt. Tjek env-variablerne og at du har publiceret
  i Studio. Byggeloggen skriver `[data] … bruger demo-data`, hvis den falder tilbage.
- **Billeder mangler på produktsider.** Cyklen har ingen billeder i Sanity, eller
  seed-scriptet blev kørt uden adgang til `public/assets`. Kør `npm run seed` fra
  `sanity/`-mappen.
- **Formularen sender ikke mail.** `PUBLIC_WEB3FORMS_KEY` mangler i Cloudflare, eller
  nøglen er forkert. Tjek også spamfilteret første gang.
- **Forespørgsler dukker ikke op i Studio.** `SANITY_API_TOKEN` mangler eller har
  ikke skriverettigheder. Formularen sender stadig mail – kun Studio-overblikket
  påvirkes.
- **Ændring i Sanity slår ikke igennem på sitet.** Webhooken mangler, eller filteret
  matcher ikke. Udløs et manuelt build i Cloudflare for at teste.
- **Studio starter ikke.** Kør `npm install` i `sanity/`-mappen og tjek at
  `SANITY_STUDIO_PROJECT_ID` er sat i `sanity/.env`.

---

## Kommandoer

| Sted | Kommando | Gør |
|---|---|---|
| rod | `npm run dev` | Kør Astro lokalt |
| rod | `npm run build` | Byg til `dist/` |
| rod | `npm run preview` | Se det byggede site |
| sanity | `npm run dev` | Kør Studio lokalt |
| sanity | `npm run deploy` | Deploy Studio til sanity.studio |
| sanity | `npm run seed` | Seed demo-indhold |
