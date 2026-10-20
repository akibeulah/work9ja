/* Work9ja — shared behaviour (nav, smooth scroll, reveals, magnetic, counters) */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // page-load choreography
  function loaded(){ document.body.classList.add('loaded'); }
  window.addEventListener('load', function(){ requestAnimationFrame(loaded); });
  setTimeout(loaded, 1200);

  // nav background on scroll
  var nav = document.getElementById('nav');
  function onScroll(){ if (nav) nav.classList.toggle('stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu — side-sliding drawer with overlay
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    function setMenu(open){
      links.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      if (nav) nav.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function(){ setMenu(!links.classList.contains('open')); });
    overlay.addEventListener('click', function(){ setMenu(false); });
    links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function(){ if (window.innerWidth > 900) setMenu(false); });
  }

  // smooth scroll (Lenis if present) + anchor handling
  var lenis = null;
  window.addEventListener('DOMContentLoaded', function(){
    if (!reduce && window.Lenis) {
      lenis = new window.Lenis({ duration: 1.1, easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
      var raf = function(t){ lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.on('scroll', onScroll);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(el, { offset: -70 });
        else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  // reveals + trigger bar/counter animations
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('in'); runCounters(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, [data-bars], [data-count]').forEach(function(el){ io.observe(el); });

  // animated counters
  function runCounters(root){
    var nodes = root.matches && root.matches('[data-count]') ? [root] : [];
    root.querySelectorAll && root.querySelectorAll('[data-count]').forEach(function(n){ nodes.push(n); });
    nodes.forEach(function(n){
      if (n.dataset.done) return; n.dataset.done = '1';
      var target = parseFloat(n.dataset.count);
      var suffix = n.dataset.suffix || '';
      var dur = 1400, start = performance.now();
      if (reduce){ n.textContent = fmt(target) + suffix; return; }
      function tick(now){
        var p = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        n.textContent = fmt(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  function fmt(v){ return v >= 1000 ? Math.round(v).toLocaleString() : (Math.round(v*10)/10).toString(); }

  // magnetic buttons + card spotlight
  if (!reduce && fine){
    document.querySelectorAll('[data-magnetic]').forEach(function(btn){
      btn.addEventListener('pointermove', function(e){
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + (e.clientX - r.left - r.width/2)*0.3 + 'px,' + (e.clientY - r.top - r.height/2)*0.3 + 'px)';
      });
      btn.addEventListener('pointerleave', function(){ btn.style.transform = ''; });
    });
    document.querySelectorAll('[data-spotlight]').forEach(function(card){
      card.addEventListener('pointermove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
