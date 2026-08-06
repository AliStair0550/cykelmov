// ============================================================
// Google Merchant Center produktfeed på /feed.xml.
// Genereres automatisk ved hvert build fra Sanity-produktdata.
// Format: RSS 2.0 med g:-namespace (Google Shopping).
//
// Kun publicerede cykler (hentCykler bruger perspective:'published').
// Udsolgte medtages med availability=out_of_stock.
// ============================================================
import type { APIRoute } from 'astro';
import { hentCykler } from '../lib/data';
import { site } from '../lib/site';

const BASE = site.url.replace(/\/$/, '');
const abs = (sti: string): string => `${BASE}${sti}`;

function xmlEscape(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Sanity-billed-URL'erne har auto=format (kan give webp). Tving jpg, saa
// Google Merchant altid faar et bredt understoettet billedformat.
function feedBillede(url: string): string {
  if (!url) return '';
  return /auto=format/.test(url) ? url.replace(/auto=format/, 'fm=jpg') : url;
}

const KATEGORI = 'Sporting Goods > Outdoor Recreation > Cycling > Bicycles';

export const GET: APIRoute = async () => {
  const cykler = await hentCykler();

  const items = cykler
    .map((c) => {
      const link = abs(`/cykler/${c.slug}/`);
      const image = feedBillede(c.billeder?.[0]?.url ?? '');
      const availability = c.status === 'udsolgt' ? 'out_of_stock' : 'in_stock';
      const brand = c.brand?.trim() || site.navn;
      const beskrivelse = c.kortBeskrivelse?.trim() || c.titel;
      const pris = `${Number(c.pris).toFixed(2)} DKK`;

      return [
        '    <item>',
        `      <g:id>${xmlEscape(c.slug)}</g:id>`,
        `      <g:title>${xmlEscape(c.titel)}</g:title>`,
        `      <g:description>${xmlEscape(beskrivelse)}</g:description>`,
        `      <g:link>${xmlEscape(link)}</g:link>`,
        `      <g:image_link>${xmlEscape(image)}</g:image_link>`,
        `      <g:price>${xmlEscape(pris)}</g:price>`,
        `      <g:availability>${availability}</g:availability>`,
        '      <g:condition>new</g:condition>',
        `      <g:brand>${xmlEscape(brand)}</g:brand>`,
        `      <g:google_product_category>${xmlEscape(KATEGORI)}</g:google_product_category>`,
        // Cyklerne har ikke GTIN/MPN — fortael Google, saa den ikke afviser dem.
        '      <g:identifier_exists>no</g:identifier_exists>',
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n' +
    '  <channel>\n' +
    `    <title>${xmlEscape(site.navn)} produktfeed</title>\n` +
    `    <link>${BASE}/</link>\n` +
    `    <description>${xmlEscape(site.slogan)} — cykler til salg.</description>\n` +
    items +
    '\n  </channel>\n' +
    '</rss>\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
