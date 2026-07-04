// ============================================================
// Seed-script til Cykelmov. Uploader produktbilleder og opretter
// 6 demo-cykler + 4 værkstedsydelser i Sanity.
//
// Kør fra sanity/-mappen:
//   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_API_TOKEN=yyyy npm run seed
//
// Token skal have skriverettigheder (rollen "Editor" i Sanity Manage).
// Billederne hentes fra ../../public/assets.
// ============================================================
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Mangler SANITY_STUDIO_PROJECT_ID og/eller SANITY_API_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', '..', 'public', 'assets');

// ---- Portable Text-hjælpere (med stabile _key'er) ----
let k = 0;
const key = () => `k${k++}`;
const p = (t) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text: t, marks: [] }] });
const h3 = (t) => ({ _type: 'block', _key: key(), style: 'h3', markDefs: [], children: [{ _type: 'span', _key: key(), text: t, marks: [] }] });
const li = (t) => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: key(), text: t, marks: [] }] });

// ---- Billed-upload med cache pr. filsti ----
const cache = new Map();
async function uploadAsset(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);
  const buf = readFileSync(join(assetsDir, relPath));
  const filename = relPath.split('/').pop();
  console.log('  uploader', relPath, '…');
  const asset = await client.assets.upload('image', buf, { filename });
  cache.set(relPath, asset._id);
  return asset._id;
}
async function billede(relPath, alt) {
  const ref = await uploadAsset(relPath);
  return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: ref }, alt };
}

