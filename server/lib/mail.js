import { config } from '../config.js';

// Email is sent through the Brevo HTTP API (BREVO_API_KEY).

// "Hawk Academe Website <no-reply@hawkacademe.com>" -> { name, email }
function parseAddress(s) {
  const m = String(s).match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].trim() || undefined, email: m[2].trim() } : { email: String(s).trim() };
}

async function send({ from, to, replyTo, subject, text, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': config.mail.brevoApiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: parseAddress(from),
      to: [{ email: to }],
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      subject,
      textContent: text,
      htmlContent: html
    }),
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`Brevo API ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export const mailConfigured = () => !!config.mail.brevoApiKey;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Emails a new Contact-form enquiry to the institute. Returns true when sent.
export async function sendEnquiryEmail(enquiry, to) {
  const rows = [
    ['Reference', enquiry.ref], ['Student name', enquiry.name], ['Phone', enquiry.phone], ['Email', enquiry.email],
    ['Current class', enquiry.studentClass], ['Program', enquiry.program], ['Centre', enquiry.centre], ['Message', enquiry.message]
  ].filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nOpen the admin panel to mark it as handled: ${config.siteUrl}/admin/enquiries`;
  if (!mailConfigured() || !to) {
    console.log(`[mail] Not sent (${!mailConfigured() ? 'BREVO_API_KEY not set' : 'no enquiry email set'}). New enquiry:\n${text}`);
    return false;
  }
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A1530">
<h2 style="color:#D90A0A;margin:0 0 12px">New enquiry from the website</h2>
<table cellpadding="8" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="background:#F6F8FC;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>
<p><a href="${config.siteUrl}/admin/enquiries" style="color:#D90A0A">Open the admin panel</a> to mark it as handled.</p></div>`;
  await send({
    from: config.mail.from,
    to,
    replyTo: enquiry.email || undefined,
    subject: `New website enquiry from ${enquiry.name} (${enquiry.ref})`,
    text,
    html
  });
  return true;
}
