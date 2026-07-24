// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// Sitens kanoniske adresse. Bruges til canonical, Open Graph og sitemap.
const SITE = process.env.PUBLIC_SITE_URL || 'https://cykelmov.dk';

export default defineConfig({
  site: SITE,
  // Standard mappe-format. Canonical og sitemap får efterstillet skråstreg
  // (fx /cykler/), og de interne links bruger samme form, så der ikke sker
  // 308-redirects. API-endpointet /api/reserver forbliver uden skråstreg.
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
    // Sitemap genereres af src/pages/sitemap.xml.ts (custom endpoint på
    // /sitemap.xml), så vi bruger ikke @astrojs/sitemap-integrationen.
  ],
});
