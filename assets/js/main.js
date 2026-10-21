/* Deeplab Media v3 — vanilla GSAP/ScrollTrigger/Lenis port of the awwwards landing-page patterns. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* v56: inline-only video. iOS in-app browsers ignore playsinline, so they get posters instead of autoplay;
     any clip that still opens fullscreen by itself is closed and autoplay stops for the visit */
  const ua = navigator.userAgent;
  let noAuto = /iPhone|iPad|iPod/.test(ua) && /FBAN|FBAV|FB_IAB|Messenger|Instagram|Zalo|Line\/|musical_ly|BytedanceWebview|TikTok/i.test(ua);
  const stopAll = () => document.querySelectorAll('video').forEach(v => v.pause());
  const play = v => noAuto ? Promise.reject(new Error('inline playback unavailable')) : HTMLMediaElement.prototype.play.call(v);
  document.addEventListener('webkitbeginfullscreen', e => { const v = e.target; if (v.controls) return; noAuto = true; if (v.webkitExitFullscreen) v.webkitExitFullscreen(); stopAll(); }, true);
  document.addEventListener('fullscreenchange', () => { const f = document.fullscreenElement; if (f && f.tagName === 'VIDEO' && !f.controls) { noAuto = true; document.exitFullscreen().catch(() => {}); stopAll(); } });
  const hasGsap = !!window.gsap;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  const W = () => innerWidth, Hh = () => innerHeight;

  /* ---- Lenis ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const scrollTo = el => { if (!el) return; lenis ? lenis.scrollTo(el, { offset: 0, duration: 1.4 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); const el = id.length > 1 && $(id); if (!el) return;
    e.preventDefault(); closeMenu(); scrollTo(el); history.replaceState(null, '', id);
  }));

  /* ---- Preloader (curve slide-up) ---- */
  const pre = $('#preloader'), preWord = $('#pre-word'), prePath = $('#pre-path');
  const words = ['Xin chào', 'Hà Nội', 'Dive deep, shoot wide', 'Deeplab Media'];
  const setPath = (y) => prePath.setAttribute('d', `M0 0 L${W()} 0 L${W()} ${Hh()} Q${W() / 2} ${Hh() + y} 0 ${Hh()} L0 0`);
  const landing = $('.landing');
  const finishLoad = () => {
    document.body.classList.remove('is-loading'); landing.classList.add('in');
    setTimeout(() => { pre.remove(); window.ScrollTrigger && ScrollTrigger.refresh(); }, 1000);
  };
  if (reduce || !pre) { pre && pre.remove(); landing.classList.add('in'); }
  else {
    document.body.classList.add('is-loading'); setPath(300);
    requestAnimationFrame(() => pre.querySelector('p').style.opacity = '.85');
    let i = 0; const step = () => { i++; if (i >= words.length) return; preWord.textContent = words[i]; setTimeout(step, 150); };
    setTimeout(step, 900);
    setTimeout(() => {
      prePath.animate([{ d: `path("${prePath.getAttribute('d')}")` }, { d: `path("M0 0 L${W()} 0 L${W()} ${Hh()} Q${W() / 2} ${Hh()} 0 ${Hh()} L0 0")` }], { duration: 700, delay: 300, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      pre.animate([{ top: '0' }, { top: '-100vh' }], { duration: 800, delay: 200, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      finishLoad();
    }, 2000);
  }

  /* ---- Magnetic ---- */
  if (hasGsap && !reduce && matchMedia('(pointer:fine)').matches) $$('[data-magnetic]').forEach(el => {
    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1,0.3)' }), yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1,0.3)' });
    el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * .35); yTo((e.clientY - (r.top + r.height / 2)) * .35); });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });

  /* ---- Header burger + side menu with curve ---- */
  const burger = $('#burger'), menu = $('#menu'), menuPath = $('#menu-path');
  const curve = open => menuPath && menuPath.setAttribute('d', open ? `M100 0 L100 ${Hh()} Q100 ${Hh() / 2} 100 0` : `M100 0 L100 ${Hh()} Q-100 ${Hh() / 2} 100 0`);
  curve(false);
  const openMenu = () => { if (!menu) return; menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true'); lenis && lenis.stop(); setTimeout(() => menuPath.animate([{ d: `path("M100 0 L100 ${Hh()} Q-100 ${Hh() / 2} 100 0")` }, { d: `path("M100 0 L100 ${Hh()} Q100 ${Hh() / 2} 100 0")` }], { duration: 1000, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }), 0); };
  const closeMenu = () => { if (!menu || !menu.classList.contains('is-open')) return; menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); menuPath.animate([{ d: `path("M100 0 L100 ${Hh()} Q100 ${Hh() / 2} 100 0")` }, { d: `path("M100 0 L100 ${Hh()} Q-100 ${Hh() / 2} 100 0")` }], { duration: 800, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }); };
  burger && burger.addEventListener('click', () => menu.classList.contains('is-open') ? closeMenu() : openMenu());
  if (burger && hasGsap && W() >= 960) ScrollTrigger.create({ trigger: document.documentElement, start: 0, end: () => Hh(), onLeave: () => gsap.to(burger, { scale: 1, duration: .25 }), onEnterBack: () => { gsap.to(burger, { scale: 0, duration: .25 }); closeMenu(); } });

  /* ---- Landing: infinite text slider driven by scroll direction ---- */
  const slider = $('#slider');
  if (slider && hasGsap && !reduce) {
    const [p1, p2] = slider.children; let x = 0, dir = -1;
    gsap.to(slider, { x: -500, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: () => Hh(), scrub: .25, onUpdate: e => dir = e.direction * -1 } });
    const anim = () => { if (x < -100) x = 0; else if (x > 0) x = -100; gsap.set([p1, p2], { xPercent: x }); x += 0.08 * dir; requestAnimationFrame(anim); };
    requestAnimationFrame(anim);
    gsap.to('.landing-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.landing', start: 'top top', end: 'bottom top', scrub: true } });
  }
  /* parallax speed helpers */
  if (hasGsap && !reduce) $$('[data-speed]').forEach(el => gsap.to(el, { y: () => -parseFloat(el.dataset.speed) * 600, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* ---- Description: word mask reveal ---- */
  const big = $('[data-words]');
  if (big) {
    big.innerHTML = big.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join('');
    const spans = $$('.w > span', big);
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.disconnect();
      if (hasGsap && !reduce) gsap.to(spans, { y: 0, duration: .6, stagger: .012, ease: 'power3.out' }); else spans.forEach(s => s.style.transform = 'none');
      $('.desc-small').classList.add('in');
    }), { threshold: .3 });
    io.observe(big);
  }

  /* ---- Services: stacking cards (cards-parallax) ---- */
  const cards = $$('.card');
  if (cards.length && hasGsap && !reduce && W() > 900) {
    const n = cards.length;
    cards.forEach((card, i) => {
      const target = 1 - (n - i) * 0.05;
      gsap.set(card, { top: `calc(-6vh + ${i * 22}px)` });
      gsap.fromTo(card, { scale: 1 }, { scale: target, ease: 'none', scrollTrigger: { trigger: '#cards', start: () => `top+=${i * Hh()} top`, end: 'bottom bottom', scrub: true } });
      const img = $$('img', card);
      gsap.fromTo(img, { scale: 1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: card.parentElement, start: 'top bottom', end: 'top top', scrub: true } });
    });
  } else cards.forEach(c => { c.style.top = '0'; $$('img', c).forEach(i => i.style.transform = 'none'); });

  /* ---- Projects: hover preview following cursor ---- */
  const pmodal = $('#pmodal'), pslider = $('#pmodal-slider'), pcur = $('#pcursor'), plab = $('#pcursor-label'), plist = $('#plist');
  if (plist && hasGsap && matchMedia('(pointer:fine)').matches) {
    const mv = [pmodal, pcur, plab].map(el => [gsap.quickTo(el, 'left', { duration: .8, ease: 'power3' }), gsap.quickTo(el, 'top', { duration: .8, ease: 'power3' })]);
    const move = (x, y) => mv.forEach(([fx, fy]) => { fx(x); fy(y); });
    const show = on => gsap.to([pmodal, pcur, plab], { scale: on ? 1 : 0, duration: .4, ease: on ? 'power3.out' : 'power3.in', overwrite: true });
    plist.addEventListener('mousemove', e => move(e.clientX, e.clientY));
    $$('.prow').forEach(row => {
      row.addEventListener('mouseenter', e => { pslider.style.top = row.dataset.i * -100 + '%'; move(e.clientX, e.clientY); show(true); });
      row.addEventListener('mouseleave', () => show(false));
    });
  }
  $$('.prow').forEach(row => { row.addEventListener('click', () => openVideo(row.dataset.yt)); row.addEventListener('keydown', e => e.key === 'Enter' && openVideo(row.dataset.yt)); });
  const more = $('#more-work'), all = $('#work-all');
  more && more.addEventListener('click', () => { all.hidden = !all.hidden; more.querySelector('span').textContent = all.hidden ? `Tất cả ${$$('.work-grid .work').length - 1} video` : 'Thu gọn'; ScrollTrigger && ScrollTrigger.refresh(); });
  $$('.filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('.filters button').forEach(b => b.classList.toggle('is-active', b === btn));
    $$('.work-grid .work').forEach(c => c.classList.toggle('is-hidden', btn.dataset.filter !== 'all' && c.dataset.cat !== btn.dataset.filter));
    ScrollTrigger && ScrollTrigger.refresh();
  }));

  /* ---- Results: alternate column scroll ---- */
  if (hasGsap && !reduce) $$('.col').forEach(col => {
    const rev = col.classList.contains('col-b') || col.classList.contains('col-d');
    const travel = () => Math.max(0, col.offsetHeight - col.parentElement.offsetHeight) + 200;
    gsap.fromTo(col, { y: () => rev ? 0 : 100 }, { y: () => rev ? travel() : -travel(), ease: 'none', scrollTrigger: { trigger: '#columns', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });

  /* ---- Zoom parallax (pinned 300vh) ---- */
  if (hasGsap && !reduce) $$('.z-el').forEach(el => gsap.fromTo(el, { scale: 1 }, { scale: +el.dataset.scale, ease: 'none', scrollTrigger: { trigger: '.zoom', start: 'top top', end: 'bottom bottom', scrub: true } }));

  /* ---- Sliding images rows + curve ---- */
  if (hasGsap && !reduce) {
    $$('.s-row').forEach(row => gsap.fromTo(row, { x: 0 }, { x: () => 150 * +row.dataset.dir, ease: 'none', scrollTrigger: { trigger: '.sliding', start: 'top bottom', end: 'bottom top', scrub: true } }));
    $('.curve-wrap') && gsap.fromTo('.curve-wrap', { height: 50 }, { height: 0, ease: 'none', scrollTrigger: { trigger: '.sliding', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---- BTS reel: duplicate for loop, play only in view ---- */
  const track = $('.reel-track');
  if (track) {
    track.innerHTML += track.innerHTML;
    const vio = new IntersectionObserver(es => es.forEach(en => { const v = en.target; en.isIntersecting ? play(v).catch(() => {}) : v.pause(); }), { rootMargin: '150px' });
    $$('video', track).forEach(v => vio.observe(v));
  }

  /* ---- v15: draw channel growth curves when cards enter ---- */
  const chio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); chio.unobserve(en.target); } }), { threshold: .35 });
  $$('.res2 .ch').forEach(c => chio.observe(c));
  $$('.cards-head.sx').forEach(c => chio.observe(c));
  $$('#inv').forEach(c => chio.observe(c));


  /* ---- v17: BTS multiview — PGM cycles through cams, click to cut, play only in view ---- */
  const mv = $('#mv');
  if (mv) {
    const cams = $$('.mv-cam', mv), pgm = $('#mv-pgm'), now = $('#mv-now'), tc = $('#mv-tc');
    const load = v => { if (!v.src && v.dataset.src) v.src = v.dataset.src; };
    let cur = 0, timer = null, hold = 0, live = false, t0 = 0;
    const cut = i => {
      cur = (i + cams.length) % cams.length;
      cams.forEach((c, k) => { c.classList.toggle('is-pgm', k === cur); c.classList.toggle('is-pvw', k === (cur + 1) % cams.length); });
      pgm.src = cams[cur].dataset.src; now.textContent = 'CAM ' + cams[cur].dataset.cam;
      const fig = pgm.parentElement; fig.classList.remove('cut'); void fig.offsetWidth; fig.classList.add('cut');
      if (live) play(pgm).catch(() => {});
    };
    const tick = () => { if (Date.now() < hold) return; cut(cur + 1); };
    const frame = () => { if (!live) return; const f = Math.floor((performance.now() - t0) / 40), p = n => String(n).padStart(2, '0'); tc.textContent = `${p(Math.floor(f / 90000))}:${p(Math.floor(f / 1500) % 60)}:${p(Math.floor(f / 25) % 60)}:${p(f % 25)}`; requestAnimationFrame(frame); };
    cams.forEach((c, k) => c.addEventListener('click', () => { hold = Date.now() + 12000; cut(k); }));
    cut(0);
    // boot: SMPTE bars -> signal, staggered in shuffled order, PGM last
    let booted = false;
    const tiles = [...cams, pgm.parentElement];
    function boot() {
      booted = true;
      if (reduce) { tiles.forEach(t => t.classList.add('sig')); return; }
      const order = cams.map((c, k) => [Math.random(), c]).sort((x, y) => x[0] - y[0]).map(x => x[1]).concat(pgm.parentElement);
      order.forEach((t, k) => setTimeout(() => t.classList.add('sig', 'boot'), 250 + k * 110));
    }
    // ambilight: average PGM colour every 700ms -> --amb on the bezel
    const cv = document.createElement('canvas'); cv.width = cv.height = 4; const cx = cv.getContext('2d', { willReadFrequently: true });
    function amb() {
      if (!live) return;
      try {
        if (pgm.readyState >= 2) {
          cx.drawImage(pgm, 0, 0, 4, 4); const d = cx.getImageData(0, 0, 4, 4).data; let r = 0, g = 0, b = 0;
          for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
          mv.style.setProperty('--amb', `rgba(${r / 16 | 0},${g / 16 | 0},${b / 16 | 0},.8)`);
        }
      } catch (e) { return; }
      setTimeout(amb, 700);
    }
    new IntersectionObserver(([en]) => {
      live = en.isIntersecting; mv.classList.toggle('live', live);
      if (live && !booted) boot();
      if (live) amb();
      const vids = [pgm, ...cams.filter(c => c.offsetParent).map(c => $('video', c))]; // hidden cams (small screens) never load
      if (live) {
        vids.forEach(v => { load(v); if (!reduce) play(v).catch(() => {}); });
        if (!reduce) { timer = timer || setInterval(tick, 4000); t0 = t0 || performance.now(); requestAnimationFrame(frame); }
      } else { vids.forEach(v => v.pause()); clearInterval(timer); timer = null; }
    }, { threshold: .25 }).observe($('.mv-grid', mv));
    const open = $('#mv-open'), all = $('#mv-all');
    const aio = new IntersectionObserver(es => es.forEach(en => { const v = en.target; if (en.isIntersecting) { load(v); reduce || play(v).catch(() => {}); } else v.pause(); }), { rootMargin: '100px' });
    open.addEventListener('click', () => {
      all.hidden = !all.hidden; open.setAttribute('aria-expanded', String(!all.hidden));
      open.textContent = all.hidden ? 'Xem tất cả 37 clip' : 'Thu gọn';
      if (!all.hidden) $$('video', all).forEach(v => aio.observe(v)); else $$('video', all).forEach(v => { aio.unobserve(v); v.pause(); });
      window.ScrollTrigger && ScrollTrigger.refresh();
    });
  }


  /* ---- v19: process timeline fills as it scrolls; steps light up in turn ---- */
  const prl = $('#pr2-line');
  if (prl) {
    const items = $$('li', prl), bar = $('.pr2-bar i', prl);
    const setPr = p => { prl.style.setProperty("--p", p); items.forEach((li, k) => li.classList.toggle('on', p >= k / (items.length - 1) - .02)); };
    if (hasGsap && !reduce) ScrollTrigger.create({ trigger: prl, start: 'top 80%', end: 'bottom 45%', scrub: .6, onUpdate: t => setPr(t.progress) });
    else setPr(1);
  }


  /* ---- v20: crew panels — hover/tap to open, auto-advance while in view ---- */
  const crRow = $('#cr-row');
  if (crRow) {
    const ps = $$('.cr-p', crRow); let ci = 0, ct = null, pause = false;
    const open = i => { ci = (i + ps.length) % ps.length; ps.forEach((p, k) => { p.classList.toggle('is-on', k === ci); p.setAttribute('aria-pressed', String(k === ci)); }); };
    ps.forEach((p, k) => { p.addEventListener('mouseenter', () => open(k)); p.addEventListener('focus', () => open(k)); p.addEventListener('click', () => open(k)); });
    crRow.addEventListener('mouseenter', () => pause = true); crRow.addEventListener('mouseleave', () => pause = false);
    if (!reduce) new IntersectionObserver(([en]) => { clearInterval(ct); if (en.isIntersecting) ct = setInterval(() => pause || open(ci + 1), 3200); }, { threshold: .4 }).observe(crRow);
  }


  /* ---- v24: contact reveal + click-to-load maps (nothing loads from Google until clicked) ---- */
  const rvs = $$('#contact [data-rv]');
  if (rvs.length) {
    if (reduce) rvs.forEach(el => el.classList.add('in'));
    else { const rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }), { threshold: .2 }); rvs.forEach(el => rio.observe(el)); }
  }
  $$('.mp-load').forEach(btn => btn.addEventListener('click', () => {
    const view = btn.parentElement, f = document.createElement('iframe');
    f.src = btn.dataset.embed; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.title = btn.getAttribute('aria-label').replace('Tải ', '');
    f.addEventListener('load', () => view.classList.add('loaded'));
    view.appendChild(f); view.classList.add('loading'); btn.remove();
  }));


  /* ---- v29: hero = self-hosted Dior loop (autoplay in markup). Respect reduced motion / data saver; pause off-screen ---- */
  const hvid = $('.h2-vid');
  if (hvid) {
    // poster paints first (LCP); the loop is attached after load so it never competes with the page
    const lite = reduce || (navigator.connection && navigator.connection.saveData);
    const attach = () => { if (hvid.src || lite || noAuto) return; hvid.src = innerWidth < 900 ? hvid.dataset.srcM : hvid.dataset.src; hvid.preload = 'auto'; };
    if (document.readyState === 'complete') attach(); else addEventListener('load', attach, { once: true });
    setTimeout(attach, 3000);
    if (!lite) new IntersectionObserver(([en]) => { if (en.isIntersecting) { attach(); play(hvid).catch(() => {}); } else hvid.pause(); }, { threshold: .05 }).observe(hvid);
  }


  /* ---- v26: intro reveal + BTS clip that plays only in view ---- */
  const d2 = $('.desc2');
  if (d2) {
    const items = $$('[data-rv]', d2);
    if (reduce) items.forEach(el => el.classList.add('in'));
    else { const dio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); dio.unobserve(en.target); } }), { threshold: .2 }); items.forEach(el => dio.observe(el)); }
    /* v49: stacked BTS deck — only the front clip plays; it lifts off and tucks under every few seconds or on tap */
    const deck = $('.d2-deck', d2);
    if (deck) {
      const cards = $$('.d2-clip', deck), n = cards.length;
      let order = cards.map((_, i) => i), seen = false, t = null, busy = false;
      const paint = () => cards.forEach((c, i) => { const p = order.indexOf(i), v = $('video', c); c.style.setProperty('--p', p); c.classList.toggle('top', p === 0); c.classList.toggle('far', p > 3); if (p <= 1 && seen && !v.src) v.src = v.dataset.src; if (p === 0 && seen && !reduce) play(v).catch(() => {}); else v.pause(); });
      const next = () => {
        if (busy) return; busy = true;
        const top = cards[order[0]]; top.classList.add('lift');
        setTimeout(() => { order.push(order.shift()); top.classList.remove('lift'); paint(); busy = false; }, 380);
      };
      const loop = () => { clearInterval(t); if (seen && !reduce) t = setInterval(next, 4800); };
      deck.addEventListener('click', () => { next(); loop(); });
      deck.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); loop(); } });
      new IntersectionObserver(([en]) => {
        seen = en.isIntersecting;
        paint(); loop();
      }, { threshold: .25 }).observe(deck);
    }
  }


  /* ---- v32: phone service cards show a summary; details open on demand ---- */
  $$('.cd-more').forEach(b => b.addEventListener('click', () => {
    const c = b.closest('.card'), open = c.classList.toggle('open');
    b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Thu gọn' : 'Xem chi tiết';
  }));


  /* ---- v44: why — swipe engine on the vector phone + scroll-driven stepper ---- */
  const why = $('#why');
  if (why) {
    /* phone feed: real thumbnails, vector UI, human-feeling swipes */
    const stage = $('#wf-stage'), finger = $('#wf-finger'), burst = $('#wf-burst'), likes = $('#wf-likes'), heart = $('#wf-heart'), nameEl = $('#wf-name'), catEl = $('#wf-cat'), prog = $('#wf-prog');
    const FEED = [['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="ga" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#2b418f"/><stop offset="1" stop-color="#060b24"/></radialGradient></defs><rect x="-60" y="-80" width="600" height="1266" fill="url(#ga)"/><circle class="vc-glow" cx="240" cy="235" r="165" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="22"/><circle cx="240" cy="330" r="80" fill="#17245e"/><path d="M70 1186V650q0-120 170-140q170 20 170 140v536z" fill="#17245e"/><circle cx="240" cy="330" r="80" fill="none" stroke="#4fc3f7" stroke-opacity=".5" stroke-width="3"/><g class="vc-slide"><text x="40" y="500" fill="#fff" font-size="42" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">3 GIÂY ĐẦU</text><text x="40" y="560" fill="#4fc3f7" font-size="42" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">QUYẾT ĐỊNH</text><text x="40" y="620" fill="#fff" font-size="42" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">TẤT CẢ</text></g></svg>','48K','@spa.anh.hanoi','Spa · Hà Nội'],['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1230"/><stop offset="1" stop-color="#07081c"/></linearGradient><linearGradient id="gb2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd1dc"/><stop offset="1" stop-color="#ff6f91"/></linearGradient></defs><rect x="-60" y="-80" width="600" height="1266" fill="url(#gb)"/><path class="vc-glow" d="M240 40L80 560h320z" fill="#ff6f91" fill-opacity=".12"/><ellipse cx="240" cy="640" rx="150" ry="26" fill="#000" fill-opacity=".45"/><rect x="110" y="520" width="260" height="110" rx="14" fill="#2a1a3e"/><g class="vc-float"><rect x="190" y="300" width="100" height="220" rx="22" fill="url(#gb2)"/><rect x="205" y="270" width="70" height="48" rx="10" fill="#fff"/><rect x="208" y="380" width="64" height="60" rx="8" fill="#fff" fill-opacity=".85"/></g><g class="vc-pop"><rect x="40" y="220" width="140" height="64" rx="32" fill="#ff3b5c"/><text x="110" y="264" text-anchor="middle" fill="#fff" font-size="34" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">-30%</text></g><text x="40" y="120" fill="#fff" font-size="40" style="font-family:Manrope,sans-serif;font-weight:700">Serum mới về</text><text x="40" y="168" fill="#ffb3c4" font-size="30" style="font-family:Manrope,sans-serif;font-weight:700">chỉ 3 ngày</text></svg>','1,2M','@mypham.minh','Mỹ phẩm'],['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><rect x="-60" y="-80" width="600" height="1266" fill="#071752"/><rect class="vc-wipe" x="-60" y="-80" width="600" height="1266" fill="#4fc3f7"/><g class="vc-slide"><text x="40" y="330" fill="#fff" font-size="64" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">ĐỪNG</text><text x="40" y="394" fill="#fff" font-size="64" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">BỎ TIỀN</text><text x="40" y="448" fill="#fff" font-size="43" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">QUAY VIDEO</text><text x="40" y="500" fill="#a6e3fb" font-size="35" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">KHI CHƯA XEM</text><text x="40" y="542" fill="#a6e3fb" font-size="35" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">CÁI NÀY</text></g><rect x="40" y="240" width="160" height="6" rx="3" fill="#fff" fill-opacity=".5"/></svg>','96K','@hoc.tieng.nhat','Giáo dục'],['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gd" x1="0" x2="1"><stop offset="0" stop-color="#4fc3f7"/><stop offset="1" stop-color="#1b6fa3"/></linearGradient></defs><rect x="-60" y="-80" width="600" height="1266" fill="#2a2a2e"/><rect class="vc-reveal" x="240" y="-80" width="300" height="1266" fill="url(#gd)"/><circle cx="150" cy="330" r="62" fill="#44444c"/><path d="M40 560q0-110 110-130q110 20 110 130v80H40z" fill="#44444c"/><circle cx="330" cy="330" r="62" fill="#fff"/><path d="M220 560q0-110 110-130q110 20 110 130v80H220z" fill="#fff"/><line class="vc-handle" x1="240" y1="-80" x2="240" y2="1186" stroke="#fff" stroke-width="4"/><circle class="vc-handle" cx="240" cy="427" r="26" fill="#fff"/><text class="vc-handle" x="240" y="437" text-anchor="middle" fill="#071752" font-size="26" style="font-family:Manrope,sans-serif;font-weight:700">⇆</text><text x="60" y="640" fill="#9a9aa5" font-size="40" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">TRƯỚC</text><text x="390" y="640" text-anchor="end" fill="#fff" font-size="40" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">SAU</text></svg>','33K','@phongkham.dr.an','Phòng khám'],['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="ge" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#5a2d12"/><stop offset="1" stop-color="#1a0b05"/></radialGradient></defs><rect x="-60" y="-80" width="600" height="1266" fill="url(#ge)"/><ellipse cx="240" cy="600" rx="190" ry="40" fill="#000" fill-opacity=".4"/><path d="M70 440h340q-10 150-170 170q-160-20-170-170z" fill="#f4e7d3"/><ellipse cx="240" cy="440" rx="170" ry="40" fill="#c8431f"/><ellipse cx="240" cy="432" rx="120" ry="24" fill="#ffb347"/><g class="vc-steam" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="8" stroke-linecap="round"><path d="M180 390q-20-40 0-80q20-40 0-80"/><path d="M240 380q-20-40 0-80q20-40 0-80"/><path d="M300 390q-20-40 0-80q20-40 0-80"/></g><text x="40" y="130" fill="#fff" font-size="34" style="font-family:Archivo,sans-serif;font-stretch:125%;font-weight:900">MỞ 7:00 – 22:00</text><text x="40" y="180" fill="#ffb347" font-size="30" style="font-family:Manrope,sans-serif;font-weight:700">Ship 15 phút nội thành</text></svg>','210K','@bun.cha.co.ba','F&B · Sài Gòn'],['<svg viewBox="-60 -80 600 1266" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1238"/><stop offset="1" stop-color="#03050f"/></linearGradient></defs><rect x="-60" y="-80" width="600" height="1266" fill="url(#gf)"/><circle cx="240" cy="300" r="80" fill="#14204f"/><path d="M70 1186V620q0-120 170-140q170 20 170 140v566z" fill="#14204f"/><g class="vc-bub" style="--i:0"><rect x="40" y="330" width="300" height="64" rx="32" fill="#fff"/><text x="70" y="372" fill="#071752" font-size="28" style="font-family:Manrope,sans-serif;font-weight:700">Giá bao nhiêu ạ?</text></g><g class="vc-bub" style="--i:1"><rect x="90" y="410" width="280" height="64" rx="32" fill="#4fc3f7"/><text x="120" y="452" fill="#071752" font-size="28" style="font-family:Manrope,sans-serif;font-weight:700">Inbox em báo giá</text></g><g class="vc-bub" style="--i:2"><rect x="40" y="490" width="260" height="64" rx="32" fill="#fff"/><text x="70" y="532" fill="#071752" font-size="28" style="font-family:Manrope,sans-serif;font-weight:700">Còn hàng không?</text></g><g class="vc-bub" style="--i:3"><rect x="110" y="570" width="270" height="64" rx="32" fill="#2ee59d"/><text x="140" y="612" fill="#04081d" font-size="28" style="font-family:Manrope,sans-serif;font-weight:700">Còn ạ, chốt luôn</text></g></svg>','560K','@shop.linh.store','Thời trang']];
    let fi = 0, cardA = null, cardB = null, swiping = false, feedOn = false, feedT = null;
    const mk = (n, cls) => { const d = document.createElement('div'); d.className = 'wf-card ' + cls; d.innerHTML = FEED[n][0]; return d; };
    const meta = n => { likes.textContent = FEED[n][1]; nameEl.textContent = FEED[n][2]; catEl.textContent = FEED[n][3]; };
    const resetProg = () => { prog.style.transition = 'none'; prog.style.transform = 'scaleX(0)'; void prog.offsetWidth; prog.style.transition = 'transform 2.6s linear'; prog.style.transform = 'scaleX(1)'; };
    if (stage) { cardA = mk(0, 'cur'); stage.appendChild(cardA); meta(0); }
    const swipe = () => {
      if (swiping || !stage) return; swiping = true;
      const next = (fi + 1) % FEED.length; cardB = mk(next, 'next'); stage.appendChild(cardB);
      // finger: appears low, drags up fast
      finger.classList.remove('go'); void finger.offsetWidth; finger.classList.add('go');
      requestAnimationFrame(() => { cardA.classList.add('out'); cardB.classList.add('in'); stage.classList.add('blur'); });
      setTimeout(() => { stage.classList.remove('blur'); wfEl.classList.add('shake'); cardA.remove(); cardA = cardB; cardA.className = 'wf-card cur'; fi = next; meta(fi); resetProg(); }, 430);
      setTimeout(() => { wfEl.classList.remove('shake'); swiping = false; }, 760);
    };
    const like = () => { burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go'); heart.classList.add('on'); setTimeout(() => heart.classList.remove('on'), 1400); };
    const schedule = () => { if (!feedOn) return; const r = Math.random(); const wait = r < .25 ? 700 : r < .8 ? 2000 + Math.random() * 1200 : 3400; feedT = setTimeout(() => { if (Math.random() < .3) { like(); setTimeout(swipe, 650); } else swipe(); schedule(); }, wait); };
    if (stage) new IntersectionObserver(([en]) => { feedOn = en.isIntersecting && !reduce; clearTimeout(feedT); if (feedOn) { resetProg(); schedule(); } }, { threshold: .3 }).observe($('#wf'));
    /* phone: fly-in on scroll; desktop tilt follows the pointer */
    const wfEl = $('#wf'), top = $('.why-top');
    if (wfEl) {
      // solid rounded body: stacked layers behind the screen, lighter at the front edge
      for (let k = 1; k <= 16; k++) { const l = document.createElement('i'); l.className = 'wf-l'; l.style.setProperty('--k', k); l.style.background = `hsl(232 ${46 - k}% ${k < 2 ? 62 : 34 - k * 1.2}%)`; wfEl.prepend(l); }
      new IntersectionObserver(([en]) => wfEl.classList.toggle('in', en.isIntersecting), { threshold: .35 }).observe(wfEl);
    }
    if (wfEl && top && matchMedia('(hover:hover)').matches && !reduce) {
      top.addEventListener('pointermove', e => { const r = top.getBoundingClientRect(); wfEl.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 18 + 'deg'); wfEl.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 12 + 'deg'); });
      top.addEventListener('pointerleave', () => { wfEl.style.removeProperty('--ry'); wfEl.style.removeProperty('--rx'); });
    }
    const clk = $('#wf-clock'); if (clk && !reduce) setInterval(() => clk.classList.toggle('t'), 1000);

    /* stepper: pinned & scrubbed on desktop, timed on phones; tabs stay clickable */
    const tabs = $$('.ws-tab', why), panels = $$('.ws-panel', why), wcn = $('#wc-n'), ws = $('#ws');
    let cur = -1, cnt = null, st = null, timer = null, hold = 0;
    const count = () => { clearInterval(cnt); let n = 0; wcn.textContent = '0'; cnt = setInterval(() => { n++; wcn.textContent = n; if (n >= 20) clearInterval(cnt); }, 95); };
    const go = i => {
      if (i === cur) return; cur = i;
      tabs.forEach((t, k) => { t.classList.toggle('on', k === cur); t.classList.toggle('done', k < cur); t.setAttribute('aria-selected', String(k === cur)); if (k !== cur) t.style.setProperty('--p', k < cur ? 1 : 0); });
      panels.forEach((p, k) => { p.classList.toggle('on', k === cur); p.classList.remove('play'); if (k === cur) { void p.offsetWidth; p.classList.add('play'); } });
      if (cur === 0) count();
      if (cur === 1) { const c = $('.wo-crop'); if (c && c.setCurrentTime) c.setCurrentTime(0); }
    };
    const pinned = hasGsap && !reduce && innerWidth > 1000;
    if (pinned) {
      st = ScrollTrigger.create({ trigger: ws, start: 'top 72px', end: () => '+=' + Math.round(innerHeight * 2.4), pin: true, anticipatePin: 1, scrub: .4, invalidateOnRefresh: true,
        onUpdate: t => { const x = t.progress * 3, i = Math.min(2, Math.floor(x)); go(i); tabs[i].style.setProperty('--p', Math.min(1, x - i)); } });
      tabs.forEach((t, k) => t.addEventListener('click', () => { const y = st.start + (st.end - st.start) * (k / 3) + 4; (lenis ? lenis.scrollTo(y, { duration: .9 }) : window.scrollTo({ top: y, behavior: 'smooth' })); }));
      go(0);
    } else {
      go(0);
      tabs.forEach((t, k) => t.addEventListener('click', () => { hold = Date.now() + 15000; go(k); t.style.setProperty('--p', 1); }));
      new IntersectionObserver(([en]) => { clearInterval(timer); if (en.isIntersecting && !reduce) timer = setInterval(() => { if (Date.now() > hold) { go((cur + 1) % 3); tabs[cur].style.setProperty('--p', 1); } }, 7000); }, { threshold: .3 }).observe(ws);
    }
  }

  /* ---- v52: lower sections render lazily (content-visibility); re-measure triggers once their real height is known ---- */
  if (hasGsap && 'ResizeObserver' in window) {
    let rt = null;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 250); });
    ['#insight', '#work', '#results', '#bts', '#about', '#contact'].forEach(id => { const el = $(id); el && ro.observe(el); });
  }

  /* ---- count-up + reveal ---- */
  const cio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; cio.unobserve(en.target); countUp(en.target); }), { threshold: .4 });
  $$('[data-count]').forEach(el => cio.observe(el));
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now();
    if (reduce) { el.textContent = end.toFixed(dec).replace('.', ','); return; }
    const tick = now => { const p = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - p, 3); el.textContent = (end * e).toFixed(dec).replace('.', ','); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ---- WOW: card life (numerals, spotlight, in-view, price count-up, grade sweep) ---- */
  $$('.card').forEach((c, i) => {
    c.dataset.n = String(i + 1).padStart(2, '0');
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); });
  });
  const priceUp = b => {
    const m = b.textContent.trim().match(/^([\d,]+)(.*)$/); if (!m || reduce) return;
    const end = parseFloat(m[1].replace(',', '.')), dec = (m[1].split(',')[1] || '').length, sfx = m[2], t0 = performance.now();
    const tick = now => { const p = Math.min(1, (now - t0) / 1300), e = 1 - Math.pow(1 - p, 4); b.textContent = (end * e).toFixed(dec).replace('.', ',') + sfx; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const vio2 = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; const c = en.target; vio2.unobserve(c); c.classList.add('in-view');
    const b = c.querySelector('.price b'); b && priceUp(b);
    const g = c.querySelector('.grade');
    if (g && !reduce) { const r = $('.g-range', g); let t0 = null; const sweep = now => { t0 ??= now; const p = Math.min(1, (now - t0) / 1800); const v = 50 + 38 * Math.sin(p * Math.PI * 2) * (1 - p); r.value = v; g.style.setProperty('--pos', v + '%'); if (p < 1) requestAnimationFrame(sweep); }; requestAnimationFrame(sweep); }
  }), { threshold: .45 });
  $$('.card').forEach(c => vio2.observe(c));
  $$('.tp b').forEach(b => { const o = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { o.disconnect(); priceUp(b.childNodes[0] ? { get textContent(){ return b.firstChild.textContent; }, set textContent(v){ b.firstChild.textContent = v; } } : b); } }), { threshold: .6 }); o.observe(b); });



  /* ---- v11: edge-detected wireframe from any same-origin image ---- */
  const wireCache = new Map();
  const near = (el, fn) => { if (!el) return fn(); const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '800px 0px' }); io.observe(el); };
  const wireOf = (src, maxW = 900) => {
    if (wireCache.has(src)) return wireCache.get(src);
    const p = new Promise(res => {
      const im = new Image(); im.decoding = 'async';
      im.onload = () => {
        const sc = Math.min(1, maxW / im.naturalWidth), w = Math.round(im.naturalWidth * sc), h = Math.round(im.naturalHeight * sc);
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d', { willReadFrequently: true });
        cx.drawImage(im, 0, 0, w, h); const d = cx.getImageData(0, 0, w, h).data, g = new Float32Array(w * h);
        for (let i = 0, j = 0; i < d.length; i += 4, j++) g[j] = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
        const b = new Float32Array(w * h);
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { let s2 = 0; for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++) s2 += g[(y + yy) * w + x + xx]; b[y * w + x] = s2 / 9; }
        const out = cx.createImageData(w, h), o = out.data;
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
          const k = y * w + x;
          const gx = -b[k - w - 1] - 2 * b[k - 1] - b[k + w - 1] + b[k - w + 1] + 2 * b[k + 1] + b[k + w + 1];
          const gy = -b[k - w - 1] - 2 * b[k - w] - b[k - w + 1] + b[k + w - 1] + 2 * b[k + w] + b[k + w + 1];
          const m = Math.sqrt(gx * gx + gy * gy), a = m < 14 ? 0 : Math.min(255, (m - 14) * 4.2);
          const q = k * 4; o[q] = 140 + a * .45; o[q + 1] = 215 + a * .15; o[q + 2] = 255; o[q + 3] = a;
        }
        cx.putImageData(out, 0, 0); res(cv.toDataURL('image/png'));
      };
      im.onerror = () => res('');
      im.src = src;
    });
    wireCache.set(src, p); return p;
  };

  /* ---- v11: pipeline viewer (scroll or drag: wireframe -> clay -> render) ---- */
  const pst = $('#pipe-stage');
  if (pst) {
    const range = $('#ps-range'), steps = $$('.ps-steps li'), modes = $$('.ps-modes span'), l1 = $('.ps-line.l1'), l2 = $('.ps-line.l2');
    const setP = v => { // v: 0..100 (0 = wireframe, 100 = render)
      const e = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const a = e(Math.min(1, v / 50)), b = e(Math.max(0, (v - 50) / 50));
      const p1 = -15 + a * 130, p2 = -15 + b * 130;
      pst.style.setProperty('--p1', p1 + '%'); pst.style.setProperty('--p2', p2 + '%');
      l1.toggleAttribute('data-off', a <= 0 || a >= 1); l2.toggleAttribute('data-off', b <= 0 || b >= 1);
      const st = v < 40 ? 0 : v < 80 ? 1 : 2; steps.forEach((s2, i) => s2.classList.toggle('on', i === st)); modes.forEach((m2, i) => m2.classList.toggle('on', i === st));
      range.value = v;
    };
    const load = (clay, render, name) => {
      $('#ps-clay').src = 'assets/img/' + clay + '.webp'; $('#ps-render').src = 'assets/img/' + render + '.webp'; $('#ps-name').textContent = name;
      near($('#pipe'), () => wireOf('assets/img/' + clay + '.webp').then(u => { if (u) $('#ps-wire').src = u; }));
    };
    load('g-10', 'g-09', 'Tea set');
    range.addEventListener('input', () => setP(+range.value));
    $$('.ps-switch button').forEach(b => b.addEventListener('click', () => { $$('.ps-switch button').forEach(x => x.classList.toggle('is-active', x === b)); load(b.dataset.clay, b.dataset.render, b.dataset.name); }));
    if (hasGsap && !reduce && innerWidth > 1000) {
      setP(0);
      // hold the frame at screen centre (or near top if taller than the screen), then wipe layer by layer
      ScrollTrigger.create({ trigger: '#pipe', pin: true, anticipatePin: 1, start: () => $('#pipe').offsetHeight > innerHeight * .9 ? 'top 80px' : 'center center', end: () => '+=' + Math.round(innerHeight * 1.4), scrub: .6, invalidateOnRefresh: true, onUpdate: s2 => setP(Math.round(s2.progress * 100)) });
    } else if (!reduce) {
      setP(0);
      new IntersectionObserver((es, ob) => es.forEach(en => { if (!en.isIntersecting) return; ob.disconnect(); let t0 = null; const run = now => { t0 ??= now; const k = Math.min(1, (now - t0) / 3200); setP(Math.round(k * 100)); if (k < 1) requestAnimationFrame(run); }; requestAnimationFrame(run); }), { threshold: .5 }).observe(pst);
    } else setP(100);
  }

  /* ---- v11: cinema — each film "renders in" from its wireframe ---- */
  const sw = $('#scr-wire');
  window.__deeplabWire = src => {
    if (!sw || reduce) return;
    near($('#screen'), () => wireOf(src, 1280).then(u => {
      if (!u) return; sw.querySelector('img').src = u;
      if ($('#screen').classList.contains('wire-hold')) return;
      sw.getAnimations().forEach(a => a.cancel());
      sw.classList.add('on');
      const a = sw.animate([{ '--wt': '0%' }, { '--wt': '100%' }], { duration: 1500, delay: 350, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      a.onfinish = () => { sw.classList.remove('on'); a.cancel(); };
    }));
  };
  try { CSS.registerProperty({ name: '--wt', syntax: '<percentage>', inherits: true, initialValue: '0%' }); } catch (e) {}
  const swBtn = $('#sl-wire');
  swBtn && swBtn.addEventListener('click', () => { const on = swBtn.getAttribute('aria-pressed') !== 'true'; swBtn.setAttribute('aria-pressed', String(on)); $('#screen').classList.toggle('wire-hold', on); });

  /* ---- v9: live screen (muted YouTube) ---- */
  const liveOK = !reduce && matchMedia('(pointer:fine)').matches && innerWidth > 900 && !(navigator.connection && navigator.connection.saveData);
  const live = $('#scr-live'), screenEl = $('#screen');
  let liveTimer = null;
  if (live && !$('.scr-live-tag')) screenEl.insertAdjacentHTML('beforeend', '<span class="scr-live-tag"><i></i>LIVE PREVIEW</span>');
  window.__deeplabLive = id => {
    if (!liveOK || !live) return;
    clearTimeout(liveTimer); live.classList.remove('on'); screenEl.classList.remove('is-live');
    liveTimer = setTimeout(() => {
      live.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&start=12" title="Xem trước phim" allow="autoplay; encrypted-media" tabindex="-1"></iframe>`;
      live.querySelector('iframe').addEventListener('load', () => setTimeout(() => { live.classList.add('on'); screenEl.classList.add('is-live'); }, 1800), { once: true });
    }, 1200);
  };
  window.__deeplabLiveStop = () => { clearTimeout(liveTimer); if (live) { live.classList.remove('on'); live.innerHTML = ''; } screenEl && screenEl.classList.remove('is-live'); };

  /* ---- v9: lights down + screen zooms out from full-bleed ---- */
  if (hasGsap && !reduce && $('.cinema')) {
    gsap.fromTo('.dimmer', { opacity: 0 }, { opacity: .92, ease: 'none', scrollTrigger: { trigger: '.cinema', start: 'top 85%', end: 'top 15%', scrub: true } });
    gsap.fromTo('.dimmer', { opacity: .92 }, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.cinema', start: 'bottom 90%', end: 'bottom 40%', scrub: true } });
  }

  /* ---- v9: PLAY cursor ---- */
  if (matchMedia('(pointer:fine)').matches && !reduce) {
    const pc = $('.play-cursor'); document.documentElement.classList.add('has-pcursor');
    const xTo = hasGsap ? gsap.quickTo(pc, 'x', { duration: .35, ease: 'power3' }) : v => pc.style.left = v + 'px';
    const yTo = hasGsap ? gsap.quickTo(pc, 'y', { duration: .35, ease: 'power3' }) : v => pc.style.top = v + 'px';
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
    const label = pc.querySelector('span');
    $$('.rt, #screen').forEach(el => {
      el.addEventListener('pointerenter', () => { label.textContent = el.id === 'screen' ? 'PLAY' : 'CHỌN'; pc.classList.add('on'); });
      el.addEventListener('pointerleave', () => pc.classList.remove('on'));
    });
    $('#screen').addEventListener('click', e => { if (!e.target.closest('.scr-play')) $('#scr-play').click(); });
  }

  /* ---- v9: hover loops (drop assets/video/loops/<id>.mp4 and list the ids in assets/video/media.json) ---- */
  const media = fetch('assets/video/media.json').then(r => r.ok ? r.json() : {}).catch(() => ({}));
  media.then(m => {
    const set = new Set(m.loops || []); if (!set.size) return;
    $$('.rt').forEach(t => {
      if (!set.has(t.dataset.yt)) return;
      let v = null;
      t.addEventListener('pointerenter', () => { if (!v) { v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.src = 'assets/video/loops/' + t.dataset.yt + '.mp4'; t.querySelector('.rt-img').appendChild(v); } play(v).then(() => v.classList.add('on')).catch(() => {}); });
      t.addEventListener('pointerleave', () => { if (v) { v.pause(); v.classList.remove('on'); } });
    });
  }).catch(() => {});

  /* ---- v9: hero showreel (assets/video/showreel.mp4, enabled by "showreel": true in media.json) ---- */
  const hv = $('.landing-video');
  if (hv && !reduce) media.then(m => { if (!m.showreel) return; hv.src = hv.dataset.src; play(hv).then(() => hv.classList.add('on')).catch(() => {}); });

  /* ---- CINEMA: screening room (stage + rail + autoplay) ---- */
  const cin = $('.cinema');
  if (cin) {
    const tiles = $$('.rt', cin), rail = $('#rail'), DUR = liveOK ? 16000 : 7000;
    const scrA = $('#scr-a'), scrB = $('#scr-b'), ambA = $('#amb-a'), ambB = $('#amb-b');
    let cur = -1, timer = null, paused = false, inView = false, flip = false;
    const vis = () => tiles.filter(t => !t.classList.contains('is-hidden') && !(t.closest('.band') || {}).hidden);
    const swap = (a, b, src) => { const [on, off] = flip ? [b, a] : [a, b]; off.src = src; off.decode ? off.decode().catch(() => {}).finally(() => { off.classList.add('on'); on.classList.remove('on'); }) : (off.classList.add('on'), on.classList.remove('on')); };
    const select = (i, user) => {
      const t = tiles[i]; if (!t || i === cur) return; cur = i;
      tiles.forEach(x => x.classList.toggle('is-on', x === t)); $$('.band', cin).forEach(bd => bd.classList.toggle('is-current', bd.contains(t)));
      const big = 'assets/img/yt/' + t.dataset.yt + '.webp';
      window.__deeplabWire && window.__deeplabWire(big); swap(scrA, scrB, big); swap(ambA, ambB, big); flip = !flip; $('#screen').style.setProperty('--bg', 'url(../img/yt/' + t.dataset.yt + '.webp)');
      $('#scr-a').alt = $('#scr-b').alt = t.dataset.title;
      $('#sl-cat').textContent = t.dataset.fmt.toLowerCase().includes(t.querySelector('small').textContent.toLowerCase()) ? t.dataset.fmt : t.querySelector('small').textContent + ' · ' + t.dataset.fmt;
      $('#sl-title').textContent = t.dataset.title; $('#sl-desc').textContent = t.dataset.desc; $('#sl-tag').textContent = t.dataset.tag;
      $('#scr-idx').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(tiles.length).padStart(2, '0');
      if (hasGsap && !reduce) gsap.fromTo(['#sl-cat', '#sl-title', '#sl-desc'], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .06, ease: 'power3.out' });
      if (user) { const st = $('#stage').getBoundingClientRect(); if (st.top < 0 || st.bottom > innerHeight) (lenis ? lenis.scrollTo('#stage', { offset: -90, duration: 1.1 }) : $('#stage').scrollIntoView({ behavior: 'smooth' })); }
      window.__deeplabLive && (inView ? window.__deeplabLive(t.dataset.yt) : window.__deeplabLiveStop());
      restart();
    };
    const step = d => { const v = vis(); if (!v.length) return; const k = v.indexOf(tiles[cur]); select(tiles.indexOf(v[(k + d + v.length) % v.length])); };
    const restart = () => {
      clearTimeout(timer); const t = tiles[cur]; if (t) { const bar = t.querySelector('.rt-bar'); bar.style.setProperty('--dur', DUR + 'ms'); bar.replaceWith(bar.cloneNode(true)); }
      if (!reduce && inView && !paused) timer = setTimeout(() => step(1), DUR);
    };
    tiles.forEach((t, i) => t.addEventListener('click', () => { if (rail.dataset.moved === '1') return; select(i, true); }));
    $('#sl-prev')?.addEventListener('click', () => step(-1)); $('#sl-next')?.addEventListener('click', () => step(1));
    const play = () => { if (!tiles[cur]) return; window.__deeplabLiveStop(); openVideo(tiles[cur].dataset.yt); };
    $('#scr-play').addEventListener('click', play); $('#sl-watch')?.addEventListener('click', play);
    const stage = $('#stage');
    [stage, rail].forEach(el => { el.addEventListener('pointerenter', () => { paused = true; rail.classList.add('paused'); clearTimeout(timer); }); el.addEventListener('pointerleave', () => { paused = false; rail.classList.remove('paused'); restart(); }); });
    new IntersectionObserver(es => es.forEach(en => { inView = en.isIntersecting; if (inView) { restart(); tiles[cur] && window.__deeplabLive(tiles[cur].dataset.yt); } else { clearTimeout(timer); window.__deeplabLiveStop(); } }), { threshold: .35 }).observe(stage);
    addEventListener('keydown', e => { if (!inView || $('#modal').classList.contains('is-open')) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    $$('.cin-tabs button').forEach(b => b.addEventListener('click', () => {
      $$('.cin-tabs button').forEach(x => x.classList.toggle('is-active', x === b));
      $$('.band', cin).forEach(bd => bd.hidden = b.dataset.filter !== 'all' && bd.dataset.cat !== b.dataset.filter);
      const v = vis(); if (v.length) { cur = -1; select(tiles.indexOf(v[0])); }
    }));
    // drag to scroll the rail
    let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.dataset.moved = '0'; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { rail.dataset.moved = '1'; rail.classList.add('drag'); } rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; rail.classList.remove('drag'); setTimeout(() => rail.dataset.moved = '0', 0); });
    tiles.forEach(t => t.querySelector('.rt-img').style.setProperty('--bg', 'url(../img/yt/' + t.dataset.yt + '-s.webp)'));
    const start = tiles.findIndex(t => t.dataset.yt === $('#scr-play').dataset.yt);
    select(start < 0 ? 0 : start);
  }

  /* ---- colour-grade before/after slider ---- */
  $$('.grade').forEach(g => { const r = $('.g-range', g); const set = () => g.style.setProperty('--pos', r.value + '%'); r.addEventListener('input', set); set(); });

  /* ---- modal: youtube + image ---- */
  const modal = $('#modal'), box = $('#modal-box');
  const openBox = () => { modal.hidden = false; requestAnimationFrame(() => modal.classList.add('is-open')); lenis && lenis.stop(); $('#modal-close').focus(); };
  function openVideo(id) { box.classList.remove('is-img', 'is-clip'); box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="Video Deeplab Media" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`; openBox(); }
  const openImg = src => { box.classList.remove('is-clip'); box.classList.add('is-img'); box.innerHTML = `<img src="${src}" alt="">`; openBox(); };
  const closeBox = () => { modal.classList.remove('is-open', 'is-gal'); gi = -1; lenis && lenis.start(); setTimeout(() => { box.innerHTML = ''; modal.hidden = true; }, 350); };
  $$('.work[data-yt]').forEach(el => el.addEventListener('click', () => openVideo(el.dataset.yt)));
  $$('[data-img]').forEach(el => el.addEventListener('click', () => openImg(el.dataset.img)));
  // v60: vertical product films play from the site itself, with sound and controls (user tap, so the in-app guard skips them)
  const openClip = src => { box.classList.remove('is-img'); box.classList.add('is-clip'); box.innerHTML = `<video src="${src}" controls playsinline preload="auto"></video>`; openBox(); if (!noAuto) box.querySelector('video').play().catch(() => {}); };
  $$('[data-clip]').forEach(el => el.addEventListener('click', () => openClip(el.dataset.clip)));
  // v62: BTS gallery — reveal on scroll, expand, arrow through photos in the lightbox
  const gal = $$('.bp-i'); let gi = -1;
  const gio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add(en.target.classList.contains('bp') ? 'is-in' : 'in'); gio.unobserve(en.target); } }), { threshold: .15 });
  gal.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; gio.observe(el); el.addEventListener('click', () => { gi = i; modal.classList.add('is-gal'); }); });
  $('#bp') && gio.observe($('#bp'));
  $('#bp-more')?.addEventListener('click', e => { $('#bp').classList.add('open'); e.currentTarget.setAttribute('aria-expanded', 'true'); window.ScrollTrigger && ScrollTrigger.refresh(); });
  const galGo = d => { if (gi < 0) return; gi = (gi + d + gal.length) % gal.length; const im = box.querySelector('img'); if (im) { im.src = gal[gi].dataset.img; im.alt = gal[gi].querySelector('img').alt; } };
  $('#modal-prev')?.addEventListener('click', () => galGo(-1)); $('#modal-next')?.addEventListener('click', () => galGo(1));
  addEventListener('keydown', e => { if (!modal.classList.contains('is-gal') || modal.hidden) return; if (e.key === 'ArrowLeft') galGo(-1); if (e.key === 'ArrowRight') galGo(1); });
  $('#modal-close').addEventListener('click', closeBox);
  modal.addEventListener('click', e => { if (e.target === modal) closeBox(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeBox(); closeMenu(); } });

  $('#year').textContent = new Date().getFullYear();
  addEventListener('load', () => window.ScrollTrigger && ScrollTrigger.refresh());
})();
