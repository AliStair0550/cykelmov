// ============================================================
// Sanity-klient. Bruges ved build-time til at hente cykler og ydelser.
// Hvis PUBLIC_SANITY_PROJECT_ID ikke er sat, kører sitet på demo-data
// (se data.ts), så det aldrig står tomt før Sanity er koblet på.
// ============================================================
import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

/** Et Sanity-image-objekt (asset-reference med valgfri alt-tekst). */
export type SanityImage = { _type?: string; asset?: { _ref?: string }; alt?: string } & Record<string, unknown>;

export const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string) || '';
export const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string) || 'production';
export const apiVersion = (import.meta.env.PUBLIC_SANITY_API_VERSION as string) || '2024-01-01';
// Server-side læse-token. Uden PUBLIC_-præfiks, så det ALDRIG kommer med i
// klient-bundtet — bruges kun ved build. Nødvendigt hvis datasettet er privat
// (så foresporgsler med kundedata ikke kan læses offentligt).
const sanityToken = (import.meta.env.SANITY_API_TOKEN as string) || '';

/** Er der overhovedet et Sanity-projekt at hente fra? */
export const sanityKonfigureret = projectId.length > 0;

export const sanityClient: SanityClient | null = sanityKonfigureret
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Build-time fetch: hent altid friskeste publicerede data (ikke CDN,
      // som kan være op til 60 sek. bagud). Sikrer at et webhook-udløst
      // build lige efter en publicering får den nye version med.
      useCdn: false,
      perspective: 'published',
      // Med token kan build'et læse et privat dataset. Er token tomt (fx før
      // det er sat i Cloudflare), læses datasettet uden auth som hidtil.
      token: sanityToken || undefined,
    })
  : null;

const builder = sanityKonfigureret ? imageUrlBuilder({ projectId, dataset }) : null;

/** Byg en billed-URL fra et Sanity-image. Returnerer null hvis ikke konfigureret. */
export function urlFor(kilde: SanityImage | undefined | null) {
  // Uden asset (fx et tomt billedfelt i Sanity) kaster image-builderen
  // "Unable to resolve image URL". Returnér null i stedet, så ét ødelagt
  // billede ikke vælter hele build'et og tvinger fallback til demo-data.
  if (!builder || !kilde || !kilde.asset) return null;
  return builder.image(kilde as never);
}
