# Work9ja 2.0 — landing page

A redesigned company/landing page for **Work9ja** (current live site: https://www.work9ja.com/),
built to the `top-design` standard and prepared for deployment on SPRTN infrastructure
(`work9ja.sprtn.net`).

This is a **static, multi-page site** — no build step, no framework. Deploy the folder as-is.
Pages share one stylesheet and one script in `assets/`, so the nav, footer and components
stay identical across all three.

## What's here

| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero with product mockup, stats band, live job/service previews, 6-product ecosystem, AI engine, a light Academy section, testimonials, trust, CTA. |
| `jobs.html` | Jobs board with dummy listings — search bar, filter rail, 8 job cards with skill-match rings, pagination. |
| `services.html` | Services marketplace with dummy providers — category chips, 9 provider cards, "how it works", dual CTA. |
| `assets/app.css` | Shared design system: tokens, nav, footer, buttons, reveals, job/service cards, match ring. |
| `assets/app.js` | Shared behaviour: Lenis smooth scroll (graceful fallback), mobile menu, scroll reveals, animated counters, match-ring/bar fills, magnetic buttons. |
| `favicon.svg` | Brand mark (the "9" set in Space Grotesk, lime on ink). The brand's own name in type — not an invented logo. |
| `og-image.jpg` | 1200×630 social share card, rendered from the hero (Pillow + Space Grotesk variable font; `make_og.py` in the session scratchpad). |
| `og-image.svg` | Vector source of the share card. |
| `robots.txt` | Allows all crawlers incl. GPTBot / ClaudeBot / PerplexityBot; points to the sitemap. |
| `sitemap.xml` | Lists `/`, `/jobs.html`, `/services.html`. |
| `site.webmanifest` | PWA manifest (name, theme colour, icon). |

> **Absolute paths:** pages reference `/assets/...`, `/favicon.svg`, `/jobs.html` etc., so preview
> over HTTP, not `file://`. Locally: `python -m http.server 8777` in this folder, then open
> `http://127.0.0.1:8777/`.

## Design (addresses the brief's four pain points)

- **Plain / generic →** monumental Space Grotesk display type (viewport-filling hero, outline second line), warm ink canvas, electric-lime signature accent, asymmetric 6-product grid, editorial pull-statement.
- **Weak CTA →** one clear primary action ("Create your free profile") repeated in nav, hero, employer section and a full-width closing block; a distinct secondary "I'm hiring" path.
- **Poor SEO →** real semantic HTML, meta description, canonical, Open Graph + Twitter cards, `Organization` + `WebSite` + `FAQPage` JSON-LD, sitemap, robots, alt text on the dashboard image.
- **Looks AI-generated →** no purple-blue gradient, no emoji, custom cubic-bezier easing everywhere, Lenis smooth scroll, choreographed load, magnetic buttons, branded `::selection`, specific human copy. Honest labelling: illustrative dashboard figures and match weights are marked as such.

Motion respects `prefers-reduced-motion`; Lenis is loaded with a graceful fallback to native scroll.

## Deploy to `work9ja.sprtn.net` (follow `deploy-static-site-ftp`)

This is a **plain static folder**, not a Vite SPA, so the deploy is simpler than the storefront sites.
From `sprtn-suite/`:

1. **Subdomain** (outward-facing — do only when ready):
   `python infrastructure/local-dev/ftp-deploy/subdomain.py create work9ja`
2. **sites.json** — add a `work9ja` entry. Because there is no build, set `build` to a no-op / copy
   (or extend `deploy.py` to handle a static folder). `remoteBase` → the subdomain's docroot,
   `url` → `https://work9ja.sprtn.net`.
3. Deploy with the FTP tool and verify the share preview:
   `curl -A "WhatsApp/2.23.20.0 A" https://work9ja.sprtn.net/` returns the `<title>` and `og:image`;
   `/sitemap.xml`, `/robots.txt`, `/og-image.jpg` answer 200.

### Before going to production on work9ja.com
Swap the absolute URLs (`https://work9ja.sprtn.net/`) in `index.html` (canonical, OG/Twitter, JSON-LD),
`sitemap.xml` and `robots.txt` for `https://www.work9ja.com/`.

## Known placeholders / to confirm with the client
- CTA links point to `https://www.work9ja.com/` — repoint to the real signup / employer routes.
- Recruiter dashboard numbers and AI match weights are **illustrative** (labelled on the page).
- No real logo asset was supplied; the wordmark is set in live type per the "no invented logos" rule.
  If Work9ja has a true logo, drop it in and swap the wordmark + favicon + OG mark.
