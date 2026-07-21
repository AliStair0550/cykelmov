// Danske formateringshjælpere.
import type { PortableBlock } from './types';

/** Formatér et beløb som fx "4.999 kr." */
export function kr(n: number): string {
  return `${Math.round(n).toLocaleString('da-DK')} kr.`;
}

/** Prisvisning for en ydelse: fast pris uden "fra", ellers "fra X". */
export function ydelsePris(fraPris: number, fastPris: boolean): string {
  return fastPris ? kr(fraPris) : `fra ${kr(fraPris)}`;
}

/** Rabatprocent ud fra pris og førpris (afrundet). Null hvis ingen rabat. */
export function rabatProcent(pris: number, foerpris: number | null): number | null {
  if (!foerpris || foerpris <= pris) return null;
  return Math.round(((foerpris - pris) / foerpris) * 100);
}

/** Lav en ren, URL-sikker slug (dansk). Robust mod rodede Sanity-slugs
 *  (mellemrum, store bogstaver, æøå, specialtegn, foran/bagved-mellemrum). */
export function slugify(s: string): string {
  return (s || '')
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Kort tekstuddrag fra Portable Text (første almindelige afsnit). */
export function uddrag(blocks: PortableBlock[] | null | undefined, maxLen = 160): string {
  if (!Array.isArray(blocks)) return '';
  const foerste = blocks.find((b) => b._type === 'block' && !b.listItem);
  const tekst = (foerste?.children ?? []).map((c) => c.text ?? '').join('').trim();
  return tekst.length > maxLen ? tekst.slice(0, maxLen - 1).trimEnd() + '…' : tekst;
}
