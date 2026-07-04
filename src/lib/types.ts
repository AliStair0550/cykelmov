// ============================================================
// View-model typer. Både Sanity-data og demo-fallback normaliseres
// til disse former, så komponenterne kun kender én shape.
// ============================================================

export type Koen = 'herre' | 'dame' | 'boern';
export type CykelStatus = 'paa_lager' | 'kommer_snart' | 'udsolgt';
export type CykelType = 'by' | 'mountainbike' | 'racer' | 'gravel' | 'elcykel' | 'klapcykel';

export interface Billede {
  url: string; // stor visning
  thumbUrl: string; // lille thumbnail
  alt: string;
}

// Løst typet Portable Text-blok (nok til produkt- og ydelsestekster).
export interface PortableBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{ _type: string; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  [key: string]: unknown;
}

export interface Specifikationer {
  gear?: string | null;
  stoerrelser?: string[] | null;
  vaegt?: number | null;
  farver?: string[] | null;
}

export interface Cykel {
  _id: string;
  titel: string;
  slug: string;
  koen: Koen;
  type: CykelType;
  brand: string;
  pris: number;
  foerpris: number | null;
  kortBeskrivelse: string;
  langBeskrivelse: PortableBlock[] | null;
  billeder: Billede[];
  specifikationer: Specifikationer | null;
  status: CykelStatus;
  fremhaev: boolean;
  seoTitel: string | null;
  seoBeskrivelse: string | null;
}

export type YdelseKategori = 'service' | 'reparation' | 'daek' | 'elcykel';

export interface Ydelse {
  _id: string;
  navn: string;
  slug: string;
  kategori: YdelseKategori;
  fraPris: number;
  estimeretTid: string | null;
  beskrivelse: PortableBlock[] | null;
  billede: Billede | null;
  raekkefolge: number;
}
