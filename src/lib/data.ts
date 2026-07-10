// ============================================================
// Data-laget. Henter fra Sanity ved build-time og falder tilbage til
// demo-data, hvis Sanity ikke er konfigureret eller er tomt.
// Komponenter og sider importerer kun herfra.
// ============================================================
import { sanityClient } from './sanity';
import { alleCykler, alleVaerksted, alleTilkoeb, alleTilbehoer } from './queries';
import { mapCykel, mapYdelse, mapTilkoeb, mapTilbehoer } from './map';
import { demoCykler, demoYdelser, demoTilkoeb, demoTilbehoer } from './demo';
import type { Cykel, Koen, Tilbehoer, Tilkoeb, Ydelse } from './types';

let _cykler: Promise<Cykel[]> | null = null;
let _ydelser: Promise<Ydelse[]> | null = null;
let _tilkoeb: Promise<Tilkoeb[]> | null = null;
let _tilbehoer: Promise<Tilbehoer[]> | null = null;

/** Alle cykler, sorteret som GROQ: fremhævet først, derefter nyeste. */
export function hentCykler(): Promise<Cykel[]> {
  if (_cykler) return _cykler;
  _cykler = (async () => {
    if (!sanityClient) {
      console.info('[data] Sanity ikke konfigureret, bruger demo-cykler.');
      return demoCykler;
    }
    try {
      const docs = await sanityClient.fetch(alleCykler);
      if (!Array.isArray(docs) || docs.length === 0) {
        console.warn('[data] Sanity returnerede ingen cykler, bruger demo-data.');
        return demoCykler;
      }
      return docs.map(mapCykel);
    } catch (err) {
      console.warn('[data] Kunne ikke hente cykler fra Sanity, bruger demo-data:', (err as Error).message);
      return demoCykler;
    }
  })();
  return _cykler;
}

/** Alle værkstedsydelser, sorteret efter rækkefølge. */
export function hentYdelser(): Promise<Ydelse[]> {
  if (_ydelser) return _ydelser;
  _ydelser = (async () => {
    if (!sanityClient) return demoYdelser;
    try {
      const docs = await sanityClient.fetch(alleVaerksted);
      if (!Array.isArray(docs) || docs.length === 0) return demoYdelser;
      return docs.map(mapYdelse);
    } catch (err) {
      console.warn('[data] Kunne ikke hente ydelser fra Sanity, bruger demo-data:', (err as Error).message);
      return demoYdelser;
    }
  })();
  return _ydelser;
}

/** Alle aktive tilkøb, sorteret efter rækkefølge. */
export function hentTilkoeb(): Promise<Tilkoeb[]> {
  if (_tilkoeb) return _tilkoeb;
  _tilkoeb = (async () => {
    if (!sanityClient) return demoTilkoeb;
    try {
      const docs = await sanityClient.fetch(alleTilkoeb);
      if (!Array.isArray(docs) || docs.length === 0) return demoTilkoeb;
      return docs.map(mapTilkoeb);
    } catch (err) {
      console.warn('[data] Kunne ikke hente tilkøb fra Sanity, bruger demo-data:', (err as Error).message);
      return demoTilkoeb;
    }
  })();
  return _tilkoeb;
}

/** Alle aktive tilbehør/reservedele, sorteret efter kategori og navn. */
export function hentTilbehoer(): Promise<Tilbehoer[]> {
  if (_tilbehoer) return _tilbehoer;
  _tilbehoer = (async () => {
    if (!sanityClient) return demoTilbehoer;
    try {
      const docs = await sanityClient.fetch(alleTilbehoer);
      if (!Array.isArray(docs) || docs.length === 0) return demoTilbehoer;
      return docs.map(mapTilbehoer);
    } catch (err) {
      console.warn('[data] Kunne ikke hente tilbehør fra Sanity, bruger demo-data:', (err as Error).message);
      return demoTilbehoer;
    }
  })();
  return _tilbehoer;
}

export async function hentCyklerEfterKoen(koen: Koen): Promise<Cykel[]> {
  const alle = await hentCykler();
  return alle.filter((c) => c.koen === koen);
}

export async function hentFremhaevede(antal = 3): Promise<Cykel[]> {
  const alle = await hentCykler();
  const fremhaevet = alle.filter((c) => c.fremhaev);
  // Fald tilbage til de første cykler, hvis ingen er markeret som fremhævet.
  return (fremhaevet.length ? fremhaevet : alle).slice(0, antal);
}

export async function hentCykel(slug: string): Promise<Cykel | undefined> {
  const alle = await hentCykler();
  return alle.find((c) => c.slug === slug);
}

export async function hentRelaterede(cykel: Cykel, antal = 4): Promise<Cykel[]> {
  const alle = await hentCykler();
  const sammeType = alle.filter(
    (c) => c._id !== cykel._id && c.koen === cykel.koen && c.type === cykel.type,
  );
  const sammeKoen = alle.filter(
    (c) => c._id !== cykel._id && c.koen === cykel.koen && !sammeType.includes(c),
  );
  return [...sammeType, ...sammeKoen].slice(0, antal);
}

export async function hentYdelse(slug: string): Promise<Ydelse | undefined> {
  const alle = await hentYdelser();
  return alle.find((y) => y.slug === slug);
}

/** Unikke brands på tværs af (evt. filtreret) liste, sorteret alfabetisk. */
export function unikkeBrands(cykler: Cykel[]): string[] {
  return [...new Set(cykler.map((c) => c.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'da'),
  );
}

/** Unikke typer i den rækkefølge de forekommer. */
export function unikkeTyper(cykler: Cykel[]): string[] {
  return [...new Set(cykler.map((c) => c.type).filter(Boolean))];
}
