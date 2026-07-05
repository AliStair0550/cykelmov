// ============================================================
// Seeder værkstedsydelser. Sletter eksisterende vaerkstedsydelse-docs
// og opretter det fulde katalog (7 kategorier).
//
// Kør fra sanity/-mappen:
//   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_API_TOKEN=yyyy npm run seed:ydelser
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

let k = 0;
const key = () => `k${k++}`;
const afsnit = (t) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text: t, marks: [] }] });

const cache = new Map();
async function billede(rel, alt) {
  if (!cache.has(rel)) {
    const buf = readFileSync(join(assetsDir, rel));
    console.log('  uploader', rel, '…');
    const asset = await client.assets.upload('image', buf, { filename: rel.split('/').pop() });
    cache.set(rel, asset._id);
  }
  return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: cache.get(rel) }, alt };
}

// [slug, navn, kategori, fraPris, fastPris, tid|null, beskrivelse|null, billede|null]
const Y = [
  ['serviceeftersyn', 'Serviceeftersyn', 'service', 499, false, 'Samme dag', 'Fuld gennemgang af gear, bremser, kæde, hjul og lys. Justering, smøring og ærlig rådgivning om eventuelle sliddele.', 'vaerksted-vaerktoej.jpg'],
  ['stort-service', 'Stort service', 'service', 899, false, '1 dag', 'Komplet service med justering af alle bevægelige dele, opstramning, smøring og grundigt sikkerhedstjek. Ideelt én gang om året.', null],
  ['sikkerhedstjek', 'Sikkerhedstjek', 'service', 199, true, '20 min', 'Et hurtigt eftersyn af bremser, gear, hjul og dæk. Perfekt inden ferie eller hvis cyklen har stået stille.', null],
  ['gearjustering', 'Gearjustering', 'reparation', 149, false, '30 til 45 min', 'Præcis justering af gear og kabler, så cyklen skifter let og præcist.', null],
  ['bremseservice', 'Bremseservice', 'reparation', 199, false, '30 min', 'Justering af bremser samt kontrol af klodser, kabler og bremsekraft.', null],
  ['kaedeskift', 'Kædeskift', 'reparation', 299, false, '30 min', 'Udskiftning af slidt kæde for bedre gearskift og længere levetid på tandhjul.', null],
  ['kaede-og-drivlinjerens', 'Kæde og drivlinjerens', 'reparation', 199, false, '30 min', 'Grundig rens og smøring af kæde, kassette og krank.', null],
  ['bremseklodser', 'Bremseklodser', 'reparation', 249, false, '30 min', 'Udskiftning af bremseklodser inklusive justering.', null],
  ['slangeskift', 'Slangeskift', 'daek', 249, false, 'Mens du venter', 'Ny slange monteres hurtigt. Lapning fra 99 hvis muligt.', 'vaerksted-daek.jpg'],
  ['punkteringslapning', 'Punkteringslapning', 'daek', 99, true, '15 min', 'Vi lapper slangen, hvis skaden kan repareres.', null],
  ['daekskift', 'Dækskift', 'daek', 299, false, null, 'Montering af nyt dæk inklusive kontrol af fælg og slange.', null],
  ['hjulopretning', 'Hjulopretning', 'daek', 249, false, null, 'Retning af skæve hjul og justering af eger.', null],
  ['elcykel-service', 'Elcykel service', 'elcykel', 699, false, '1 til 2 dage', 'Komplet service af både mekanik og elektronik.', null],
  ['batteritest', 'Batteritest', 'elcykel', 199, true, null, 'Test af batteriets kapacitet og generelle sundhed.', null],
  ['softwareopdatering', 'Softwareopdatering', 'elcykel', 249, false, null, 'Opdatering af motor og system, hvis producenten understøtter det.', null],
  ['montering-cykelkurv', 'Montering af cykelkurv', 'tilbehoer', 149, false, null, null, null],
  ['montering-barnestol', 'Montering af barnestol', 'tilbehoer', 249, false, null, null, null],
  ['montering-bagagebaerer', 'Montering af bagagebærer', 'tilbehoer', 199, false, null, null, null],
  ['montering-skaerme', 'Montering af skærme', 'tilbehoer', 199, false, null, null, null],
  ['montering-lygter', 'Montering af lygter', 'tilbehoer', 99, false, null, null, null],
  ['montering-laas', 'Montering af lås', 'tilbehoer', 99, false, null, null, null],
  ['foraarsklargoering', 'Forårsklargøring', 'saeson', 599, false, null, 'Perfekt efter vinteren med fuldt eftersyn, smøring og justering.', null],
  ['vinterklargoering', 'Vinterklargøring', 'saeson', 399, false, null, 'Rens, smøring og beskyttelse mod salt og fugt.', null],
  ['akut-reparation', 'Akut reparation', 'akut', 299, false, null, 'Spring køen over. Vi prioriterer din cykel samme dag, når det er muligt.', null],
];

async function run() {
  console.log(`Seeder ydelser i ${projectId}/${dataset} …`);
  console.log('Sletter eksisterende vaerkstedsydelse-dokumenter …');
  await client.delete({ query: '*[_type == "vaerkstedsydelse"]' });

  const tx = client.transaction();
  let i = 0;
  for (const [slug, navn, kategori, fraPris, fastPris, tid, desc, img] of Y) {
    i++;
    const doc = {
      _id: `ydelse-${slug}`,
      _type: 'vaerkstedsydelse',
      navn,
      slug: { _type: 'slug', current: slug },
      kategori,
      fraPris,
      fastPris,
      ...(tid ? { estimeretTid: tid } : {}),
      ...(desc ? { beskrivelse: [afsnit(desc)] } : {}),
      ...(img ? { billede: await billede(img, navn) } : {}),
      raekkefolge: i,
    };
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log(`Færdig. ${Y.length} ydelser oprettet.`);
}

run().catch((err) => {
  console.error('Seed fejlede:', err.message);
  process.exit(1);
});
