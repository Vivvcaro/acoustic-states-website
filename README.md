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

- `index.html`: the page, the pages that open as a square over the site (Methodology, Programmes, Past events, Research, Book a listening session), the Stay in the loop subscribe box and the Get in touch form.
- `css/site.css`: all the styles. The colours are paper `#f3ede9`, ink `#2a2540`, and glows of violet `#8f88d6` and orange `#ff6a3a`.
- `js/site.js`: the koi's swim and the hero's colours following it, opening and closing the panels, the form, and the scroll arrow. If the script does not run, the CSS loop (`loop7`) keeps the koi swimming in the hero.
- `img/`: Viviana's portrait, the event and tile photos, the app image and the Phononaut logo, the snailfish under the name on dark water (The app tile).
- `favicon.svg`: the journey-line logo.

## Movement

- The koi swims across the whole site: it lives in a layer fixed to the screen, behind the text and cards (softly blurred under the frosted ones) and above the paper. It wanders on a smooth path that never quite repeats, always facing where it goes, sometimes slipping off one edge and coming back. It swims like a koi: a few quick tail beats, then a glide, about every six and a half seconds. It looks slightly smaller higher up, as if deeper in the water. If the script does not run, a CSS loop keeps it swimming.
- The hero's glows lean softly towards the koi, and a bloom of pink, peach and violet trails behind it.
- The Research tile's swirl turns, the The app tile's halo breathes, and the ring over the hero turns slowly.
- In Methodology, a soft light travels round the triangle of imagination, attention and intention, one word at each corner.
- At the end of Research, the sphere's rays turn about once a minute and its centre breathes.
- The hero's Book a session sits on a soft breathing pool of light, with its line always drawn.
- At the top, the bar stays in view: the name, Book a session and a small menu with the pages. The footer repeats the pages, the socials and the copyright notice.
- Under "For those feeling...", the journey line from the logo carries a session's seven steps, with the Acoustic State at its peak. A soft light travels it in about 21 seconds, rests at "Integrate it into your life" while a wide gold glow lingers for about 9 seconds, and begins again.
- The testimonies rest as a stacked deck; they fan out under the pointer and one can be brought forward to read.
- The headline words stay still.

## Forms

Get in touch, Request a quote, Book a private session and Stay in the loop all send to the same Formspree form as the earlier acousticstates.com (`https://formspree.io/f/mgojkgro`, in `js/site.js`). Each message's subject and `source` field say which form it came from.

## Still to decide before it goes live

- The Calendly link for the 15-minute conversations: put it in `data-calendly` on `#calendly` in index.html (until then the button leads to the message form in Book a private session).
- The Instagram, LinkedIn and Substack addresses, the ticket links for each performance. The app tile and the top bar's The app go straight to phononaut.com.
- When, and whether, it replaces the current acousticstates.com (that needs the domain pointed at GitHub Pages).
- Fonts come from Google Fonts. Self-hosting them would avoid sending visitors' addresses to Google.

The listener quotes are the ones published on acousticstates.com. The prices (Microdose £200, Medium dose £280, Macrodose £400 for individual private sessions) were confirmed by Viviana on 27 November 2026.
