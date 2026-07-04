// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// Sitens kanoniske adresse. Bruges til canonical, Open Graph og sitemap.
const SITE = process.env.PUBLIC_SITE_URL || 'https://cykelmov.dk';

export default defineConfig({
  site: SITE,
  // output: 'static' (standard i Astro 5). Alle sider prerendes ved build.
  // Kun /api/reserver kører on-demand (den har prerender = false) via Cloudflare-adapteren.
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'passthrough',
  }),
  integrations: [
    tailwind({
      // Vi genbruger det eksisterende designsystem i global.css.
      // Tailwinds preflight slås fra, så den ikke overskriver vores reset.
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
});
