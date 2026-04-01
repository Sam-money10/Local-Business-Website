# Entretien Extérieur Élite — Project Context

## Business
- **Name:** Entretien Extérieur Élite
- **Type:** Home service (exterior cleaning)
- **Location:** Mirabel, QC — also serves Saint-Jérôme, Blainville, Boisbriand, Saint-Eustache, Sainte-Anne-des-Plaines, Rosemère
- **Language:** French (100% — never use English on the site)
- **Services:** Nettoyage de vitres, Lavage sous pression, Lavage doux, Nettoyage de gouttières

## Design Tokens
- **Gold (primary/CTA):** `#C9A84C`
- **Black (background):** `#0a0a0a`
- **Dark gray (secondary bg):** `#141414`
- **White (text):** `#FFFFFF`
- **Light gray (body text):** `#CCCCCC`
- **Font:** Montserrat (Google Fonts) — bold headings, regular body
- **Style:** Premium, minimal, dark — signals quality over budget

## File Structure
```
entretien-exterieur-elite/
├── CLAUDE.md               ← you are here
├── index.html              ← Homepage (11 sections)
├── services.html           ← Services detail page
├── a-propos.html           ← About page
├── soumission.html         ← Quote request form
├── css/
│   └── styles.css          ← All styles (CSS variables + responsive)
├── js/
│   └── main.js             ← Sticky header, mobile menu, animations
├── netlify/
│   └── functions/
│       └── quote-notify.js ← Serverless function: form → Twilio SMS
└── netlify.toml            ← Netlify deploy config + form redirect
```

## Tech Stack
- **Hosting:** Netlify (free tier)
- **Forms:** Netlify Forms (captures submissions) + serverless function triggers SMS
- **SMS:** Twilio (owner receives texts when quotes come in)
- **No frameworks** — plain HTML/CSS/JS only

## Placeholders to Replace Before Launch
- `[TELEPHONE]` — Business phone number (from Twilio)
- `[COURRIEL]` — Professional email (from Zoho or Google Workspace)
- `[LIEN_GOOGLE_AVIS]` — Google Business Profile review link
- Logo: `images/logo.png` — drop the real logo file here
- Before/after photos in the gallery — replace with real job photos
- Testimonials — replace placeholder quotes with real Google reviews
- JSON-LD schema address fields — fill in once domain + address confirmed

## Environment Variables (Netlify Dashboard → Site Settings → Environment Variables)
```
TWILIO_ACCOUNT_SID=       # From twilio.com console
TWILIO_AUTH_TOKEN=        # From twilio.com console
TWILIO_FROM_NUMBER=       # Your Twilio phone number (e.g. +15141234567)
OWNER_PHONE=              # Your personal cell to receive quote texts (e.g. +15149876543)
```

## Homepage Section Order (conversion-optimized — do not reorder)
1. Sticky Header (logo + nav + phone + CTA button)
2. Hero (benefit headline + CTA above the fold)
3. Social Proof Bar (stars + guarantee + location + insured)
4. Services Overview (4 cards)
5. How It Works (3 steps)
6. Before/After Gallery
7. Why Choose Us (6 benefit blocks)
8. Testimonials (3–4 specific, named)
9. Service Area (city list)
10. Final CTA Banner
11. Footer

## Key Decisions
- Single CTA repeated throughout: "Obtenir ma soumission gratuite"
- Sticky header always shows phone number (click-to-call on mobile)
- Testimonials must be situation-specific (not generic praise)
- Before/after gallery is the biggest conversion driver — prioritize real photos

## Useful Skills
- `/deploy` — Step-by-step guide to deploy the site on Netlify
- `/add-testimonial` — Add a real client testimonial to the homepage
- `/update-photo` — Replace a placeholder image with a real photo
