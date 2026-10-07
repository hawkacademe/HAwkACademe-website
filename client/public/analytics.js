// Google Analytics 4 with conversion events. Loaded only when GA_MEASUREMENT_ID is set
// on the server; the ID comes from this script tag's data-ga attribute (no inline script,
// so the Content Security Policy stays strict).
(function () {
  var id = document.currentScript && document.currentScript.getAttribute('data-ga');
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  // Phone, WhatsApp and directions clicks, wherever they are on the page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var kind = a.getAttribute('data-track') ||
      (href.indexOf('tel:') === 0 ? 'call' : /wa\.me|whatsapp\.com/.test(href) ? 'whatsapp' : /maps\.app\.goo\.gl|google\.[a-z.]+\/maps/.test(href) ? 'directions' : '');
    var names = { call: 'phone_click', whatsapp: 'whatsapp_click', directions: 'directions_click', enquire: 'enquiry_click' };
    if (names[kind]) gtag('event', names[kind], { link_url: href, page_path: location.pathname });
  }, true);

  // Successful enquiry form submission (dispatched by the Contact page).
  window.addEventListener('ha:enquiry-sent', function (e) {
    gtag('event', 'generate_lead', { form: 'enquiry', program: (e.detail && e.detail.program) || '', page_path: location.pathname });
  });
})();
