// ============================================================
// Byggere til schema.org JSON-LD (Product, ItemList).
// ============================================================
import { site } from './site';
import type { Cykel } from './types';

/** Gør en URL absolut (Sanity-CDN-URL'er er allerede absolutte). */
export function absUrl(u: string): string {
  if (!u) return site.url;
  return /^https?:\/\//.test(u) ? u : new URL(u, site.url).href;
}

function tilgaengelighed(status: Cykel['status']): string {
  if (status === 'udsolgt') return 'https://schema.org/OutOfStock';
  if (status === 'kommer_snart') return 'https://schema.org/PreOrder';
  return 'https://schema.org/InStock';
}

export function produktSchema(cykel: Cykel, sideUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cykel.titel,
    brand: { '@type': 'Brand', name: cykel.brand },
    image: cykel.billeder.map((b) => absUrl(b.url)),
    description: cykel.kortBeskrivelse,
    category: cykel.type,
    offers: {
      '@type': 'Offer',
      price: cykel.pris,
      priceCurrency: 'DKK',
      availability: tilgaengelighed(cykel.status),
      url: sideUrl,
      seller: { '@type': 'Organization', name: site.navn },
    },
  };
}

export function itemListSchema(cykler: Cykel[], titel: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: titel,
    itemListElement: cykler.map((c, i) => ({
      '@type': 'Product',
      position: i + 1,
      name: c.titel,
      url: absUrl(`/cykler/${c.slug}`),
      offers: {
        '@type': 'Offer',
        price: c.pris,
        priceCurrency: 'DKK',
        availability: tilgaengelighed(c.status),
      },
    })),
  };
}
