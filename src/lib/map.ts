// ============================================================
// Oversætter rå Sanity-dokumenter til view-model (types.ts).
// Billed-referencer bliver til færdige CDN-URL'er via urlFor.
// ============================================================
import { urlFor, type SanityImage } from './sanity';
import type { Billede, Cykel, Ydelse } from './types';

function resolveBillede(img: SanityImage, fallbackAlt: string): Billede {
  const b = urlFor(img);
  return {
    url: b ? b.width(1100).height(950).fit('crop').auto('format').url() : '',
    thumbUrl: b ? b.width(180).height(180).fit('crop').auto('format').url() : '',
    alt: (img?.alt as string) || fallbackAlt,
  };
}

export function mapCykel(doc: any): Cykel {
  const titel = doc?.titel ?? 'Cykel';
  const billeder: Billede[] = Array.isArray(doc?.billeder)
    ? doc.billeder.filter(Boolean).map((b: SanityImage) => resolveBillede(b, titel))
    : [];

  return {
    _id: doc?._id ?? '',
    titel,
    slug: doc?.slug?.current ?? doc?.slug ?? '',
    koen: doc?.koen ?? 'herre',
    type: doc?.type ?? 'by',
    brand: doc?.brand ?? '',
    pris: Number(doc?.pris ?? 0),
    foerpris: doc?.foerpris != null ? Number(doc.foerpris) : null,
    kortBeskrivelse: doc?.kortBeskrivelse ?? '',
    langBeskrivelse: Array.isArray(doc?.langBeskrivelse) ? doc.langBeskrivelse : null,
    billeder,
    specifikationer: doc?.specifikationer ?? null,
    status: doc?.status ?? 'paa_lager',
    fremhaev: Boolean(doc?.fremhaev),
    seoTitel: doc?.seoTitel ?? null,
    seoBeskrivelse: doc?.seoBeskrivelse ?? null,
  };
}

export function mapYdelse(doc: any): Ydelse {
  const navn = doc?.navn ?? 'Ydelse';
  return {
    _id: doc?._id ?? '',
    navn,
    slug: doc?.slug?.current ?? doc?.slug ?? '',
    kategori: doc?.kategori ?? 'service',
    fraPris: Number(doc?.fraPris ?? 0),
    fastPris: Boolean(doc?.fastPris),
    estimeretTid: doc?.estimeretTid ?? null,
    beskrivelse: Array.isArray(doc?.beskrivelse) ? doc.beskrivelse : null,
    billede: doc?.billede ? resolveBillede(doc.billede, navn) : null,
    raekkefolge: Number(doc?.raekkefolge ?? 999),
  };
}
