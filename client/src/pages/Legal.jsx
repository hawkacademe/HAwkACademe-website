import PageHero from '../components/PageHero.jsx';
import { useSite } from '../lib/site.jsx';
import { usePathMeta } from '../lib/hooks.js';
import { telHref } from '../lib/format.js';
import { BRAND_NAME } from '../lib/brand.js';

// Privacy Policy and Terms of Use. They describe what this website actually does; update
// them if that changes (for example, if analytics is switched on).
const UPDATED = '7 October 2026';

const h2 = { margin: '28px 0 10px', fontSize: 24, fontWeight: 800, lineHeight: 1.25 };
const p = { margin: '0 0 12px', fontSize: 16, lineHeight: 1.75, color: '#2B3550' };
const li = { margin: '6px 0', fontSize: 16, lineHeight: 1.7, color: '#2B3550' };

function Contact({ site }) {
  return (
    <p style={p}>
      {BRAND_NAME}{site.email && <>, email <a href={`mailto:${site.email}`}>{site.email}</a></>}
      {site.phone && <>, phone <a href={telHref(site.phone)}>{site.phone}</a></>}.
    </p>
  );
}

function Privacy({ site }) {
  return (
    <>
      <p style={p}>This policy explains what personal data the {BRAND_NAME} website collects, why, and how you can control it. It applies to www.hawkacademe.com.</p>
      <h2 style={h2}>What we collect</h2>
      <p style={p}>When you send the enquiry form, we receive the details you type in: the student's name and phone number, and, if you choose to give them, an email address, current class, program of interest, preferred centre and a message.</p>
      <p style={p}>We do not ask for payment details, identity documents or marks through the website.</p>
      <h2 style={h2}>Why we use it</h2>
      <ul style={{ paddingLeft: 22, margin: '0 0 12px' }}>
        <li style={li}>To reply to your enquiry by phone, WhatsApp or email.</li>
        <li style={li}>To give admission and counselling information about the program you asked about.</li>
        <li style={li}>To protect the form from spam and abuse.</li>
      </ul>
      <p style={p}>We do not sell your data or share it for advertising.</p>
      <h2 style={h2}>Students under 18</h2>
      <p style={p}>Most of our students are under 18. If the student is under 18, the enquiry should be sent by a parent or guardian, or with their consent. A parent or guardian can ask us at any time to correct or delete an enquiry about their child.</p>
      <h2 style={h2}>Where it is stored and who processes it</h2>
      <p style={p}>Enquiries are stored in our database hosted by MongoDB Atlas. A copy is emailed to our office inbox through Brevo. The website runs on Vercel. These providers process the data only to provide their service to us. Only {BRAND_NAME} staff with an admin login can see enquiries.</p>
      <h2 style={h2}>How long we keep it</h2>
      <p style={p}>We keep an enquiry only as long as we need it to respond and to follow up about admission, and we delete it sooner if you ask.</p>
      <h2 style={h2}>Cookies and third-party content</h2>
      {site.analytics ? (
        <p style={p}>We use Google Analytics to count visits and to see which pages and buttons (for example Call, WhatsApp and the enquiry form) are used, so we can improve the website. Google Analytics sets cookies and receives information such as the pages you visit, your approximate location and your device type; it does not receive what you type into the enquiry form. The website also sets one cookie when a staff member logs in to the admin panel. We do not use advertising cookies.</p>
      ) : (
        <p style={p}>The website itself sets one cookie, and only when a staff member logs in to the admin panel. It does not use advertising cookies or analytics cookies.</p>
      )}
      <p style={p}>The maps on our Contact page are provided by Google Maps, and the WhatsApp button opens WhatsApp; those services follow their own privacy policies.</p>
      <h2 style={h2}>Your rights</h2>
      <p style={p}>You can ask us to show you, correct or delete the details you sent us, or to stop contacting you. To do so, or to raise a concern about how we handle your data, contact:</p>
      <Contact site={site} />
      <p style={p}>We will reply as soon as we can, and in any case within the time required by Indian law, including the Digital Personal Data Protection Act, 2023.</p>
    </>
  );
}

function Terms({ site }) {
  return (
    <>
      <p style={p}>By using www.hawkacademe.com you agree to these terms. If you do not agree, please do not use the website.</p>
      <h2 style={h2}>Course information</h2>
      <p style={p}>We keep program details, batch timings, test dates and fees as accurate as we can, but they can change. Please confirm the current details with our office before enrolling. Admission is subject to the terms given to you at the time of enrolment.</p>
      <h2 style={h2}>Results</h2>
      <p style={p}>Results shown on this website are published with the student's (or a parent's) written permission and state the exam, year and rank or score as awarded. Past results do not guarantee any future rank, score or selection, and we do not promise any particular result.</p>
      <h2 style={h2}>Using the website</h2>
      <ul style={{ paddingLeft: 22, margin: '0 0 12px' }}>
        <li style={li}>Please give accurate details in the enquiry form and do not send spam or harmful content.</li>
        <li style={li}>Do not try to access the admin panel or any part of the website you are not authorised to use.</li>
      </ul>
      <h2 style={h2}>Content and trademarks</h2>
      <p style={p}>The {BRAND_NAME} name, logo, text, articles and images on this website belong to {BRAND_NAME} or are used with permission. You may share links to our pages, but please do not copy our content without permission.</p>
      <h2 style={h2}>Links to other websites</h2>
      <p style={p}>The website links to services such as Google Maps, WhatsApp, YouTube, Instagram, Facebook and official exam websites. We are not responsible for their content or how they handle your data.</p>
      <h2 style={h2}>Changes and law</h2>
      <p style={p}>We may update these terms; the date below shows the latest version. These terms are governed by the laws of India.</p>
      <h2 style={h2}>Contact</h2>
      <Contact site={site} />
    </>
  );
}

export default function Legal({ page }) {
  usePathMeta(`/${page}`);
  const site = useSite();
  const title = page === 'privacy' ? 'Privacy Policy' : 'Terms of Use';
  return (
    <>
      <PageHero crumb={title} title={title} compact intro={`Last updated: ${UPDATED}`} />
      <section style={{ background: '#ffffff' }}>
        <div className="pad prose" style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 72px' }}>
          {page === 'privacy' ? <Privacy site={site} /> : <Terms site={site} />}
        </div>
      </section>
    </>
  );
}
