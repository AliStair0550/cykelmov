import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// Projekt-ID og dataset læses fra miljøet (sanity/.env).
// SANITY_STUDIO_PROJECT_ID=xxxx  ·  SANITY_STUDIO_DATASET=production
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'cykelmov',
  title: 'Cykelmov',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Indhold')
          .items([
            S.documentTypeListItem('cykel').title('Cykler'),
            S.documentTypeListItem('vaerkstedsydelse').title('Værkstedsydelser'),
            S.divider(),
            S.documentTypeListItem('foresporgsel').title('Forespørgsler'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
