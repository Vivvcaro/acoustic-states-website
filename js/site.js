/* Acoustic States of Consciousness: page behaviour.
   - the hero's colours drift after the koi, with a soft bloom trailing it
   - the four tiles and the top-bar links open their panels; Book links open the booking panel
   - Get in touch opens over the page (preselected when it comes from a Book button)
   - the arrow under Upcoming performances glides on to the next section */
(function () {
  'use strict';

  /* ---------- the hero: colours follow the koi ----------
     The koi swims by CSS (a slow loop, about 34 s). Each frame this reads where it is,
     lets the glows lean a little towards it, and moves a soft bloom that lags behind it. */
  var koi = document.getElementById('koi7');
  var wake = document.getElementById('wake7');
  if (koi && wake) {
    var pond = koi.parentElement;
    var glows = Array.prototype.filter.call(pond.children, function (n) { return n.classList.contains('g'); });
    var last = null, px = null, py = null, wx = null, wy = null, wo = 0, gx = 0, gy = 0;
    var frame = function (now) {
      requestAnimationFrame(frame);
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
      var pr = pond.getBoundingClientRect();
      if (pr.bottom < 0 || pr.top > innerHeight) return;            // off screen: rest
      var kr = koi.getBoundingClientRect();
      var x = kr.left - pr.left + kr.width / 2, y = kr.top - pr.top + kr.height / 2;
      var sp = px === null ? 0 : Math.hypot(x - px, y - py) / dt; px = x; py = y;
      // the bloom follows slowly, so the colour seems to spread where the fish has been
      var k = 1 - Math.exp(-dt * 1.2);
      if (wx === null) { wx = x; wy = y; }
      wx += (x - wx) * k; wy += (y - wy) * k;
      wo += ((0.55 + Math.min(sp, 200) / 400) - wo) * (1 - Math.exp(-dt * 0.8));
      var ws = wake.offsetWidth, sc = 1 + Math.min(sp, 200) / 260;
      wake.style.transform = 'translate(' + (wx - ws / 2) + 'px,' + (wy - ws / 2) + 'px) scale(' + sc.toFixed(3) + ',' + (sc * 0.8).toFixed(3) + ')';
      wake.style.opacity = wo.toFixed(3);
      // the glows drift a little towards the fish
      var tx = (x - pond.clientWidth / 2) * 0.07, ty = (y - pond.clientHeight / 2) * 0.07, f = 1 - Math.exp(-dt * 0.6);
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
