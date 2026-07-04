// Danske formateringshjælpere.
import type { PortableBlock } from './types';

/** Formatér et beløb som fx "4.999 kr." */
export function kr(n: number): string {
  return `${Math.round(n).toLocaleString('da-DK')} kr.`;
}

/** Rabatprocent ud fra pris og førpris (afrundet). Null hvis ingen rabat. */
export function rabatProcent(pris: number, foerpris: number | null): number | null {
  if (!foerpris || foerpris <= pris) return null;
  return Math.round(((foerpris - pris) / foerpris) * 100);
}

/** Kort tekstuddrag fra Portable Text (første almindelige afsnit). */
export function uddrag(blocks: PortableBlock[] | null | undefined, maxLen = 160): string {
  if (!Array.isArray(blocks)) return '';
  const foerste = blocks.find((b) => b._type === 'block' && !b.listItem);
  const tekst = (foerste?.children ?? []).map((c) => c.text ?? '').join('').trim();
  return tekst.length > maxLen ? tekst.slice(0, maxLen - 1).trimEnd() + '…' : tekst;
}
