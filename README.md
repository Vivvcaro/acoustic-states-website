# Acoustic States of Consciousness: website

The website for Acoustic States, Viviana Caro's live and private listening sessions. One page, plain HTML, CSS and JavaScript, with no build step.

The design is "Glow and vellum", chosen by Viviana in November 2026. Its frames are in the Figma file "Phantom Fish – Phononaut – Websites", page "Exploration · Acoustic States site", in the row starting "H · Glow and vellum · Desktop". The note beside them describes how the koi moves.

## See it

Live at **https://vivvcaro.github.io/acoustic-states-website/** (GitHub Pages, published from `main`; every push updates it within a minute or two). It does not replace acousticstates.com.

To try changes on your Mac first, open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080.

## What's here

- `index.html`: the page, the five panels that slide in (Methodology, Past events, Research, The app, Book a listening session) and the Get in touch form.
- `css/site.css`: all the styles. The colours are paper `#f3ede9`, ink `#2a2540`, and glows of violet `#8f88d6` and orange `#ff6a3a`.
- `js/site.js`: the koi's swim and the hero's colours following it, opening and closing the panels, the form, and the scroll arrow. If the script does not run, the CSS loop (`loop7`) keeps the koi swimming in the hero.
- `img/`: Viviana's portrait, three event photos and the app image.
- `favicon.svg`: the journey-line logo.

## Movement

- The koi swims across the whole site: it lives in a layer fixed to the screen, behind the text and cards (softly blurred under the frosted ones) and above the paper. It wanders on a smooth path that never quite repeats, always facing where it goes, sometimes slipping off one edge and coming back. It swims like a koi: a few quick tail beats, then a glide, about every six and a half seconds. It looks slightly smaller higher up, as if deeper in the water. If the script does not run, a CSS loop keeps it swimming.
- The hero's glows lean softly towards the koi, and a bloom of pink, peach and violet trails behind it.
- The Research tile's swirl turns, the The app tile's halo breathes, and the ring over the hero turns slowly.
- In the Methodology panel, the sphere's rays turn about once a minute and its centre breathes.
- The headline words stay still.

## Still to decide before it goes live

- Where Get in touch messages go. The form shows a "not connected yet" note for now.
- The Instagram, LinkedIn and Substack addresses, the ticket links for each performance, and the "Explore the app" link.
- When, and whether, it replaces the current acousticstates.com (that needs the domain pointed at GitHub Pages).
- Fonts come from Google Fonts. Self-hosting them would avoid sending visitors' addresses to Google.

The listener quotes are the ones published on acousticstates.com. The prices (Microdose £200, Medium dose £280, Macrodose £400 for individual private sessions) were confirmed by Viviana on 27 November 2026.
