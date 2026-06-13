# Agora Aid Program — Class of 2031 · Full Scholarship

A premium, minimalist single-page marketing site for the **Agora Aid Program**, an
elite full-scholarship admissions-preparation program for the Class of 2031.

Built with **plain HTML + CSS + a small amount of vanilla JavaScript** — no build
step, no framework, no dependencies. It is fully static and deploys anywhere.

---

## Run locally

It's a static site, so you can simply open the file:

```bash
open index.html          # macOS
# or just double-click index.html
```

For the application-form `<iframe>` to load reliably (some browsers block iframes on
`file://`), serve it over HTTP instead:

```bash
# Python 3 (no install needed on macOS)
python3 -m http.server 8000
# then visit http://localhost:8000

# …or with Node
npx serve .
```

## Deploy

Drag-and-drop or point any static host at the project root:

- **Netlify** — drag the folder onto the dashboard, or `netlify deploy`.
- **Vercel** — `vercel` (no framework preset needed — it's static).
- **GitHub Pages / Cloudflare Pages** — push the repo and serve from the root.

No environment variables, no server, no database.

---

## Project structure

```
agora-aid/
├── index.html     # All content & page structure (semantic, accessible)
├── styles.css     # Design system + every component style
├── script.js      # Nav, mobile menu, FAQ accordion, scroll reveal, lightbox
├── images/        # Photos pulled from the source page
│   ├── universities-1.png, universities-2.png   # Target-universities table
│   ├── result-01.jpg … result-17.jpg            # Offer-letter gallery
│   └── team-*.jpg / team-*.png                   # Mentor headshots
└── README.md
```

## Design system

| Token            | Value                | Use                                   |
| ---------------- | -------------------- | ------------------------------------- |
| Ruby Red (brand) | `#8D1D2C` (RAL 3003) | CTAs, accents, numbers, section marks |
| Red (dark)       | `#8A1319`            | Hover / depth                         |
| Background       | `#FAF8F6` / `#FFFFFF`| Warm off-white + white surfaces       |
| Ink (text)       | `#1A1A1A`            | Body copy (never pure black)          |
| Muted            | `#6B6B6B`            | Secondary text                        |
| Headlines        | Playfair Display     | Display serif (Google Fonts)          |
| Body             | Inter                | Clean sans (Google Fonts)             |

Red is used **sparingly for impact** (premium = restraint): the primary CTA, section
markers, key numbers, dividers and hover states — not as a flooded surface.

## Features

- **Sticky minimal nav** with anchor links + a red **Apply** button; collapses to a
  clean hamburger drawer on mobile.
- **Recurring red CTA** — "Fill out the scholarship application form" — that smooth-scrolls
  to the Apply section.
- **FAQ accordion** — one panel open at a time, smooth height transition, fully
  keyboard-accessible (`aria-expanded` / `aria-controls`).
- **Scroll reveal** — gentle fade-up via `IntersectionObserver`, with an active-section
  highlight in the nav.
- **University results** rendered with country flag emojis, as requested.
- **Offer-letter gallery** — the admission/scholarship letters from the source page in a
  responsive grid; click any one to open a **lightbox** (prev/next, counter, arrow-key &
  Escape support, scroll lock).
- **Target-universities table** shown as the original image from the source page.
- **Embedded application form** via responsive `<iframe>`, with an "open in a new tab"
  fallback link.
- Fully **responsive** (verified at 375 / 768 / 1440px) and **mobile-first**.
- Respects **`prefers-reduced-motion`**, visible focus rings, skip link, semantic
  headings.

## Notes

- The application form is an external AlfaCRM embed; it requires network access to load.
- Section markers replace the source document's `✅` headers with refined red labels
  for a more premium feel; the `🇺🇸/🇨🇳/…` flag emojis are kept on the university
  results exactly as requested.
- All copy (Who We Are, Program, What You Get, Results, Deliverables, Requirements,
  Team, Steps, FAQ, Contacts) is reproduced **verbatim** from the source.
- The images in `images/` were copied from the source page: the target-universities
  table, the admission/scholarship offer letters, and the mentor headshots (the latter
  live in a Notion database on the source page, so each card leads with its photo).
- Base type scale is set to **115%** via `html { font-size: 115% }`, so the whole system
  (which is built on `rem`/`em`) scales together.