// ---- Cykler ----
const cyklerData = [
  {
    _id: 'cykel-kildemoes-street-herre',
    titel: 'Kildemoes Street Herre, 7 gear',
    slug: 'kildemoes-street-herre-7-gear',
    koen: 'herre',
    type: 'by',
    brand: 'Kildemoes',
    pris: 4999,
    foerpris: 5799,
    kortBeskrivelse:
      'Klassisk dansk bycykel med 7 indvendige Shimano-gear, fodbremse og let alu-stel. Bygget til daglig pendling på brostenene.',
    langBeskrivelse: [
      p('Kildemoes Street er pendlerens arbejdshest. Det lette aluminiumsstel gør den nem at trække op ad trappen, og de indvendige Shimano Nexus-gear kræver stort set ingen vedligeholdelse.'),
      h3('Til hverdagen på Nørrebro'),
      p('Oprejst siddestilling, brede dæk med refleks og fuld skærmpakke. Cyklen leveres med lås, lygter og bagagebærer, monteret og klar til at køre fra butikken.'),
      li('Vedligeholdelsesfrie Shimano Nexus-navgear'),
      li('Fodbremse plus håndbremse foran'),
      li('Kevlar-dæk med refleks efter dansk lov'),
    ],
    billeder: [['produkter/herre-movi.jpg', 'Kildemoes Street herrecykel i mat sort'], ['produkter/herre-dutch.jpg', 'Kildemoes Street set fra siden']],
    specifikationer: { gear: '7 gear Shimano Nexus', stoerrelser: ['51 cm', '55 cm', '59 cm'], vaegt: 16.5, farver: ['Mat sort', 'Petrol'] },
    status: 'paa_lager',
    fremhaev: true,
  },
  {
    _id: 'cykel-trek-marlin-5',
    titel: 'Trek Marlin 5',
    slug: 'trek-marlin-5',
    koen: 'herre',
    type: 'mountainbike',
    brand: 'Trek',
    pris: 5499,
    foerpris: null,
    kortBeskrivelse: 'Robust hardtail til grus, skov og bykant. Aluminiumsstel, luftaffjedret forgaffel og 2x8 Shimano-gear.',
    langBeskrivelse: [
      p('Trek Marlin 5 er indgangen til rigtig mountainbike. Den holder til en tur i Dyrehaven i weekenden og til daglig pendling på asfalt resten af ugen.'),
      h3('Alt-terræn uden dikkedarer'),
      p('Forgaflen tager stødene fra brosten og trærødder, og de brede dæk giver greb i grus. Skivebremser sikrer opbremsning, også når det er vådt.'),
      li('Alpha Silver aluminiumsstel'),
      li('16 gear Shimano Altus'),
      li('Mekaniske skivebremser for og bag'),
    ],
    billeder: [['produkter/herre-oscar.jpg', 'Trek Marlin 5 mountainbike'], ['produkter/herre-fixie.jpg', 'Trek Marlin 5 detalje']],
    specifikationer: { gear: '16 gear Shimano Altus', stoerrelser: ['S', 'M', 'L', 'XL'], vaegt: 14.2, farver: ['Sort', 'Rød'] },
    status: 'paa_lager',
    fremhaev: true,
  },
  {
    _id: 'cykel-mbk-bianca',
    titel: 'MBK Bianca, 7 gear',
    slug: 'mbk-bianca-7-gear',
    koen: 'dame',
    type: 'by',
    brand: 'MBK',
    pris: 3799,
    foerpris: 4299,
    kortBeskrivelse: 'Elegant damecykel med lav indstigning, kurv og komfortsadel. 7 gear til byens bakker og broer.',
    langBeskrivelse: [
      p('MBK Bianca er den nette bycykel med lav indstigning, så du let kommer på og af, også med nederdel eller frakke. Frontkurven tager taske og indkøb.'),
      h3('Komfort hele vejen'),
      p('Gelsadel, ergonomiske greb og oprejst styr gør turen behagelig. 7 gear giver overskud på broerne uden at gøre cyklen tung.'),
      li('Lav indstigning'),
      li('Frontkurv og bagagebærer inkluderet'),
      li('7 gear Shimano med håndbremser'),
    ],
    billeder: [['produkter/dame-merla.jpg', 'MBK Bianca damecykel i creme'], ['produkter/dame-liva.jpg', 'MBK Bianca med kurv']],
    specifikationer: { gear: '7 gear Shimano', stoerrelser: ['50 cm', '54 cm'], vaegt: 17, farver: ['Creme', 'Dueblå'] },
    status: 'paa_lager',
    fremhaev: true,
  },
  {
    _id: 'cykel-kildemoes-logic-el',
    titel: 'Kildemoes Logic Dame El',
    slug: 'kildemoes-logic-elcykel-dame',
    koen: 'dame',
    type: 'elcykel',
    brand: 'Kildemoes',
    pris: 16999,
    foerpris: 18999,
    kortBeskrivelse: 'Elcykel med midtermotor, trinløst gear og lang rækkevidde. Byens bakker forsvinder under dig.',
    langBeskrivelse: [
      p('Kildemoes Logic med midtermotor giver et roligt, naturligt skub, uanset om du kører mod vind over Dronning Louises Bro eller er tungt lastet hjem fra Netto.'),
      h3('Rækkevidde til hele ugen'),
      p('Batteriet holder op til 100 km på en opladning, afhængigt af niveau og terræn. Det trinløse Enviolo-gear skifter blødt, også når du holder stille.'),
      li('Midtermotor med 5 understøtningsniveauer'),
      li('Enviolo trinløst gear'),
      li('Integreret lys og aflåseligt batteri'),
    ],
    billeder: [['produkter/dame-single.jpg', 'Kildemoes Logic elcykel til dame'], ['produkter/dame-liva.jpg', 'Kildemoes Logic detalje']],
    specifikationer: { gear: 'Enviolo trinløs', stoerrelser: ['48 cm', '52 cm'], vaegt: 24, farver: ['Sart grøn', 'Mørk grå'] },
    status: 'kommer_snart',
    fremhaev: false,
  },
  {
    _id: 'cykel-mbk-troll-20',
    titel: 'MBK Troll 20 tommer',
    slug: 'mbk-troll-20',
    koen: 'boern',
    type: 'by',
    brand: 'MBK',
    pris: 2299,
    foerpris: null,
    kortBeskrivelse: 'Solid børnecykel til 6-9-årige. 20 tommer hjul, fodbremse og støttehjul med i købet.',
    langBeskrivelse: [
      p('MBK Troll er den første rigtige cykel. Lav standover-højde gør den tryg at lære på, og fodbremsen er nem for små ben.'),
      h3('Klar til skolevejen'),
      p('Fuld skærm, kædeskærm og refleks efter loven. Støttehjul følger med og kan tages af, når barnet er klar.'),
      li('20 tommer hjul til ca. 6-9 år'),
      li('Fodbremse plus håndbremse'),
      li('Støttehjul inkluderet'),
    ],
    billeder: [['produkter/herre-fixie.jpg', 'MBK Troll børnecykel 20 tommer']],
    specifikationer: { gear: '1 gear med fodbremse', stoerrelser: ['20 tommer'], vaegt: 11, farver: ['Blå', 'Pink'] },
    status: 'paa_lager',
    fremhaev: false,
  },
  {
    _id: 'cykel-kildemoes-bikerz-24',
    titel: 'Kildemoes Bikerz 24 tommer, 7 gear',
    slug: 'kildemoes-bikerz-24',
    koen: 'boern',
    type: 'mountainbike',
    brand: 'Kildemoes',
    pris: 3199,
    foerpris: 3599,
    kortBeskrivelse: 'Junior-mountainbike med 7 gear og skivebremser. Til de 8-12-årige, der vil have fart på.',
    langBeskrivelse: [
      p('Kildemoes Bikerz er en rigtig junior-mountainbike, ikke en legetøjscykel. 7 gear og skivebremser giver barnet kontrol på både grus og asfalt.'),
      h3('Vokser med barnet'),
      p('Sadel og styr kan justeres i højden, så cyklen følger med de første par år. Robuste 24 tommer dæk klarer både fortovskant og skovsti.'),
      li('24 tommer hjul til ca. 8-12 år'),
      li('7 gear Shimano'),
      li('Mekaniske skivebremser'),
    ],
    billeder: [['produkter/herre-oscar.jpg', 'Kildemoes Bikerz junior-mountainbike 24 tommer']],
    specifikationer: { gear: '7 gear Shimano', stoerrelser: ['24 tommer'], vaegt: 12.5, farver: ['Sort/lime'] },
    status: 'paa_lager',
    fremhaev: false,
  },
];

