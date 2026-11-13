# Deploy notes for pulsinglabs.com

The site is plain static files (no build step). Upload the repo root as it is.

## `_headers` (new)

Cloudflare Pages and Workers static assets read this file and add the headers it
lists. It is not served as a page. If the host ignores it, nothing breaks.

What it does:
- **Security headers on every page:** HTTPS-only for a year (`Strict-Transport-Security`,
  includes subdomains, no preload), no MIME sniffing, a tidy referrer, no framing of the
  site by other sites, and camera / microphone / location / payment switched off.
- **A Content Security Policy in report-only mode.** It blocks nothing; the browser only
  writes warnings in the DevTools console when something outside the list loads. After a
  few days with no warnings on every page, it can be switched on by renaming the header
  `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
  It allows: the site itself, the fonts (Fontshare + Google Fonts), the API
  (`https://api.pulsinglabs.com`, used by the contact and newsletter forms) and Cloudflare
  Web Analytics, in case that is switched on. If anything new is added to the site from
  another address (a chat widget, a map, a captcha), add that address first.
- **Caching:** CSS and JS for a year (their links carry `?v=N`, bumped on every change),
  images and videos for 7 days, the 3D model and 3D engine files for 30 days. Pages
  (HTML) keep Cloudflare's default, which re-checks on every visit.

Check after deploying: `curl -sI https://pulsinglabs.com/ | grep -i strict` and
`curl -sI "https://pulsinglabs.com/assets/style.css?v=148" | grep -i cache-control`.

## Two Cloudflare switches still needed (dashboard, not files)

1. **SSL/TLS -> Edge Certificates -> Always Use HTTPS: On.** Today `http://pulsinglabs.com`
   is served without redirecting to https.
2. **Redirect `www` to the apex.** Rules -> Redirect Rules -> new rule: when hostname equals
   `www.pulsinglabs.com`, redirect (301, keep path and query) to
   `https://pulsinglabs.com${path}`. The `www` DNS record must exist and be proxied
   (orange cloud) for the rule to run. Add records only; do not change existing ones.

Check: `http://pulsinglabs.com`, `http://www.pulsinglabs.com` and
`https://www.pulsinglabs.com/pricing` should all end on `https://pulsinglabs.com/...`.
