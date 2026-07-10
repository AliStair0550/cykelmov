import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) {
  console.error('Mangler SANITY_STUDIO_PROJECT_ID og/eller SANITY_API_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });
const data = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const start = parseInt(process.argv[3] || '0', 10);
const end = parseInt(process.argv[4] || String(data.length), 10);

async function uploadImage(url) {
  for (let forsoeg = 1; forsoeg <= 3; forsoeg++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      const filename = decodeURIComponent((url.split('/').pop() || 'billede').split('?')[0]) || 'billede.jpg';
      const asset = await client.assets.upload('image', buf, { filename });
      return asset._id;
    } catch (e) {
      if (forsoeg === 3) throw e;
      await new Promise((r) => setTimeout(r, 800 * forsoeg));
    }
  }
}

let ok = 0, fejl = 0, bOk = 0, bFejl = 0;
for (let i = start; i < end; i++) {
  const p = data[i];
  try {
    const billeder = [];
    for (let j = 0; j < p.billedeUrls.length; j++) {
      try {
        const ref = await uploadImage(p.billedeUrls[j]);
        billeder.push({ _type: 'image', _key: 'img' + j, asset: { _type: 'reference', _ref: ref }, alt: p.navn });
        bOk++;
      } catch (e) {
        bFejl++;
        console.warn(`   ! billede-fejl ${p.billedeUrls[j]}: ${e.message}`);
      }
    }
    const doc = {
      _id: 'tilbehoer-wc-' + p.wcId,
      _type: 'tilbehoer',
      navn: p.navn,
      slug: { _type: 'slug', current: p.slug },
      pris: p.pris,
      prisInklMontering: true,
      ...(p.kategori ? { kategori: p.kategori } : {}),
      ...(p.kortBeskrivelse ? { kortBeskrivelse: p.kortBeskrivelse } : {}),
      ...(p.beskrivelseBlokke && p.beskrivelseBlokke.length ? { beskrivelse: p.beskrivelseBlokke } : {}),
      ...(billeder.length ? { billeder } : {}),
      aktiv: true,
      raekkefolge: i + 1,
      ...(p.kildeUrl ? { kildeUrl: p.kildeUrl } : {}),
    };
    await client.createOrReplace(doc);
    ok++;
    console.log(`OK [${i + 1}/${data.length}] ${p.navn} (${billeder.length}/${p.billedeUrls.length} billeder)`);
  } catch (e) {
    fejl++;
    console.error(`FEJL [${i + 1}] ${p.navn}: ${e.message}`);
  }
}
console.log(`\nFAERDIG: ${ok} produkter, ${fejl} fejl | billeder: ${bOk} ok, ${bFejl} fejl`);
