# AWS Student Builder Group — Noida International University

A single-page website for SAMIR's AWS Student Builder Group at NIU.
Built 2026-10-26 with the UI/UX Pro Max skill (Dark Mode OLED design system:
background `#0F172A`, AWS orange `#FF9900` accent, IBM Plex Sans / JetBrains Mono).

v2 (2026-10-26): interactive 3D hero (procedural Three.js shapes + particles,
mouse parallax — no model files, so the page stays fast) and GSAP scroll
reveals + hero intro + team counter, following the skill's motion rules:
subtle 8–16px reveals, 1–2 key moving elements per view, full
prefers-reduced-motion support, and content visible by default without JS.

## Run locally

Open `index.html` in any browser — no build step, no dependencies.
Fonts load from Google Fonts; everything else is local.

## Deploy

Any static host works (Vercel, Netlify, GitHub Pages): upload this folder as-is.

## Sections

Home hero · fact strip · About · What we do (4 tracks) · Core team (6 members)
· Events (Event 1, 18 Nov 2026) · Join (3 steps, email CTA) · FAQ · Contact footer.

## Content rules followed

- Only verified facts are on the page: group name, university, leader, the six
  core-team names and roles (registered 2026-10-22), and Event 1's date,
  venue, format and duration.
- Deliberately NOT on the page: unconfirmed speakers (nothing is announced
  until confirmed), the personal referral link (1-on-1 only, never public),
  any program-internal details (cohort, funding, NDA material), member counts,
  past events (there are none yet), and any official AWS logo asset.
- The footer states plainly that this is a student-led group site, not an
  official Amazon Web Services website.
- Join works through email for now. When an official Meetup / Builder Center
  link is available, add it to the Join section and the hero CTA.

## Files

- `index.html` — all content and structure
- `styles.css` — full styling, responsive from 375px up, reduced-motion support
- `script.js` — mobile navigation toggle and footer year only
