// ============================================================
// POST /api/reserver
// Behandler reservations-, booking- og kontaktformularer:
//   1. Sender en mail via Web3Forms (samme nøgle som det gamle site)
//   2. Opretter et "foresporgsel"-dokument i Sanity (butikkens overblik)
//   3. Redirecter til /reserver?tak=1
// Kører on-demand på Cloudflare (prerender = false). Hemmeligheder
// læses fra runtime-env (prod) eller import.meta.env (dev).
// ============================================================
import type { APIRoute } from 'astro';

export const prerender = false;

const TID_LABEL: Record<string, string> = {
  denne_uge: 'Denne uge',
  naeste_uge: 'Næste uge',
  fleksibel: 'Fleksibel',
};

function laesEnv(locals: App.Locals, key: string): string | undefined {
  const runtimeEnv = (locals as unknown as { runtime?: { env?: Record<string, string> } })?.runtime?.env;
  return runtimeEnv?.[key] ?? (import.meta.env as Record<string, string | undefined>)[key];
}

function felt(form: FormData, navn: string): string {
  const v = form.get(navn);
  return typeof v === 'string' ? v.trim() : '';
}

function fejlSvar(besked: string): Response {
  const html = `<!doctype html><html lang="da"><head><meta charset="utf-8"><title>Noget gik galt</title>
<style>body{font-family:system-ui,sans-serif;background:#F5F3ED;color:#141419;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center}a{color:#1D3EE3}</style></head>
<body><div><h1>Hovsa</h1><p>${besked}</p><p><a href="javascript:history.back()">Gå tilbage og prøv igen</a></p></div></body></html>`;
  return new Response(html, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fejlSvar('Kunne ikke læse formularen.');
  }

  // Honeypot: udfyldt = bot. Lad som om alt gik godt.
  if (felt(form, 'botcheck')) {
    return redirect('/reserver?tak=1', 303);
  }

  const type = felt(form, 'type') || 'cykel'; // cykel | ydelse | kontakt
  const objekt = felt(form, 'objekt');
  const reference = felt(form, 'reference');
  const navn = felt(form, 'navn');
  const telefon = felt(form, 'telefon');
  const email = felt(form, 'email');
  const tidVaerdi = felt(form, 'tid');
  const tid = TID_LABEL[tidVaerdi] ?? tidVaerdi;
  const besked = felt(form, 'besked');

  // Server-side validering (backstop for browserens required-felter)
  if (!navn || !telefon || !email) {
    return fejlSvar('Udfyld venligst navn, telefon og e-mail.');
  }

  const web3Key = laesEnv(locals, 'PUBLIC_WEB3FORMS_KEY');
  const projectId = laesEnv(locals, 'PUBLIC_SANITY_PROJECT_ID');
  const dataset = laesEnv(locals, 'PUBLIC_SANITY_DATASET') || 'production';
  const apiVersion = laesEnv(locals, 'PUBLIC_SANITY_API_VERSION') || '2024-01-01';
  const token = laesEnv(locals, 'SANITY_API_TOKEN');

  const emneTekst =
    type === 'kontakt'
      ? 'Ny henvendelse fra cykelmov.dk'
      : type === 'ydelse'
        ? `Ny booking: ${objekt || 'værkstedstid'}`
        : `Ny reservation: ${objekt || 'cykel'}`;

  // 1) Web3Forms — mail til butikken
  if (web3Key) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: emneTekst,
          from_name: navn,
          Navn: navn,
          Telefon: telefon,
          Email: email,
          Vedrører: objekt || '—',
          'Ønsket tid': tid || '—',
          Besked: besked || '—',
          Type: type,
        }),
      });
    } catch (err) {
      console.error('[reserver] Web3Forms fejlede:', (err as Error).message);
    }
  } else {
    console.warn('[reserver] PUBLIC_WEB3FORMS_KEY mangler, springer mail over.');
  }

  // 2) Sanity — opret foresporgsel-dokument
  if (projectId && token) {
    const doc: Record<string, unknown> = {
      _type: 'foresporgsel',
      navn,
      telefon,
      email,
      besked,
      objekt: objekt || '',
      oensketTid: tid || '',
      modtaget: new Date().toISOString(),
      status: 'ny',
    };
    // Kun rigtige Sanity-cykler kan refereres (demo-id'er springes over).
    if (type === 'cykel' && reference && !reference.startsWith('demo-')) {
      doc.cykelRef = { _type: 'reference', _ref: reference, _weak: true };
    }
    try {
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ mutations: [{ create: doc }] }),
        },
      );
      if (!res.ok) {
        console.error('[reserver] Sanity-mutation fejlede:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[reserver] Sanity-mutation fejlede:', (err as Error).message);
    }
  } else {
    console.warn('[reserver] Sanity-token/projekt mangler, springer foresporgsel over.');
  }

  return redirect('/reserver?tak=1', 303);
};

// Direkte GET-besøg sendes til tak-siden.
export const GET: APIRoute = ({ redirect }) => redirect('/reserver', 302);
