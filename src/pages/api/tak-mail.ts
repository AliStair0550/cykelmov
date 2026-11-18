// ============================================================
// Webhook-modtager for forespørgsler i Sanity. Én webhook, to mails:
//   status "klar"      → "Din cykel er klar"  (markeres klarMailSendtAt)
//   status "afsluttet" → tak-mail             (markeres mailSendtAt)
// Webhook-filter i Sanity:
//   _type == "foresporgsel" && status in ["klar", "afsluttet"]
// Kører on-demand på Cloudflare (Pages Function).
//
// Sikkerhed:  HMAC-signatur valideres med SANITY_WEBHOOK_SECRET.
// Kilde:      Dokumentet hentes direkte fra Sanity; status afgør mailen.
// Idempotens: hver mail sendes kun hvis dens tidsstempel ikke er sat.
//             Efter afsendelse skrives det tilbage via SANITY_WRITE_TOKEN,
//             så gentagne statusskift ALDRIG sender samme mail igen.
// Mail:       Resend API, afsender "Cykelmov <hej@cykelmov.dk>".
// ============================================================
import type { APIRoute } from 'astro';
import { site } from '../../lib/site';
import { byggKlarMail, klarEmne, type ForespoergselDoc } from '../../lib/klarMail';

export const prerender = false;

const ANMELDELSE_URL = 'https://g.page/r/CVMTVkhMnoSkEAE/review';

