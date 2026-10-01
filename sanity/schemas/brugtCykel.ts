import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'brugtCykel',
  title: 'Brugt cykel',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Kort beskrivelse (valgfrit)',
      type: 'string',
      description: 'Fx gear, stand eller størrelse. Vises under titlen.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'solgt',
      title: 'Solgt',
      type: 'boolean',
      description: 'Slå til, når cyklen er solgt. Solgte cykler vises nederst med et "Solgt"-mærke.',
      initialValue: false,
    }),
    defineField({
      name: 'raekkefolge',
      title: 'Rækkefølge',
      type: 'number',
      description: 'Lavere tal vises først (blandt de tilgængelige).',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Tilgængelige først',
      name: 'tilgaengeligeFoerst',
      by: [
        { field: 'solgt', direction: 'asc' },
        { field: 'raekkefolge', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'titel', pris: 'pris', solgt: 'solgt', media: 'billede' },
    prepare({ title, pris, solgt, media }) {
      return {
        title: solgt ? `${title} (SOLGT)` : title,
        subtitle: pris ? `${pris} kr.` : null,
        media,
      };
    },
  },
});
