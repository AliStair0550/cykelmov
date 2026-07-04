// ============================================================
// Demo-/fallback-data. Bruges når Sanity ikke er konfigureret (eller
// er tomt), så sitet aldrig står tomt ved første deploy.
// Samme 6 cykler + 4 ydelser findes som NDJSON i sanity/seed/ til
// import i det rigtige Sanity-datasæt.
// ============================================================
import type { Billede, Cykel, PortableBlock, Ydelse } from './types';

function lokalBillede(path: string, alt: string): Billede {
  return { url: path, thumbUrl: path, alt };
}

function afsnit(text: string): PortableBlock {
  return { _type: 'block', style: 'normal', children: [{ _type: 'span', text }] };
}
function overskrift(text: string): PortableBlock {
  return { _type: 'block', style: 'h3', children: [{ _type: 'span', text }] };
}
function punkt(text: string): PortableBlock {
  return { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text }] };
}

export const demoCykler: Cykel[] = [
  {
    _id: 'demo-kildemoes-street-herre',
    titel: 'Kildemoes Street Herre, 7 gear',
    slug: 'kildemoes-street-herre-7-gear',
    koen: 'herre',
    type: 'by',
    brand: 'Kildemoes',
    pris: 4999,
    foerpris: 5799,
    kortBeskrivelse:
      'Klassisk dansk bycykel med 7 indvendige Shimano-gear, fodbremse og let alu-stel. Bygget til daglig pendling på brostenene.',
    langBeskrivelse: [
      afsnit(
        'Kildemoes Street er pendlerens arbejdshest. Det lette aluminiumsstel gør den nem at trække op ad trappen, og de indvendige Shimano Nexus-gear kræver stort set ingen vedligeholdelse, uanset vejr og årstid.',
      ),
      overskrift('Til hverdagen på Nørrebro'),
      afsnit(
        'Oprejst siddestilling, brede dæk med refleks og fuld skærmpakke. Cyklen leveres med lås, lygter og bagagebærer, monteret og klar til at køre fra butikken.',
      ),
      punkt('Vedligeholdelsesfrie Shimano Nexus-navgear'),
      punkt('Fodbremse plus håndbremse foran'),
      punkt('Kevlar-dæk med refleks efter dansk lov'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/herre-movi.jpg', 'Kildemoes Street herrecykel i mat sort'),
      lokalBillede('/assets/produkter/herre-dutch.jpg', 'Kildemoes Street set fra siden'),
    ],
    specifikationer: {
      gear: '7 gear Shimano Nexus',
      stoerrelser: ['51 cm', '55 cm', '59 cm'],
      vaegt: 16.5,
      farver: ['Mat sort', 'Petrol'],
    },
    status: 'paa_lager',
    fremhaev: true,
    seoTitel: null,
    seoBeskrivelse: null,
  },
  {
    _id: 'demo-trek-marlin-5',
    titel: 'Trek Marlin 5',
    slug: 'trek-marlin-5',
    koen: 'herre',
    type: 'mountainbike',
    brand: 'Trek',
    pris: 5499,
    foerpris: null,
    kortBeskrivelse:
      'Robust hardtail til grus, skov og bykant. Aluminiumsstel, luftaffjedret forgaffel og 2x8 Shimano-gear.',
    langBeskrivelse: [
      afsnit(
        'Trek Marlin 5 er indgangen til rigtig mountainbike. Den holder til en tur i Dyrehaven i weekenden og til daglig pendling på asfalt resten af ugen.',
      ),
      overskrift('Alt-terræn uden dikkedarer'),
      afsnit(
        'Forgaflen tager stødene fra brosten og trærødder, og de brede dæk giver greb i grus. Skivebremser sikrer opbremsning, også når det er vådt.',
      ),
      punkt('Alpha Silver aluminiumsstel'),
      punkt('16 gear Shimano Altus'),
      punkt('Mekaniske skivebremser for og bag'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/herre-oscar.jpg', 'Trek Marlin 5 mountainbike'),
      lokalBillede('/assets/produkter/herre-fixie.jpg', 'Trek Marlin 5 detalje'),
    ],
    specifikationer: {
      gear: '16 gear Shimano Altus',
      stoerrelser: ['S', 'M', 'L', 'XL'],
      vaegt: 14.2,
      farver: ['Sort', 'Rød'],
    },
    status: 'paa_lager',
    fremhaev: true,
    seoTitel: null,
    seoBeskrivelse: null,
  },
  {
    _id: 'demo-mbk-bianca',
    titel: 'MBK Bianca, 7 gear',
    slug: 'mbk-bianca-7-gear',
    koen: 'dame',
    type: 'by',
    brand: 'MBK',
    pris: 3799,
    foerpris: 4299,
    kortBeskrivelse:
      'Elegant damecykel med lav indstigning, kurv og komfortsadel. 7 gear til byens bakker og broer.',
    langBeskrivelse: [
      afsnit(
        'MBK Bianca er den nette bycykel med lav indstigning, så du let kommer på og af, også med nederdel eller frakke. Frontkurven tager taske og indkøb.',
      ),
      overskrift('Komfort hele vejen'),
      afsnit(
        'Gelsadel, ergonomiske greb og oprejst styr gør turen behagelig. 7 gear giver overskud på broerne uden at gøre cyklen tung.',
      ),
      punkt('Lav indstigning'),
      punkt('Frontkurv og bagagebærer inkluderet'),
      punkt('7 gear Shimano med håndbremser'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/dame-merla.jpg', 'MBK Bianca damecykel i creme'),
      lokalBillede('/assets/produkter/dame-liva.jpg', 'MBK Bianca med kurv'),
    ],
    specifikationer: {
      gear: '7 gear Shimano',
      stoerrelser: ['50 cm', '54 cm'],
      vaegt: 17,
      farver: ['Creme', 'Dueblå'],
    },
    status: 'paa_lager',
    fremhaev: true,
    seoTitel: null,
    seoBeskrivelse: null,
  },
  {
    _id: 'demo-kildemoes-logic-el',
    titel: 'Kildemoes Logic Dame El',
    slug: 'kildemoes-logic-elcykel-dame',
    koen: 'dame',
    type: 'elcykel',
    brand: 'Kildemoes',
    pris: 16999,
    foerpris: 18999,
    kortBeskrivelse:
      'Elcykel med midtermotor, trinløst gear og lang rækkevidde. Byens bakker forsvinder under dig.',
    langBeskrivelse: [
      afsnit(
        'Kildemoes Logic med midtermotor giver et roligt, naturligt skub, uanset om du kører mod vind over Dronning Louises Bro eller er tungt lastet hjem fra Netto.',
      ),
      overskrift('Rækkevidde til hele ugen'),
      afsnit(
        'Batteriet holder op til 100 km på en opladning, afhængigt af niveau og terræn. Det trinløse Enviolo-gear skifter blødt, også når du holder stille.',
      ),
      punkt('Midtermotor med 5 understøtningsniveauer'),
      punkt('Enviolo trinløst gear'),
      punkt('Integreret lys og aflåseligt batteri'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/dame-single.jpg', 'Kildemoes Logic elcykel til dame'),
      lokalBillede('/assets/produkter/dame-liva.jpg', 'Kildemoes Logic detalje'),
    ],
    specifikationer: {
      gear: 'Enviolo trinløs',
      stoerrelser: ['48 cm', '52 cm'],
      vaegt: 24,
      farver: ['Sart grøn', 'Mørk grå'],
    },
    status: 'kommer_snart',
    fremhaev: false,
    seoTitel: null,
    seoBeskrivelse: null,
  },
  {
    _id: 'demo-mbk-troll-20',
    titel: 'MBK Troll 20 tommer',
    slug: 'mbk-troll-20',
    koen: 'boern',
    type: 'by',
    brand: 'MBK',
    pris: 2299,
    foerpris: null,
    kortBeskrivelse:
      'Solid børnecykel til 6-9-årige. 20 tommer hjul, fodbremse og støttehjul med i købet.',
    langBeskrivelse: [
      afsnit(
        'MBK Troll er den første rigtige cykel. Lav standover-højde gør den tryg at lære på, og fodbremsen er nem for små ben.',
      ),
      overskrift('Klar til skolevejen'),
      afsnit(
        'Fuld skærm, kædeskærm og refleks efter loven. Støttehjul følger med og kan tages af, når barnet er klar.',
      ),
      punkt('20 tommer hjul til ca. 6-9 år'),
      punkt('Fodbremse plus håndbremse'),
      punkt('Støttehjul inkluderet'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/herre-fixie.jpg', 'MBK Troll børnecykel 20 tommer'),
    ],
    specifikationer: {
      gear: '1 gear med fodbremse',
      stoerrelser: ['20 tommer'],
      vaegt: 11,
      farver: ['Blå', 'Pink'],
    },
    status: 'paa_lager',
    fremhaev: false,
    seoTitel: null,
    seoBeskrivelse: null,
  },
  {
    _id: 'demo-kildemoes-bikerz-24',
    titel: 'Kildemoes Bikerz 24 tommer, 7 gear',
    slug: 'kildemoes-bikerz-24',
    koen: 'boern',
    type: 'mountainbike',
    brand: 'Kildemoes',
    pris: 3199,
    foerpris: 3599,
    kortBeskrivelse:
      'Junior-mountainbike med 7 gear og skivebremser. Til de 8-12-årige, der vil have fart på.',
    langBeskrivelse: [
      afsnit(
        'Kildemoes Bikerz er en rigtig junior-mountainbike, ikke en legetøjscykel. 7 gear og skivebremser giver barnet kontrol på både grus og asfalt.',
      ),
      overskrift('Vokser med barnet'),
      afsnit(
        'Sadel og styr kan justeres i højden, så cyklen følger med de første par år. Robuste 24 tommer dæk klarer både fortovskant og skovsti.',
      ),
      punkt('24 tommer hjul til ca. 8-12 år'),
      punkt('7 gear Shimano'),
      punkt('Mekaniske skivebremser'),
    ],
    billeder: [
      lokalBillede('/assets/produkter/herre-oscar.jpg', 'Kildemoes Bikerz junior-mountainbike 24 tommer'),
    ],
    specifikationer: {
      gear: '7 gear Shimano',
      stoerrelser: ['24 tommer'],
      vaegt: 12.5,
      farver: ['Sort/lime'],
    },
    status: 'paa_lager',
    fremhaev: false,
    seoTitel: null,
    seoBeskrivelse: null,
  },
];

export const demoYdelser: Ydelse[] = [
  {
    _id: 'demo-serviceeftersyn',
    navn: 'Serviceeftersyn',
    slug: 'serviceeftersyn',
    kategori: 'service',
    fraPris: 499,
    estimeretTid: 'Samme dag',
    beskrivelse: [
      afsnit(
        'Fuld gennemgang af gear, bremser, kæde, hjul og lys. Vi strammer, justerer og smører, og fortæller ærligt, hvad der eventuelt trænger til udskiftning, før vi gør noget.',
      ),
      punkt('Justering af gear og bremser'),
      punkt('Kontrol af kæde, eger og dæk'),
      punkt('Test af lys og reflekser'),
    ],
    billede: lokalBillede('/assets/vaerksted-vaerktoej.jpg', 'Værktøj i Cykelmovs værksted'),
    raekkefolge: 1,
  },
  {
    _id: 'demo-slangeskift',
    navn: 'Slangeskift',
    slug: 'slangeskift',
    kategori: 'daek',
    fraPris: 249,
    estimeretTid: 'Mens du venter',
    beskrivelse: [
      afsnit(
        'Ny slange monteret, mens du venter. Kan slangen lappes, klarer vi det for 99 kr. Dæk afregnes til dagspris, og du får altid prisen at vide først.',
      ),
    ],
    billede: lokalBillede('/assets/vaerksted-daek.jpg', 'Cykeldæk på lager i værkstedet'),
    raekkefolge: 2,
  },
  {
    _id: 'demo-gearjustering',
    navn: 'Gearjustering',
    slug: 'gearjustering',
    kategori: 'reparation',
    fraPris: 149,
    estimeretTid: '30-45 min',
    beskrivelse: [
      afsnit(
        'Indvendige og udvendige gear stilles præcist ind, inklusive stramning af kabler. Skifter dine gear dårligt eller hopper de, er det som regel her, løsningen ligger.',
      ),
    ],
    billede: null,
    raekkefolge: 3,
  },
  {
    _id: 'demo-elcykel-service',
    navn: 'Elcykel-service',
    slug: 'elcykel-service',
    kategori: 'elcykel',
    fraPris: 699,
    estimeretTid: '1-2 dage',
    beskrivelse: [
      afsnit(
        'Fuldt eftersyn af elcyklen med tjek af motor, batteri, display og elektronik oveni det mekaniske serviceeftersyn. Vi servicerer alle el-mærker.',
      ),
      punkt('Diagnose af motor og batteri'),
      punkt('Opdatering og test af display'),
      punkt('Mekanisk eftersyn af gear og bremser'),
    ],
    billede: null,
    raekkefolge: 4,
  },
];
