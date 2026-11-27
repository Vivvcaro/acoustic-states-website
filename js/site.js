/* Acoustic States of Consciousness: page behaviour.
   - the hero's colours drift after the koi, with a soft bloom trailing it
   - the four tiles and the top-bar links open their panels; Book links open the booking panel
   - Get in touch opens over the page (preselected when it comes from a Book button)
   - the arrow under Upcoming performances glides on to the next section */
(function () {
  'use strict';

  /* ---------- the koi: swims across the whole site; the hero's colours follow it ----------
     The koi lives in a layer fixed to the screen, so it keeps swimming as people scroll.
     It sits behind the text and cards (under the frosted vellum it shows softly blurred)
     and above the page's paper. It wanders on a smooth path that never quite repeats,
     always facing where it goes, sometimes slipping off one edge and coming back.
     It swims like a koi: a few quick tail beats, then a glide. Higher up it looks a little
     smaller, as if deeper. When it passes through the hero, the glows lean towards it and
     a soft bloom of colour trails behind it.
     (Without this script, the CSS loop in site.css keeps it swimming in the hero.) */
  var koi = document.getElementById('koi7');
  var wake = document.getElementById('wake7');
  if (koi && wake) {
    var pond = wake.parentElement;
    var tail = document.getElementById('k7tail'), finL = document.getElementById('k7finL'), finR = document.getElementById('k7finR');
    var glows = Array.prototype.filter.call(pond.children, function (n) { return n.classList.contains('g'); });
    var layer = document.createElement('div');
    layer.className = 'koilayer'; layer.setAttribute('aria-hidden', 'true');
    koi.closest('main').appendChild(layer); layer.appendChild(koi);
    koi.style.animation = 'none'; koi.style.left = '0'; koi.style.top = '0';
    [tail, finL, finR].forEach(function (n) { if (n) n.style.animation = 'none'; });
    var path = function (u, W, H) {                                  // where the koi is on screen at path position u
      return [W * (0.5 + 0.48 * Math.sin(u) + 0.07 * Math.sin(2.3 * u + 1.0)),
              H * (0.55 + 0.3 * Math.sin(1.7 * u + 0.6) + 0.06 * Math.sin(3.1 * u))];
    };
    var u = 2.2, clock = 0, beat = 0, heading = null;
    var last = null, px = null, py = null, wx = null, wy = null, wo = 0, gx = 0, gy = 0;
    var frame = function (now) {
      requestAnimationFrame(frame);
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
      if (document.hidden) return;
      var W = innerWidth, H = innerHeight, S = koi.offsetWidth || 180;
      // swim, then glide: the push comes about every 6.5 seconds and eases off
      clock += dt;
      var push = Math.pow(Math.max(0, Math.sin(clock * 2 * Math.PI / 6.5)), 2);
      u += dt * (0.07 + 0.11 * push);
      var p = path(u, W, H), q = path(u + 0.002, W, H);
      var x = p[0], y = p[1];
      // face along the path, turning smoothly (the drawing's head points left)
      var target = Math.atan2(q[1] - y, q[0] - x) + Math.PI;
      if (heading === null) heading = target;
      var d = Math.atan2(Math.sin(target - heading), Math.cos(target - heading));
      heading += d * Math.min(1, dt * 4);
      beat += dt * (2.2 + 7 * push);                                 // the tail beats fast in the push, slowly in the glide
      var sway = Math.sin(beat) * (2 + 4 * push);
      var depth = 0.85 + 0.2 * (y / H);                              // smaller further up, as if deeper
      koi.style.transform = 'translate(' + (x - S / 2) + 'px,' + (y - S / 2) + 'px) rotate(' + (heading * 180 / Math.PI + sway).toFixed(2) + 'deg) scale(' + depth.toFixed(3) + ')';
      if (tail) tail.style.transform = 'rotate(' + (Math.sin(beat - 0.6) * (10 + 16 * push)).toFixed(2) + 'deg)';
      if (finL) finL.style.transform = 'rotate(' + (Math.sin(beat * 0.7) * (8 + 10 * (1 - push))).toFixed(2) + 'deg)';
      if (finR) finR.style.transform = 'rotate(' + (-Math.sin(beat * 0.7 + 0.5) * (8 + 10 * (1 - push))).toFixed(2) + 'deg)';
      var sp = px === null ? 0 : Math.hypot(x - px, y - py) / dt; px = x; py = y;
      // in the hero: the bloom trails the fish and the glows lean towards it
      var pr = pond.getBoundingClientRect();
      if (pr.bottom < -200 || pr.top > H + 200) return;
      var lx = x - pr.left, ly = y - pr.top;                         // the fish, in the hero's own space
      var inside = (lx > -80 && lx < pr.width + 80 && ly > -80 && ly < pr.height + 80) ? 1 : 0;
      var k = 1 - Math.exp(-dt * 1.2);
      if (wx === null) { wx = lx; wy = ly; }
      wx += (lx - wx) * k; wy += (ly - wy) * k;
      wo += ((inside * (0.55 + Math.min(sp, 200) / 400)) - wo) * (1 - Math.exp(-dt * 0.8));
      var ws = wake.offsetWidth, sc = 1 + Math.min(sp, 200) / 260;
      wake.style.transform = 'translate(' + (wx - ws / 2) + 'px,' + (wy - ws / 2) + 'px) scale(' + sc.toFixed(3) + ',' + (sc * 0.8).toFixed(3) + ')';
      wake.style.opacity = wo.toFixed(3);
      var tx = inside * (lx - pr.width / 2) * 0.07, ty = inside * (ly - pr.height / 2) * 0.07, f = 1 - Math.exp(-dt * 0.6);
      gx += (tx - gx) * f; gy += (ty - gy) * f;
      glows.forEach(function (g, i) { var m = i % 2 ? 0.6 : 1; g.style.translate = (gx * m).toFixed(1) + 'px ' + (gy * m).toFixed(1) + 'px'; });
    };
    requestAnimationFrame(frame);
  }

  /* ---------- overlays: panels and Get in touch ---------- */
  var openEl = null, opener = null;
  function show(el, focusSel) {
    if (openEl) openEl.hidden = true;
    opener = opener || document.activeElement;
    openEl = el; el.hidden = false;
    document.documentElement.style.overflow = 'hidden';            // the page stays put behind
    var f = el.querySelector(focusSel); if (f) f.focus();
  }
  function hide() {
    if (!openEl) return;
    openEl.hidden = true; openEl = null;
    document.documentElement.style.overflow = '';
    if (opener && opener.focus) opener.focus(); opener = null;
  }
  document.querySelectorAll('[data-open-panel]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); opener = b;
      var p = document.getElementById('side' + b.getAttribute('data-open-panel'));
      if (p) show(p, '.sx');
    });
  });
  var touch = document.getElementById('touch');
  var booking = document.getElementById('cbook');
  document.querySelectorAll('[data-open-touch]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (!openEl) opener = b;
      var kind = b.getAttribute('data-book');
      booking.hidden = !kind; booking.textContent = kind ? 'Booking: ' + kind : '';
      if (kind) document.getElementById('c-a1').checked = true;
      show(touch, '#c-name');
    });
  });
  document.querySelectorAll('[data-close-panel],[data-close-touch]').forEach(function (b) { b.addEventListener('click', hide); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });

  /* ---------- the form ----------
     Not connected yet: where messages go is still to be decided. */
  var form = document.getElementById('cform');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('csent').textContent = 'Thank you. This form is not connected yet, so nothing was sent.';
  });

  /* ---------- the arrow under Upcoming performances ---------- */
  var cue = document.getElementById('scrollcue');
  if (cue) cue.addEventListener('click', function () {
    var t = document.querySelector('.aboutsec');
    if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
})();
