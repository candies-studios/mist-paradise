/*
 * Mist Paradise — enquiry form
 *
 * The site is static, so the form needs somewhere to send enquiries.
 * Set data-endpoint on <form id="enquiry-form"> in index.html to a form
 * service URL that accepts POSTed form data and returns JSON
 * (for example a Formspree, Getform or Basin endpoint).
 *
 * Until an endpoint is set, nothing is sent online: the visitor is told so
 * and offered a WhatsApp message prefilled with their own details (opened
 * only when they click), plus a call button.
 */
(function () {
  var WHATSAPP_NUMBER = '918879161429';

  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var result = document.getElementById('enquiry-result');
  var title = document.getElementById('result-title');
  var text = document.getElementById('result-text');
  var wa = document.getElementById('result-whatsapp');
  var back = document.getElementById('result-back');
  var typeInput = form.querySelector('input[name="enquiry_type"]');
  var pills = form.querySelectorAll('.pill');

  // Enquiry type toggle
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.setAttribute('aria-pressed', 'false'); });
      pill.setAttribute('aria-pressed', 'true');
      typeInput.value = pill.getAttribute('data-value');
    });
  });

  function setError(input, message) {
    var err = input.parentNode.querySelector('.err');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message || '';
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var contact = form.elements.contact;
    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; } else setError(name, '');
    var c = contact.value.trim();
    var looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
    var looksLikePhone = c.replace(/[^\d]/g, '').length >= 10;
    if (!c) { setError(contact, 'Please add a phone number or email.'); ok = false; }
    else if (!looksLikeEmail && !looksLikePhone) { setError(contact, 'Enter a 10-digit phone number or a valid email.'); ok = false; }
    else setError(contact, '');
    if (!ok) form.querySelector('[aria-invalid="true"]').focus();
    return ok;
  }

  function whatsappLink() {
    var f = form.elements;
    var lines = [
      'Hello Mist Paradise, I would like to enquire.',
      'Enquiry: ' + f.enquiry_type.value,
      'Name: ' + f.name.value.trim(),
      'Contact: ' + f.contact.value.trim()
    ];
    if (f.date.value) lines.push('Preferred date: ' + f.date.value);
    if (f.guests.value) lines.push('Guests: ' + f.guests.value);
    if (f.message.value.trim()) lines.push('Message: ' + f.message.value.trim());
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function show(state) {
    if (state === 'sent') {
      title.textContent = 'Thank you — enquiry sent';
      text.textContent = 'We have your details and will get back to you about availability and rates. For anything urgent, please call.';
      wa.hidden = true;
    } else if (state === 'error') {
      title.textContent = 'That didn’t go through';
      text.textContent = 'Your enquiry could not be sent just now. Please send it on WhatsApp or give us a call instead.';
      wa.href = whatsappLink();
      wa.hidden = false;
    } else {
      title.textContent = 'Send your enquiry on WhatsApp';
      text.textContent = 'Online enquiries aren’t switched on yet, so nothing has been sent. Tap below to send these details on WhatsApp, or call us.';
      wa.href = whatsappLink();
      wa.hidden = false;
    }
    form.hidden = true;
    result.hidden = false;
    result.focus();
  }

  back.addEventListener('click', function () {
    result.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.company.value) return; // honeypot: likely a bot
    if (!validate()) return;

    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) { show('not-configured'); return; }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending…';
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) { show(res.ok ? 'sent' : 'error'); if (res.ok) form.reset(); })
      .catch(function () { show('error'); })
      .then(function () { button.disabled = false; button.textContent = 'Send enquiry'; });
  });
})();
