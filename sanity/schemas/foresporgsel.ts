import { defineType, defineField } from 'sanity';

// Oprettes automatisk af reservationsformularen (POST /api/reserver).
// Giver butikken et overblik i Studio ud over mailen fra Web3Forms.
export default defineType({
  name: 'foresporgsel',
  title: 'Forespørgsel',
  type: 'document',
  fields: [
    defineField({
      name: 'objekt',
      title: 'Vedrører',
      type: 'string',
      description: 'Cyklen eller ydelsen, henvendelsen handler om.',
      readOnly: true,
    }),
    defineField({
      name: 'cykelRef',
      title: 'Cykel',
      type: 'reference',
      to: [{ type: 'cykel' }],
      weak: true,
      readOnly: true,
    }),
    defineField({
      name: 'tilkoeb',
      title: 'Tilkøb',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Valgte tilkøb (fx lås, lygtesæt).',
      readOnly: true,
    }),
    defineField({ name: 'navn', title: 'Navn', type: 'string', readOnly: true }),
    defineField({ name: 'telefon', title: 'Telefon', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', readOnly: true }),
    defineField({ name: 'oensketTid', title: 'Ønsket tid', type: 'string', readOnly: true }),
    defineField({ name: 'besked', title: 'Besked', type: 'text', rows: 4, readOnly: true }),
    defineField({ name: 'modtaget', title: 'Modtaget', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ny', value: 'ny' },
          { title: 'Kontaktet', value: 'kontaktet' },
          { title: 'Afsluttet', value: 'afsluttet' },
        ],
        layout: 'radio',
      },
      initialValue: 'ny',
    }),
  ],
  orderings: [
    {
      title: 'Nyeste først',
      name: 'modtagetDesc',
      by: [{ field: 'modtaget', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'navn', objekt: 'objekt', status: 'status', modtaget: 'modtaget' },
    prepare({ title, objekt, status, modtaget }) {
      const dato = modtaget ? new Date(modtaget).toLocaleDateString('da-DK') : '';
      const statusTekst: Record<string, string> = {
        ny: '🔵 Ny',
        kontaktet: '🟡 Kontaktet',
        afsluttet: '✅ Afsluttet',
      };
      return {
        title: `${title || 'Uden navn'} — ${objekt || 'henvendelse'}`,
        subtitle: [statusTekst[status] || status, dato].filter(Boolean).join(' · '),
      };
    },
  },
});