// ---- Værkstedsydelser ----
const ydelserData = [
  {
    _id: 'ydelse-serviceeftersyn',
    navn: 'Serviceeftersyn',
    slug: 'serviceeftersyn',
    kategori: 'service',
    fraPris: 499,
    estimeretTid: 'Samme dag',
    beskrivelse: [
      p('Fuld gennemgang af gear, bremser, kæde, hjul og lys. Vi strammer, justerer og smører, og fortæller ærligt, hvad der eventuelt trænger til udskiftning, før vi gør noget.'),
      li('Justering af gear og bremser'),
      li('Kontrol af kæde, eger og dæk'),
      li('Test af lys og reflekser'),
    ],
    billede: ['vaerksted-vaerktoej.jpg', 'Værktøj i Cykelmovs værksted'],
    raekkefolge: 1,
  },
  {
    _id: 'ydelse-slangeskift',
    navn: 'Slangeskift',
    slug: 'slangeskift',
    kategori: 'daek',
    fraPris: 249,
    estimeretTid: 'Mens du venter',
    beskrivelse: [p('Ny slange monteret, mens du venter. Kan slangen lappes, klarer vi det for 99 kr. Dæk afregnes til dagspris, og du får altid prisen at vide først.')],
    billede: ['vaerksted-daek.jpg', 'Cykeldæk på lager i værkstedet'],
    raekkefolge: 2,
  },
  {
    _id: 'ydelse-gearjustering',
    navn: 'Gearjustering',
    slug: 'gearjustering',
    kategori: 'reparation',
    fraPris: 149,
    estimeretTid: '30-45 min',
    beskrivelse: [p('Indvendige og udvendige gear stilles præcist ind, inklusive stramning af kabler. Skifter dine gear dårligt eller hopper de, er det som regel her, løsningen ligger.')],
    billede: null,
    raekkefolge: 3,
  },
  {
    _id: 'ydelse-elcykel-service',
    navn: 'Elcykel-service',
    slug: 'elcykel-service',
    kategori: 'elcykel',
    fraPris: 699,
    estimeretTid: '1-2 dage',
    beskrivelse: [
      p('Fuldt eftersyn af elcyklen med tjek af motor, batteri, display og elektronik oveni det mekaniske serviceeftersyn. Vi servicerer alle el-mærker.'),
      li('Diagnose af motor og batteri'),
      li('Opdatering og test af display'),
      li('Mekanisk eftersyn af gear og bremser'),
    ],
    billede: null,
    raekkefolge: 4,
  },
];

async function run() {
  console.log(`Seeder projekt ${projectId} / dataset ${dataset} …\n`);
  const tx = client.transaction();

  console.log('Cykler:');
  for (const c of cyklerData) {
    const billeder = [];
    for (const [rel, alt] of c.billeder) billeder.push(await billede(rel, alt));
    const doc = {
      _id: c._id,
      _type: 'cykel',
      titel: c.titel,
      slug: { _type: 'slug', current: c.slug },
      koen: c.koen,
      type: c.type,
      brand: c.brand,
      pris: c.pris,
      ...(c.foerpris ? { foerpris: c.foerpris } : {}),
      kortBeskrivelse: c.kortBeskrivelse,
      langBeskrivelse: c.langBeskrivelse,
      billeder,
      specifikationer: c.specifikationer,
      status: c.status,
      fremhaev: c.fremhaev,
    };
    tx.createOrReplace(doc);
  }

  console.log('Ydelser:');
  for (const y of ydelserData) {
    const doc = {
      _id: y._id,
      _type: 'vaerkstedsydelse',
      navn: y.navn,
      slug: { _type: 'slug', current: y.slug },
      kategori: y.kategori,
      fraPris: y.fraPris,
      ...(y.estimeretTid ? { estimeretTid: y.estimeretTid } : {}),
      beskrivelse: y.beskrivelse,
      ...(y.billede ? { billede: await billede(y.billede[0], y.billede[1]) } : {}),
      raekkefolge: y.raekkefolge,
    };
    tx.createOrReplace(doc);
  }

  await tx.commit();
  console.log(`\nFærdig. ${cyklerData.length} cykler og ${ydelserData.length} ydelser oprettet.`);
}

run().catch((err) => {
  console.error('Seed fejlede:', err.message);
  process.exit(1);
});
