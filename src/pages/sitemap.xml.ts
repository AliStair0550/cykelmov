// ============================================================
// Komplet sitemap på /sitemap.xml — genereres automatisk ved hvert build.
//
// Indeholder ALLE indekserbare sider: forside, kategorisider (dame/herre/
// børn), samtlige produktsider, værkstedsoversigt + én underside pr. ydelse,
// artikler samt statiske informationssider.
//
// Bevidst UDELADT (ikke-indekserbare): /reserver/ (tak-side), 404 og
// /api/reserver. Der findes ingen brandguide-rute.
//
// <lastmod> sættes ud fra Sanitys _updatedAt hvor det giver mening:
//   - produkt-/ydelsessider: dokumentets egen opdateringsdato
//   - forside/oversigtssider: nyeste opdateringsdato blandt de viste dokumenter
//   - rene statiske sider: udelades (ingen pålidelig dato → hellere ingen)
// ============================================================
import type { APIRoute } from 'astro';
import { hentCykler, hentYdelser, hentTilbehoer } from '../lib/data';
import { site } from '../lib/site';

const BASE = site.url.replace(/\/$/, '');

const abs = (sti: string): string => `${BASE}${sti}`;

/** Nyeste ISO-dato i en liste (til oversigtssiders lastmod). */
function nyeste(datoer: (string | null | undefined)[]): string | null {
  const gyldige = datoer.filter((d): d is string => Boolean(d));
  if (!gyldige.length) return null;
  // ISO-8601 sorterer leksikografisk = kronologisk.
  return gyldige.reduce((a, b) => (a > b ? a : b));
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

type Post = { loc: string; lastmod?: string | null };

export const GET: APIRoute = async () => {
  const [cykler, ydelser, tilbehoer] = await Promise.all([
    hentCykler(),
    hentYdelser(),
    hentTilbehoer(),
  ]);

  const dame = cykler.filter((c) => c.koen === 'dame');
  const herre = cykler.filter((c) => c.koen === 'herre');
  const boern = cykler.filter((c) => c.koen === 'boern');

  const poster: Post[] = [];

  // Forside + oversigtssider (lastmod = nyeste relevante dokument).
  poster.push({ loc: abs('/'), lastmod: nyeste(cykler.map((c) => c.opdateret)) });
  poster.push({ loc: abs('/cykler/'), lastmod: nyeste(cykler.map((c) => c.opdateret)) });
  poster.push({ loc: abs('/cykler/dame/'), lastmod: nyeste(dame.map((c) => c.opdateret)) });
  poster.push({ loc: abs('/cykler/herre/'), lastmod: nyeste(herre.map((c) => c.opdateret)) });
  poster.push({ loc: abs('/cykler/boern/'), lastmod: nyeste(boern.map((c) => c.opdateret)) });
  poster.push({ loc: abs('/tilbehoer/'), lastmod: nyeste(tilbehoer.map((t) => t.opdateret)) });
  poster.push({ loc: abs('/vaerksted/'), lastmod: nyeste(ydelser.map((y) => y.opdateret)) });

  // Samtlige produktsider.
  for (const c of cykler) {
    poster.push({ loc: abs(`/cykler/${c.slug}/`), lastmod: c.opdateret });
  }

  // Værkstedsundersider — én pr. ydelse.
  for (const y of ydelser) {
    poster.push({ loc: abs(`/vaerksted/${y.slug}/`), lastmod: y.opdateret });
  }

  // Artikler.
  poster.push({ loc: abs('/artikler/hvad-koster-en-cykel/') });

  // Statiske informationssider.
  poster.push({ loc: abs('/om/') });
  poster.push({ loc: abs('/kontakt/') });
  poster.push({ loc: abs('/handelsbetingelser/') });
  poster.push({ loc: abs('/privatlivspolitik/') });

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    poster
      .map(({ loc, lastmod }) => {
        const lm = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
        return `  <url><loc>${xmlEscape(loc)}</loc>${lm}</url>`;
      })
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
