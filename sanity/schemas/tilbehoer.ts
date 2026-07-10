import { defineType, defineField } from 'sanity';

// Tilbehør & Reservedele — produkter man kan købe i butikken.
// Prisen er inkl. montering. Importeret fra det gamle WooCommerce-site.
export default defineType({
  name: 'tilbehoer',
  title: 'Tilbehør & Reservedele',
  type: 'document',
  fields: [
    defineField({ name: 'navn', title: 'Navn', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'navn', maxLength: 96 },
    }),
    defineField({
      name: 'pris',
      title: 'Pris (kr.)',
      type: 'number',
      description: 'Prisen er inkl. montering.',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'prisInklMontering',
      title: 'Pris inkl. montering',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'kategori',
      title: 'Underkategori',
      type: 'string',
      description: 'Fx Cykellygter, Cykellås, Kurve — fra det oprindelige site.',
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
      options: { layout: 'grid' },
    }),
    defineField({ name: 'kortBeskrivelse', title: 'Kort beskrivelse', type: 'text', rows: 2 }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'aktiv',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Slå fra for at skjule produktet uden at slette det.',
      initialValue: true,
    }),
    defineField({ name: 'raekkefolge', title: 'Rækkefølge', type: 'number', initialValue: 100 }),
    defineField({
      name: 'kildeUrl',
      title: 'Kilde-URL (oprindeligt produkt)',
      type: 'url',
      readOnly: true,
    }),
  ],
  orderings: [
    { title: 'Rækkefølge', name: 'raekkefolgeAsc', by: [{ field: 'raekkefolge', direction: 'asc' }] },
    { title: 'Navn A-Å', name: 'navnAsc', by: [{ field: 'navn', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'navn', kategori: 'kategori', pris: 'pris', media: 'billeder.0', aktiv: 'aktiv' },
    prepare({ title, kategori, pris, media, aktiv }) {
      return {
        title,
        subtitle: [pris != null ? `${pris} kr.` : null, kategori, aktiv === false ? '— skjult' : null]
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
});
