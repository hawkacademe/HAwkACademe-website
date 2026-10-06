import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transport = null;
if (config.mail.host) {
  transport = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: config.mail.user ? { user: config.mail.user, pass: config.mail.pass } : undefined
  });
}

export const mailConfigured = () => !!transport;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Emails a new Contact-form enquiry to the institute. Returns true when sent.
export async function sendEnquiryEmail(enquiry, to) {
  const rows = [
    ['Reference', enquiry.ref], ['Student name', enquiry.name], ['Phone', enquiry.phone], ['Email', enquiry.email],
    ['Current class', enquiry.studentClass], ['Program', enquiry.program], ['Centre', enquiry.centre], ['Message', enquiry.message]
  ].filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nOpen the admin panel to mark it as handled: ${config.siteUrl}/admin/enquiries`;
  if (!transport || !to) {
    console.log(`[mail] Not sent (${!transport ? 'SMTP not configured' : 'no enquiry email set'}). New enquiry:\n${text}`);
    return false;
  }
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A1530">
<h2 style="color:#D90A0A;margin:0 0 12px">New enquiry from the website</h2>
<table cellpadding="8" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="background:#F6F8FC;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>
<p><a href="${config.siteUrl}/admin/enquiries" style="color:#D90A0A">Open the admin panel</a> to mark it as handled.</p></div>`;
  await transport.sendMail({
    from: config.mail.from,
    to,
    replyTo: enquiry.email || undefined,
    subject: `New website enquiry from ${enquiry.name} (${enquiry.ref})`,
    text,
    html
  });
  return true;
}