function laesEnv(locals: App.Locals, key: string): string | undefined {
  const runtimeEnv = (locals as unknown as { runtime?: { env?: Record<string, string> } })?.runtime
    ?.env;
  return runtimeEnv?.[key] ?? (import.meta.env as Record<string, string | undefined>)[key];
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function base64url(buf: ArrayBuffer): string {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Konstant-tid sammenligning, så vi ikke lækker signaturen via timing.
function sikkerLige(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Sanitys webhook-signatur: header "sanity-webhook-signature: t=<ts>,v1=<sig>",
// hvor sig = base64url(HMAC-SHA256("<ts>.<body>", secret)).
export async function gyldigSignatur(
  body: string,
  header: string | null,
  secret: string,
): Promise<boolean> {
  if (!header) return false;
  const dele = Object.fromEntries(
    header.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    }),
  );
  const ts = dele.t;
  const sig = dele.v1;
  if (!ts || !sig) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}.${body}`));
  return sikkerLige(base64url(mac), sig);
}

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Tak-mailen. Simpel, tabel-baseret HTML i brandfarverne (asfalt/kridt/cobalt).
export function byggMail(navn: string): string {
  const fornavn = (navn || '').trim().split(/\s+/)[0];
  const hej = fornavn ? `Hej ${esc(fornavn)}.` : 'Hej.';
  const tlf = site.telefon;
  return `<!doctype html>
<html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F3ED;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3ED;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;">
        <tr><td style="background:#141419;padding:20px 32px;">
          <span style="color:#F5F3ED;font-size:20px;font-weight:700;letter-spacing:-.01em;">Cykel<span style="color:#1D3EE3;">mov</span></span>
        </td></tr>
        <tr><td style="padding:32px;color:#141419;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">${hej} Tak fordi du valgte os.</p>
          <p style="margin:0 0 16px;">Er der noget med cyklen eller reparationen, så ring på ${esc(tlf)}. Så finder vi ud af det.</p>
          <p style="margin:0 0 14px;">Hvis du er glad for os, betyder en anmeldelse på Google alt for en lille butik.</p>
          <p style="margin:0 0 24px;font-size:22px;line-height:1;letter-spacing:6px;">🚲 🚲 🚲 🚲 🚲</p>
          <p style="margin:0 0 30px;">
            <a href="${ANMELDELSE_URL}" style="display:inline-block;background:#1D3EE3;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px;">Giv os en anmeldelse</a>
          </p>
          <p style="margin:0;color:#141419;">Venlig hilsen<br>Cykelmov<br>${esc(site.adresse.gade.replace(', st. tv.', ''))}, ${esc(site.adresse.postnr)} ${esc(site.adresse.by)}</p>
        </td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid #e6e3db;color:#8a8a93;font-size:12px;line-height:1.5;">
          Du får denne mail fordi du har handlet hos os. Ønsker du ikke mails fra os, så svar med et nej tak.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const secret = laesEnv(locals, 'SANITY_WEBHOOK_SECRET');
  const resendKey = laesEnv(locals, 'RESEND_API_KEY');
  const writeToken = laesEnv(locals, 'SANITY_WRITE_TOKEN');
  const projectId = laesEnv(locals, 'PUBLIC_SANITY_PROJECT_ID');
  const dataset = laesEnv(locals, 'PUBLIC_SANITY_DATASET') || 'production';
  const apiVersion = laesEnv(locals, 'PUBLIC_SANITY_API_VERSION') || '2024-01-01';

  const body = await request.text();

  // 1) Validér signatur.
  if (!secret) return json({ error: 'server mangler SANITY_WEBHOOK_SECRET' }, 500);
  if (!(await gyldigSignatur(body, request.headers.get('sanity-webhook-signature'), secret))) {
    return json({ error: 'ugyldig signatur' }, 401);
  }

  let payload: { id?: string; _id?: string; name?: string; email?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ error: 'ugyldig json' }, 400);
  }
  const id = payload.id || payload._id;
  if (!id || id.startsWith('drafts.')) return json({ error: 'mangler (publiceret) id' }, 400);

  if (!projectId || !writeToken) return json({ error: 'server mangler Sanity-konfig' }, 500);
  const sanityBase = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;
  const sanityHead = { 'Content-Type': 'application/json', Authorization: `Bearer ${writeToken}` };

  // 2) Hent dokumentet autoritativt (status + hvilke mails der er sendt).
  //    Fejler det, svarer vi 502, så Sanity prøver igen — vi gætter aldrig.
  let doc: ForespoergselDoc | null = null;
  try {
    const q = encodeURIComponent(
      '*[_id == $id][0]{status, type, navn, email, objekt, mailSendtAt, klarMailSendtAt}',
    );
    const res = await fetch(
      `${sanityBase}/query/${dataset}?query=${q}&$id=${encodeURIComponent(JSON.stringify(id))}`,
      { headers: sanityHead },
    );
    if (!res.ok) return json({ error: 'kunne ikke hente dokument', status: res.status }, 502);
    doc = ((await res.json()) as { result?: ForespoergselDoc | null }).result ?? null;
  } catch (err) {
    return json({ error: 'sanity-kald fejlede', detail: (err as Error).message }, 502);
  }
  if (!doc) return json({ error: 'dokument findes ikke' }, 404);

  // 3) Vælg mail ud fra status.
  let mail: { felt: 'mailSendtAt' | 'klarMailSendtAt'; emne: string; html: string };
  if (doc.status === 'klar') {
    if (doc.type === 'kontakt') return json({ status: 'sprunget over', grund: 'kontakt-henvendelse' });
    if (doc.klarMailSendtAt)
      return json({ status: 'sprunget over', grund: 'klarMailSendtAt sat', klarMailSendtAt: doc.klarMailSendtAt });
    mail = { felt: 'klarMailSendtAt', emne: klarEmne(doc.type), html: byggKlarMail(doc) };
  } else if (doc.status === 'afsluttet') {
    if (doc.mailSendtAt)
      return json({ status: 'sprunget over', grund: 'mailSendtAt sat', mailSendtAt: doc.mailSendtAt });
    mail = {
      felt: 'mailSendtAt',
      emne: 'Tak fordi du valgte Cykelmov',
      html: byggMail(doc.navn || payload.name || ''),
    };
  } else {
    return json({ status: 'sprunget over', grund: `status er ${doc.status ?? 'tom'}` });
  }
  const email = doc.email || payload.email;
  if (!email) return json({ error: 'mangler email' }, 400);

  // 4) Send mailen via Resend.
  if (!resendKey) return json({ error: 'server mangler RESEND_API_KEY' }, 500);
  let resendId: string | undefined;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Cykelmov <hej@cykelmov.dk>',
        to: [email],
        reply_to: 'hej@cykelmov.dk',
        subject: mail.emne,
        html: mail.html,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[tak-mail] Resend fejlede:', res.status, t);
      return json({ error: 'resend fejlede', status: res.status, detail: t }, 502);
    }
    resendId = ((await res.json()) as { id?: string }).id;
  } catch (err) {
    return json({ error: 'resend-kald fejlede', detail: (err as Error).message }, 502);
  }

  // 5) Skriv tidsstemplet tilbage. setIfMissing => selv en samtidig kørsel kan
  //    ikke overskrive/dobbelt-markere.
  try {
    await fetch(`${sanityBase}/mutate/${dataset}`, {
      method: 'POST',
      headers: sanityHead,
      body: JSON.stringify({
        mutations: [{ patch: { id, setIfMissing: { [mail.felt]: new Date().toISOString() } } }],
      }),
    });
  } catch (err) {
    console.error(`[tak-mail] kunne ikke skrive ${mail.felt}:`, (err as Error).message);
  }

  return json({ status: 'sendt', mail: mail.felt === 'klarMailSendtAt' ? 'klar' : 'tak', id, resendId }, 200);
};

// Afvis andre metoder pænt.
export const GET: APIRoute = () => json({ error: 'brug POST' }, 405);
