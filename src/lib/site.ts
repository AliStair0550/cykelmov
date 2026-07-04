// ============================================================
// Cykelmov — faste sitedata (NAP, aabningstider, navigation).
// Ét sted at rette adresse, telefon og menu.
// ============================================================

export const site = {
  navn: 'Cykelmov',
  tagline: 'Gadens cykelbutik',
  slogan: 'Cykelmov, gadens cykelbutik',
  url: (import.meta.env.PUBLIC_SITE_URL as string) || 'https://cykelmov.dk',
  telefon: '31 72 78 88',
  telefonE164: '+4531727888',
  email: 'cykelmov@gmail.com',
  adresse: {
    gade: 'Nørrebrogade 74, st. tv.',
    postnr: '2200',
    by: 'København N',
    land: 'DK',
    lat: 55.6935,
    lng: 12.5497,
  },
  maps: 'https://maps.google.com/?q=N%C3%B8rrebrogade+74,+2200+K%C3%B8benhavn+N',
  aabningstider: [
    { dage: 'Man-fre', tid: '10.00 - 18.00' },
    { dage: 'Lørdag', tid: '10.00 - 15.00' },
    { dage: 'Søndag', tid: 'Lukket, vi cykler selv' },
  ],
  // Struktureret til LocalBusiness/JSON-LD.
  aabningJsonLd: [
    { dage: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' },
    { dage: ['Saturday'], opens: '10:00', closes: '15:00' },
  ],
} as const;

// Hovednavigation. `match` bruges til at markere det aktive punkt.
export const nav = [
  { href: '/cykler/dame', label: 'Damecykler', match: '/cykler/dame' },
  { href: '/cykler/herre', label: 'Herrecykler', match: '/cykler/herre' },
  { href: '/cykler/boern', label: 'Børnecykler', match: '/cykler/boern' },
  { href: '/vaerksted', label: 'Værksted', match: '/vaerksted' },
] as const;

// Danske etiketter til enum-vaerdier fra Sanity.
export const koenLabel: Record<string, string> = {
  herre: 'Herre',
  dame: 'Dame',
  boern: 'Børn',
};

export const typeLabel: Record<string, string> = {
  by: 'Bycykel',
  mountainbike: 'Mountainbike',
  racer: 'Racer',
  gravel: 'Gravel',
  elcykel: 'Elcykel',
  klapcykel: 'Klapcykel',
};

export const statusLabel: Record<string, string> = {
  paa_lager: 'På lager',
  kommer_snart: 'Kommer snart',
  udsolgt: 'Udsolgt',
};

export const tidValg = [
  { value: 'denne_uge', label: 'Denne uge' },
  { value: 'naeste_uge', label: 'Næste uge' },
  { value: 'fleksibel', label: 'Fleksibel' },
] as const;
