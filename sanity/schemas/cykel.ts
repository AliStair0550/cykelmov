import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cykel',
  title: 'Cykel',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titel', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'koen',
      title: 'Køn',
      type: 'string',
      options: {
        list: [
          { title: 'Herre', value: 'herre' },
          { title: 'Dame', value: 'dame' },
          { title: 'Børn', value: 'boern' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Bycykel', value: 'by' },
          { title: 'Mountainbike', value: 'mountainbike' },
          { title: 'Racer', value: 'racer' },
          { title: 'Gravel', value: 'gravel' },
          { title: 'Elcykel', value: 'elcykel' },
          { title: 'Klapcykel', value: 'klapcykel' },
          { title: 'Børnecykel', value: 'boernecykel' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'brand', title: 'Brand', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'pris',
      title: 'Pris (kr.)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({ name: 'foerpris', title: 'Førpris (kr., valgfrit)', type: 'number' }),
    defineField({
      name: 'kortBeskrivelse',
      title: 'Kort beskrivelse',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'langBeskrivelse',
      title: 'Lang beskrivelse',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'billeder',
      title: 'Billeder',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt-tekst', type: 'string' }],
        },
      ],
      validation: (r) => r.required().min(1).max(6),
    }),
    defineField({
      name: 'specifikationer',
      title: 'Specifikationer',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'gear', title: 'Gear', type: 'string' },
        {
          name: 'stoerrelser',
          title: 'Størrelser tilgængelige',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        },
        { name: 'vaegt', title: 'Vægt (kg)', type: 'number' },
        {
          name: 'farver',
          title: 'Farver',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'På lager', value: 'paa_lager' },
          { title: 'Kommer snart', value: 'kommer_snart' },
          { title: 'Udsolgt', value: 'udsolgt' },
        ],
      },
      initialValue: 'paa_lager',
    }),
    defineField({
      name: 'fremhaev',
      title: 'Fremhæv på forsiden',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'seoTitel', title: 'SEO-titel (valgfri)', type: 'string' }),
    defineField({ name: 'seoBeskrivelse', title: 'SEO-beskrivelse (valgfri)', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'titel', brand: 'brand', pris: 'pris', media: 'billeder.0' },
    prepare({ title, brand, pris, media }) {
      return {
        title,
        subtitle: [brand, pris ? `${pris} kr.` : null].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
