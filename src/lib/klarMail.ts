// ============================================================
// Mailen "Din cykel er klar". Sendes af /api/tak-mail (samme webhook
// som tak-mailen), når en forespørgsel sættes til status "klar".
// ============================================================
import { site } from './site';

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type ForespoergselDoc = {
  status?: string;
  type?: string;
  navn?: string;
  email?: string;
  objekt?: string;
  klarMailSendtAt?: string | null;
  mailSendtAt?: string | null;
};

export function klarEmne(type?: string): string {
  return type === 'ydelse' ? 'Din cykel er klar fra værkstedet' : 'Din cykel er klar til afhentning';
}

export function byggKlarMail(doc: ForespoergselDoc): string {
  const fornavn = (doc.navn || '').trim().split(/\s+/)[0];
  const hej = fornavn ? `Hej ${esc(fornavn)}.` : 'Hej.';
  const vaerksted = doc.type === 'ydelse';
  const hvad = doc.objekt ? ` (${esc(doc.objekt)})` : '';
  const indled = vaerksted
    ? `Din cykel er færdig fra værkstedet${hvad} og står klar til at blive hentet.`
    : `Din cykel${hvad} står klar til dig i butikken.`;
  const betal = vaerksted ? 'Du betaler for arbejdet, når du henter cyklen.' : '';
  const adresse = `${site.adresse.gade.replace(', st. tv.', '')}, ${site.adresse.postnr} ${site.adresse.by}`;
  const tider = site.aabningstider
    .map(
      (a) =>
        `<tr><td style="padding:3px 16px 3px 0;color:#141419;">${esc(a.dage)}</td><td style="padding:3px 0;color:#141419;font-weight:700;">${esc(a.tid)}</td></tr>`,
    )
    .join('');
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
          <p style="margin:0 0 8px;font-size:24px;line-height:1.2;font-weight:700;">Klar til brostenene 🚲</p>
          <p style="margin:0 0 16px;">${[hej, indled, betal].filter(Boolean).join(' ')}</p>
          <p style="margin:0 0 6px;font-weight:700;">Hent den her</p>
          <p style="margin:0 0 16px;"><a href="${esc(site.maps)}" style="color:#1D3EE3;">${esc(adresse)}</a></p>
          <p style="margin:0 0 6px;font-weight:700;">Åbningstider</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:15px;">${tider}</table>
          <p style="margin:0 0 24px;">Kan du ikke nå det, eller har du spørgsmål, så ring på ${esc(site.telefon)}.</p>
          <p style="margin:0;color:#141419;">Vi ses i butikken<br>Cykelmov</p>
        </td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid #e6e3db;color:#8a8a93;font-size:12px;line-height:1.5;">
          Du får denne mail, fordi du har bestilt hos Cykelmov.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
