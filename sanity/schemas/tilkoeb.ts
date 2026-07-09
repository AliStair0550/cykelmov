import { defineType, defineField } from 'sanity';

// Tilkøb/tilbehør der kan lægges til ved reservation af en cykel
// (fx godkendt lås, lygtesæt, bagagebærer). Styres 100% herfra i Studio.
export default defineType({
  name: 'tilkoeb',
  title: 'Tilkøb',
  type: 'document',
  fields: [
    defineField({ name: 'navn', title: 'Navn', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'pris',
      title: 'Pris (kr.)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'billede',
      title: 'Billede',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt-tekst', type: 'string' }],
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Kort beskrivelse',
      type: 'string',
      description: 'Kort linje, der vises under navnet i booking-boksen (valgfri).',
    }),
    defineField({
      name: 'aktiv',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Slå fra for at skjule tilkøbet midlertidigt uden at slette det.',
      initialValue: true,
    }),
    defineField({
      name: 'raekkefolge',
      title: 'Rækkefølge',
      type: 'number',
      description: 'Lavere tal vises først.',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Rækkefølge',
      name: 'raekkefolgeAsc',
      by: [{ field: 'raekkefolge', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'navn', pris: 'pris', media: 'billede', aktiv: 'aktiv' },
    prepare({ title, pris, media, aktiv }) {
      return {
        title,
        subtitle: [pris ? `${pris} kr.` : null, aktiv === false ? '— skjult' : null]
          .filter(Boolean)
          .join(' '),
        media,
      };
    },
  },
});
