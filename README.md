# Mist Paradise Resort — website

Single-page, mobile-first landing page for Mist Paradise Resort, Karjat.
Plain HTML, CSS and a small script — no build step, no dependencies.

## Files

```
index.html                 the page
assets/css/styles.css      shared styles (most layout is inline in index.html)
assets/js/main.js          enquiry form behaviour
assets/images/             resort photos (web-optimised JPEGs)
assets/video/              short muted hero loop
favicon.svg
robots.txt, sitemap.xml    point at https://mistparadisekarjat.com/
```

## Preview locally

Open `index.html` in a browser, or run a tiny server from this folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Publish

**GitHub Pages:** push to a repo → Settings → Pages → Deploy from branch → `main` / root.
To use the resort's domain, add it under Pages → Custom domain and point the DNS at GitHub.

**Netlify / Vercel / Cloudflare Pages:** import the repo; no build command, publish directory is the repo root.

If the site will live somewhere other than `https://mistparadisekarjat.com/`, update the
canonical URL, `og:url`, `og:image`, the JSON-LD block in `index.html`, plus `robots.txt` and `sitemap.xml`.

## Turn on the enquiry form

The page is static, so enquiries need a form service. Until one is set, the form sends
nothing online — it tells the visitor so and offers a prefilled WhatsApp message and a call button.

1. Create a form at a service such as Formspree, Getform or Basin and copy its endpoint URL.
2. In `index.html`, find `<form id="enquiry-form" ... data-endpoint="">` and paste the URL into `data-endpoint`.
3. Send a test enquiry and confirm it reaches the right inbox.

The form posts: `enquiry_type`, `name`, `contact`, `date`, `guests`, `message`
(plus a hidden `company` honeypot field that should stay empty).

## Contact details used on the page

- Phone: +91 88791 61429, +91 97691 21429
- WhatsApp: +91 88791 61429 (change `WHATSAPP_NUMBER` in `assets/js/main.js` and the `wa.me` links in `index.html` if needed)
- Email: mistparadisekarjat@gmail.com
- Address: Vadavali Road, near Kadav Market, Kadav, Karjat, Maharashtra 410201

The "Get directions" link uses a Google Maps search for the address; replace it with the
exact Google Maps pin link when available.
