// ============================================================
// Afhentnings-/bookingtider ud fra butikkens åbningstider.
// Bruges både i browseren (ReserverModal) og på serveren
// (/api/reserver validerer det valgte tidspunkt).
// Kilde: site.aabningJsonLd — ret åbningstider ét sted.
// ============================================================
import { site } from './site';

export const TZ = 'Europe/Copenhagen';
/** Interval mellem tider i dropdown'en (minutter). */
export const SLOT_MIN = 30;
/** Hvor mange dage frem man kan vælge. */
export const DAGE_FREM = 14;
/** Tidligste tid i dag = nu + så mange minutter. */
const BUFFER_MIN = 60;
/** Sidste tid = lukketid minus så mange minutter. */
const SIDSTE_FOER_LUK = 30;

/**
 * Ekstra lukkedage, så de ikke kan vælges i formularen.
 *  - 'MM-DD'      = lukket hvert år (fx juleaften)
 *  - 'YYYY-MM-DD' = lukket én bestemt dag (fx ferie)
 */
export const lukkedage: string[] = ['12-24', '12-31'];

const erLukkedag = (dato: string) => lukkedage.includes(dato) || lukkedage.includes(dato.slice(5));

const DAG_NR: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const tilMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const tilHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// Ugedag (0=søn) → åbent-interval i minutter, eller null = lukket.
const UGE: ({ aabner: number; lukker: number } | null)[] = Array(7).fill(null);
for (const o of site.aabningJsonLd) {
  for (const d of o.dage) UGE[DAG_NR[d]] = { aabner: tilMin(o.opens), lukker: tilMin(o.closes) };
}

/** Dato (YYYY-MM-DD) og minut-på-dagen lige nu i København. */
export function nuIKbh(d = new Date()): { dato: string; minut: number } {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { dato: `${p.year}-${p.month}-${p.day}`, minut: Number(p.hour) * 60 + Number(p.minute) };
}

const DATO_RE = /^\d{4}-\d{2}-\d{2}$/;
const TID_RE = /^\d{2}:\d{2}$/;

function utcMiddag(dato: string): Date {
  const [y, m, d] = dato.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}
function plusDage(dato: string, n: number): string {
  const d = utcMiddag(dato);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function dageMellem(fra: string, til: string): number {
  return Math.round((utcMiddag(til).getTime() - utcMiddag(fra).getTime()) / 86400000);
}

/** Alle ledige tider (HH:MM) på en dato. Tom liste = lukket/forbi. */
export function tiderForDato(dato: string, nu = nuIKbh()): string[] {
  if (!DATO_RE.test(dato) || erLukkedag(dato)) return [];
  const aabent = UGE[utcMiddag(dato).getUTCDay()];
  if (!aabent) return [];
  let start = aabent.aabner;
  if (dato === nu.dato) {
    const tidligst = Math.ceil((nu.minut + BUFFER_MIN) / SLOT_MIN) * SLOT_MIN;
    start = Math.max(start, tidligst);
  }
  const tider: string[] = [];
  for (let m = start; m <= aabent.lukker - SIDSTE_FOER_LUK; m += SLOT_MIN) tider.push(tilHHMM(m));
  return tider;
}

const stort = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Kort dato-etiket til dropdown'en: "I dag", "I morgen", "Fredag 20. nov." */
function datoEtiket(dato: string, nu: { dato: string }): string {
  const fuld = utcMiddag(dato).toLocaleDateString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
  const diff = dageMellem(nu.dato, dato);
  const kort = utcMiddag(dato).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  if (diff === 0) return `I dag, ${kort}`;
  if (diff === 1) return `I morgen, ${kort}`;
  return stort(fuld);
}

/** De næste DAGE_FREM dage, hvor der er mindst én ledig tid. */
export function ledigeDatoer(nu = nuIKbh()): { dato: string; label: string }[] {
  const ud: { dato: string; label: string }[] = [];
  for (let i = 0; i <= DAGE_FREM; i++) {
    const dato = plusDage(nu.dato, i);
    if (tiderForDato(dato, nu).length) ud.push({ dato, label: datoEtiket(dato, nu) });
  }
  return ud;
}

/**
 * Server-tjek: ligger tidspunktet inden for åbningstiden og i et rimeligt
 * vindue? Tjekker ikke "for tidligt i dag" strengt (siden kan have stået åben
 * et stykke tid), kun at datoen ikke er passeret.
 */
export function gyldigtTidspunkt(dato: string, tid: string, nu = nuIKbh()): boolean {
  if (!DATO_RE.test(dato) || !TID_RE.test(tid)) return false;
  const diff = dageMellem(nu.dato, dato);
  if (diff < 0 || diff > DAGE_FREM + 1) return false;
  // Sammenlign mod dagens fulde tidsliste (uden "nu"-buffer).
  return tiderForDato(dato, { dato: '', minut: 0 }).includes(tid);
}

/** "Torsdag 19. november kl. 14.30" */
export function formaterTidspunkt(dato: string, tid: string): string {
  const d = utcMiddag(dato).toLocaleDateString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  return `${stort(d)} kl. ${tid.replace(':', '.')}`;
}

/** ISO-tidsstempel (UTC) for et lokalt København-tidspunkt. */
export function tilIso(dato: string, tid: string): string {
  const [y, mo, d] = dato.split('-').map(Number);
  const [h, mi] = tid.split(':').map(Number);
  const gaet = Date.UTC(y, mo - 1, d, h, mi);
  const lokal = nuIKbh(new Date(gaet));
  const [ly, lmo, ld] = lokal.dato.split('-').map(Number);
  const offsetMin = (Date.UTC(ly, lmo - 1, ld) / 60000 + lokal.minut) - gaet / 60000;
  return new Date(gaet - offsetMin * 60000).toISOString();
}
