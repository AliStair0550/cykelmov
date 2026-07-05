import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'vaerkstedsydelse',
  title: 'Værkstedsydelse',
  type: 'document',
  fields: [
    defineField({ name: 'navn', title: 'Navn', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'navn', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Service', value: 'service' },
          { title: 'Reparation', value: 'reparation' },
          { title: 'Dæk og hjul', value: 'daek' },
          { title: 'Elcykel', value: 'elcykel' },
          { title: 'Tilbehør', value: 'tilbehoer' },
          { title: 'Sæson', value: 'saeson' },
          { title: 'Akut hjælp', value: 'akut' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fraPris',
      title: 'Pris (kr.)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'fastPris',
      title: 'Fast pris',
      type: 'boolean',
      description: 'Slå til hvis prisen er fast (vises uden "fra").',
      initialValue: false,
    }),
    defineField({ name: 'estimeretTid', title: 'Estimeret tid', type: 'string' }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'billede',
      title: 'Billede',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt-tekst', type: 'string' }],
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
    select: { title: 'navn', kategori: 'kategori', pris: 'fraPris', media: 'billede' },
    prepare({ title, kategori, pris, media }) {
      return {
        title,
        subtitle: [kategori, pris ? `fra ${pris} kr.` : null].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
