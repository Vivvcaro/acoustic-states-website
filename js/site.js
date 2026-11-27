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
  /* ---------- testimonies: a deck that spreads under the pointer ----------
     At rest the cards lie stacked, slightly fanned. Moving the pointer over them fans them out,
     and the card nearest the pointer lifts. Clicking (or Enter) brings one forward to read;
     clicking it again, or anywhere else, puts it back. On narrow screens they become a row to swipe. */
  (function () {
    var deck = document.querySelector('#h7 .words .quotes');
    if (!deck) return;
    var cards = Array.prototype.slice.call(deck.children);
    deck.classList.add('deck');
    var spread = false, hover = -1, chosen = -1, n = cards.length, mid = (n - 1) / 2;
    cards.forEach(function (c, i) { c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', 'Read: ' + c.querySelector('figcaption').textContent.trim()); });
    var narrow = function () { return innerWidth <= 640; };
    var lay = function () {
      if (narrow()) return;
      var W = deck.clientWidth, cw = cards[0].offsetWidth, room = Math.min(W - cw - 20, 980);
      cards.forEach(function (c, i) {
        var k = i - mid, x, y, r, s = 1, o = 1, z = i;
        if (chosen >= 0) {
          if (i === chosen) { x = 0; y = -18; r = 0; s = 1.1; z = 50; }
          else { var j = i < chosen ? i - chosen : i - chosen; x = j * (room / (n - 1)) * 1.08; y = 40 + Math.abs(j) * 10; r = j * 4; s = .9; o = .45; }
        } else if (spread) {
          x = k * (room / (n - 1)); y = Math.abs(k) * 22; r = k * 5;
          if (i === hover) { y -= 30; s = 1.04; z = 40; }
        } else { x = k * 16; y = Math.abs(k) * 6; r = k * 3.2; }
        c.style.transform = 'translateX(-50%) translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg) scale(' + s + ')';
        c.style.zIndex = z; c.style.opacity = o;
        c.classList.toggle('lift', i === hover && chosen < 0 && spread);
        c.classList.toggle('chosen', i === chosen);
      });
    };
    deck.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { spread = true; lay(); } });
    deck.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && chosen < 0) { spread = false; hover = -1; lay(); } });
    deck.addEventListener('pointermove', function (e) {
      if (!spread || chosen >= 0) return;
      // the card whose centre is nearest the pointer lifts
      var best = -1, bd = 1e9;
      cards.forEach(function (c, i) { var b = c.getBoundingClientRect(), d = Math.abs(e.clientX - (b.left + b.width / 2)); if (d < bd) { bd = d; best = i; } });
      if (best !== hover) { hover = best; lay(); }
    });
    cards.forEach(function (c, i) {
      var pick = function () { if (narrow()) return; spread = true; chosen = chosen === i ? -1 : i; hover = -1; lay(); };
      c.addEventListener('click', function (e) { e.stopPropagation(); if (!spread) { spread = true; hover = i; lay(); return; } pick(); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      c.addEventListener('focus', function () { if (chosen < 0) { spread = true; hover = i; lay(); } });
    });
    document.addEventListener('click', function () { if (chosen >= 0 || spread) { chosen = -1; spread = false; hover = -1; lay(); } });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && chosen >= 0) { chosen = -1; lay(); } });
    addEventListener('resize', lay);
    addEventListener('hashchange', function () { setTimeout(lay, 60); });   // when the page it sits on is shown
    lay();
  })();


  /* ---------- the journey line ----------
     The line from the logo carries a session's seven steps: calm, a dip into the music,
     the climb of different ways of listening to the peak, the Acoustic State, then settling
     a little higher than where it began. A soft light travels it (about 21 s), rests at the end
     while a gold glow lingers (about 9 s), and begins again. */
  (function () {
    var svg = document.querySelector('#h7 .jsvg'); if (!svg) return;
    var stage = svg.parentNode, peakLabel = stage.querySelector('.peaklabel');
    var NS = 'http://www.w3.org/2000/svg';
    var el = function (tag, a, parent) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; };
    var STEPS = ['Intention', 'Sonic dose', 'Music', 'Different ways of listening', null, 'Reflect on your experience', 'Meet yourself', 'Integrate it into your life'];
    var draw = function () {
      var W = stage.clientWidth, H = stage.clientHeight; if (!W) return;
      svg.innerHTML = ''; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var narrow = W < 700, fs = narrow ? 10.5 : Math.max(12, Math.min(15, W / 88));
      var d0 = el('defs', {}, svg);
      var grad = function (id, stops, tag) { var g = el(tag || 'radialGradient', { id: id }, d0); stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); return g; };
      grad('jGoal', [['0', '#ff6a3a', .95], ['.35', '#ff8fb8', .6], ['.7', '#c7a6f2', .3], ['1', '#c7a6f2', 0]]);
      grad('jDot', [['0', '#8f7be0', .9], ['1', '#8f7be0', 0]]);
      grad('jGold', [['0', '#ffd27a', .95], ['.4', '#f2b34a', .55], ['1', '#f2b34a', 0]]);
      var lg = grad('jLine', [['0', '#8f88d6'], ['.4', '#ff9fbf'], ['.5', '#ff8a5c'], ['.6', '#c7a6f2'], ['.82', '#a99be8'], ['1', '#e9a83c']], 'linearGradient');
      var top = H * .16, bh = H * .7;
      var P = [[.06, .55], [.19, .62], [.31, .86], [.405, .5], [.5, .14], [.63, .46], [.77, .42], [.92, .36]].map(function (q) { return [W * q[0], top + bh * q[1]]; });
      var pts = [P[0]].concat(P, [P[P.length - 1]]), d = 'M' + P[0][0] + ' ' + P[0][1];
      for (var i = 1; i < pts.length - 2; i++) { var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
        d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6) + ' ' + p2[0] + ' ' + p2[1]; }
      var path = el('path', { d: d, fill: 'none', stroke: 'url(#jLine)', 'stroke-width': 2.4, 'stroke-linecap': 'round', id: 'jpath' }, svg);
      var TRAVEL = 21.3, LINGER = 9.5, DUR = TRAVEL + LINGER, ARRIVE = TRAVEL / DUR;
      var light = el('circle', { r: 16, fill: 'url(#jDot)' }, svg);
      var am = el('animateMotion', { dur: DUR + 's', repeatCount: 'indefinite', calcMode: 'linear', keyPoints: '0;1;1', keyTimes: '0;' + ARRIVE + ';1' }, light); el('mpath', { href: '#jpath' }, am);
      el('animate', { attributeName: 'opacity', values: '1;1;0;0', keyTimes: '0;' + ARRIVE + ';' + (ARRIVE + .06) + ';1', dur: DUR + 's', repeatCount: 'indefinite' }, light);
      var dot = function (x, y, r, fill, glow) { el('circle', { cx: x, cy: y, r: r * 2.6, fill: glow || 'url(#jDot)', opacity: .55 }, svg); el('circle', { cx: x, cy: y, r: r, fill: fill, 'fill-opacity': .9 }, svg); };
      var label = function (x, y, words, cls, anchor) { var t = el('text', { x: x, y: y, 'text-anchor': anchor || 'middle', 'font-size': fs, 'class': cls || '' }, svg); t.textContent = words; };
      P.forEach(function (q, i) {
        var x = q[0], y = q[1];
        if (i === 4) {   // the peak: the Acoustic State
          el('circle', { cx: x, cy: y, r: 30, fill: 'url(#jGoal)', 'class': 'pulse' }, svg); el('circle', { cx: x, cy: y, r: 6.5, fill: '#2a2540' }, svg);
          peakLabel.style.left = x + 'px'; peakLabel.style.top = (y - 22) + 'px';
          // a small glow as the travelling light passes over the peak
          var Lp = path.getTotalLength(), atp = 0, bp = 1e9;
          for (var lp = 0; lp <= Lp; lp += 2) { var qp = path.getPointAtLength(lp), dp = (qp.x - x) * (qp.x - x) + (qp.y - y) * (qp.y - y); if (dp < bp) { bp = dp; atp = lp; } }
          var tp0 = ARRIVE * atp / Lp, w0 = Math.max(0, tp0 - .025), w1 = tp0 + .005, w2 = Math.min(ARRIVE - .02, tp0 + .06);
          var pg = el('circle', { cx: x, cy: y, r: 8, fill: 'url(#jGoal)', opacity: 0 }, svg);
          el('animate', { attributeName: 'r', values: '8;8;38;46;8', keyTimes: '0;' + w0 + ';' + w1 + ';' + w2 + ';1', dur: DUR + 's', repeatCount: 'indefinite' }, pg);
          el('animate', { attributeName: 'opacity', values: '0;0;.85;0;0', keyTimes: '0;' + w0 + ';' + w1 + ';' + w2 + ';1', dur: DUR + 's', repeatCount: 'indefinite' }, pg);
          return; }
        if (i === 3) {   // the climb: its words set along the line itself
          dot(x, y, 5.7, '#8a6fc8'); var L = path.getTotalLength(), at = 0, best = 1e9;
          for (var l = 0; l <= L; l += 2) { var pp = path.getPointAtLength(l), dd = (pp.x - x) * (pp.x - x) + (pp.y - y) * (pp.y - y); if (dd < best) { best = dd; at = l; } }
          var t = el('text', { 'font-size': fs, dy: -fs * 1.1 }, svg); var tp = el('textPath', { href: '#jpath', startOffset: at, 'text-anchor': 'middle' }, t); tp.textContent = STEPS[3]; return; }
        var last = i === 7, below = !narrow || i % 2 === 0;
        dot(x, y, 3 + i * .8, last ? '#d98a2b' : '#8a6fc8', last ? 'url(#jGold)' : null);
        // on a phone the last label is right-aligned so it stays on screen
        label(narrow && last ? x + 10 : x, below ? y + fs * 2.2 : y - fs * 1.5, STEPS[i], last ? 'gold' : '', narrow && last ? 'end' : 'middle');
        if (last) {   // the gold glow when the light arrives, lingering before it fades
          var f = el('circle', { cx: x, cy: y, r: 10, fill: 'url(#jGold)', opacity: 0 }, svg), a0 = ARRIVE - .015;
          el('animate', { attributeName: 'r', values: '10;10;52;64;70', keyTimes: '0;' + a0 + ';' + (ARRIVE + .05) + ';.93;1', dur: DUR + 's', repeatCount: 'indefinite' }, f);
          el('animate', { attributeName: 'opacity', values: '0;0;1;.9;0', keyTimes: '0;' + a0 + ';' + (ARRIVE + .04) + ';.9;1', dur: DUR + 's', repeatCount: 'indefinite' }, f);
        }
      });
    };
    draw(); var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(draw, 150); });
    if (document.fonts) document.fonts.ready.then(draw);
  })();

})();
