// ============================================================
// Byggere til schema.org JSON-LD (Product, ItemList).
//
// Både enkeltproduktsider og oversigtssider (ItemList) leverer det samme
// sæt felter — name, brand, image, description, offers — så Search Console
// ikke melder "Missing field" på listesiderne.
// ============================================================
import { site } from './site';
import type { Cykel } from './types';

/** Gør en URL absolut (Sanity-CDN-URL'er er allerede absolutte). */
export function absUrl(u: string): string {
  if (!u) return site.url;
  return /^https?:\/\//.test(u) ? u : new URL(u, site.url).href;
}

// Lagerstatus kommer fra Sanity-feltet `status` (paa_lager | kommer_snart |
// udsolgt). mapCykel sætter 'paa_lager', hvis feltet mangler, så et produkt
// uden udfyldt status regnes som på lager.
function tilgaengelighed(status: Cykel['status']): string {
  if (status === 'udsolgt') return 'https://schema.org/OutOfStock';
  if (status === 'kommer_snart') return 'https://schema.org/PreOrder';
  return 'https://schema.org/InStock';
}

/** Mærke fra Sanity (trimmet). Falder tilbage til butikkens eget navn. */
function maerke(cykel: Cykel) {
  return { '@type': 'Brand', name: cykel.brand?.trim() || site.navn };
}

/** Produktbilleder som absolutte URL'er. */
function billeder(cykel: Cykel): string[] {
  return cykel.billeder.map((b) => absUrl(b.url)).filter(Boolean);
}

/** Kort beskrivelse fra Sanity; falder tilbage til titlen. */
function beskrivelse(cykel: Cykel): string {
  return cykel.kortBeskrivelse?.trim() || cykel.titel;
}

/** Prisen er den viste pris (cykel.pris), altid i DKK. */
function tilbud(cykel: Cykel, url: string) {
  return {
    '@type': 'Offer',
    price: cykel.pris,
    priceCurrency: 'DKK',
    availability: tilgaengelighed(cykel.status),
    url,
    seller: { '@type': 'Organization', name: site.navn },
  };
}

export function produktSchema(cykel: Cykel, sideUrl: string) {
  const bill = billeder(cykel);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cykel.titel,
    brand: maerke(cykel),
    ...(bill.length ? { image: bill } : {}),
    description: beskrivelse(cykel),
    category: cykel.type,
    offers: tilbud(cykel, sideUrl),
  };
}

export function itemListSchema(cykler: Cykel[], titel: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: titel,
    itemListElement: cykler.map((c, i) => {
      // Efterstillet skråstreg, så URL'en matcher sidens canonical (mappeformat).
      const url = absUrl(`/cykler/${c.slug}/`);
      const bill = billeder(c);
      return {
        '@type': 'Product',
        position: i + 1,
        name: c.titel,
        url,
        brand: maerke(c),
        ...(bill.length ? { image: bill[0] } : {}),
        description: beskrivelse(c),
        offers: tilbud(c, url),
      };
    }),
  };
}
