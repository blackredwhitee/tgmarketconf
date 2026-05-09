/* =================================================================
   TG MARKET CONF 2026 — scripts/main.js

   СОДЕРЖАНИЕ:
   1. ✅ SCRIPT_URL — единственное что нужно менять
   2. Page loader (cinematic entry)
   3. Reveal-анимации при скролле
   4. Анимация Hero при загрузке
   5. Тень шапки при скролле
   6. Параллакс числа "26"
   7. Анимация счётчиков статистики
   8. Лайтбокс (полноэкранный просмотр фото)
   9. Отправка форм в Google Таблицу

   ⚠️ НЕ ТРОГАЙТЕ этот файл если не уверены в результате.
   ✅ МЕНЯЙТЕ ТОЛЬКО: SCRIPT_URL в самом начале.
================================================================= */

/* =================================================================
   ✅ НАСТРОЙКА GOOGLE ТАБЛИЦЫ
   =========================
   Шаг 1: Откройте apps_script_instructions.html — там полная инструкция.
   Шаг 2: Замените строку ниже на URL вашего Apps Script Web App.

   БЫЛО:  const SCRIPT_URL = "ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА";
   СТАЛО: const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
================================================================= */
const SCRIPT_URL = "ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА";


/* ── PAGE LOADER ─────────────────────────────────────────────────── */
(function initPageLoader() {
  var loader = document.getElementById('page-loader');
  if (!loader) return;
  function hide() { loader.classList.add('done'); }
  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', function() { setTimeout(hide, 280); });
  }
  setTimeout(hide, 2500); // fallback
})();


/* ── REVEAL ANIMATIONS ───────────────────────────────────────────── */
/*
  Элементы с .reveal, .reveal-up, .reveal-left, .reveal-scale
  появляются при попадании в экран (добавляется класс .visible).
  Задержки: .d1–.d6 в HTML.
  ✅ Скорость: CSS transition в styles/main.css (.reveal).
  ⚠️ Не удаляйте класс .reveal из HTML.
*/
(function initReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-scale');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
  els.forEach(function(el) { obs.observe(el); });
})();


/* ── HERO ENTRANCE ───────────────────────────────────────────────── */
/*
  Новый hero: центрированный, элементы появляются сверху вниз.
  Eyebrow → H1 → Sub → Btns → Facts
  ✅ Пауза между элементами: измените 130 (миллисекунды).
*/
(function initHero() {
  var sequence = [
    '.hero-eyebrow',
    'h1.hero-h1',
    '.hero-sub',
    '.hero-btns',
    '.hero-facts'
  ];
  sequence.forEach(function(sel, i) {
    var el = document.querySelector(sel);
    if (!el) return;
    setTimeout(function() { el.classList.add('in'); }, 160 + i * 130);
  });
})();


/* ── NAV SHADOW ──────────────────────────────────────────────────── */
(function initNavShadow() {
  var nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
})();


/* ── PARALLAX watermark "26" ─────────────────────────────────────── */
/*
  Очень тихий watermark на фоне hero движется медленнее скролла.
  ✅ Скорость: измените 0.08 (0 = нет движения, 0.3 = заметно).
  На мобильных отключается автоматически.
*/
(function initParallax() {
  var yr = document.querySelector('.hero-bg-yr');
  if (!yr) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;
  window.addEventListener('scroll', function() {
    yr.style.transform = 'translateY(' + (window.scrollY * 0.08) + 'px)';
  }, { passive: true });
})();


/* ── COUNTERS — анимация статистики ─────────────────────────────── */
/*
  В HTML: data-count="3000" data-suffix="+"
  ✅ Длительность: измените dur = 1800 (миллисекунды).
*/
(function initCounters() {
  var els = document.querySelectorAll('.past-stat-n[data-count]');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1800, start = null; // ✅ Длительность
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('ru') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(function(el) { obs.observe(el); });
})();


/* ── LIGHTBOX ────────────────────────────────────────────────────── */
/*
  Открывается по клику на .gp (ячейки галереи).
  Навигация: стрелки на экране или ← → Esc на клавиатуре.
  ⚠️ Не трогайте.
*/
(function initLightbox() {
  var lb = document.getElementById('lb');
  var li = document.getElementById('lb-img');
  var lx = document.getElementById('lb-x');
  var lp = document.getElementById('lb-prev');
  var ln = document.getElementById('lb-next');
  if (!lb || !li) return;

  var cells = Array.from(document.querySelectorAll('.gp'));
  var imgs  = Array.from(document.querySelectorAll('.gp img'));
  var idx   = 0;

  function open(i) {
    if (!imgs[i]) return;
    idx = i;
    li.src = imgs[i].src;
    li.alt = imgs[i].alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(d) {
    idx = (idx + d + imgs.length) % imgs.length;
    li.src = imgs[idx].src;
    li.alt = imgs[idx].alt;
  }

  cells.forEach(function(c, i) { c.addEventListener('click', function() { open(i); }); });
  lx && lx.addEventListener('click', close);
  lp && lp.addEventListener('click', function() { step(-1); });
  ln && ln.addEventListener('click', function() { step(1);  });
  lb.addEventListener('click', function(e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();


/* ── FORM SUBMISSION → Google Sheets ────────────────────────────── */
/*
  Вызывается из HTML: onclick="submitForm('partner')"

  Данные отправляются:
  - method: POST
  - mode: no-cors (⚠️ обязательно для Apps Script)
  - Content-Type: text/plain (⚠️ обязательно)

  ✅ Как добавить новый тип формы:
  Добавьте ветку else if (type === 'yourtype') с вашими полями.
*/
function submitForm(type) {
  var data, okEl, errEl;

  if (type === 'partner') {
    data = {
      type:     'partner',
      name:     val('p-name'),
      company:  val('p-company'),
      telegram: val('p-telegram'),
      email:    val('p-email'),
      comment:  val('p-comment')
    };
    okEl  = document.getElementById('p-ok');
    errEl = document.getElementById('p-err');
  } else {
    return;
  }

  // Валидация
  if (!data.name) {
    alert('Пожалуйста, введите имя.');
    return;
  }
  if (!data.email) {
    alert('Пожалуйста, введите email.');
    return;
  }

  // Если URL не настроен — подсказка
  if (SCRIPT_URL === 'ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА') {
    if (okEl) {
      okEl.style.display = 'block';
      okEl.textContent   = '⚠ Вставьте URL Apps Script (см. apps_script_instructions.html)';
      setTimeout(function() { okEl.style.display = 'none'; }, 6000);
    }
    return;
  }

  // Отправка
  fetch(SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body:    JSON.stringify(data)
  })
  .then(function() {
    if (okEl)  okEl.style.display  = 'block';
    if (errEl) errEl.style.display = 'none';
    // Очистка полей
    var fields = type === 'partner'
      ? ['p-name','p-company','p-telegram','p-email','p-comment']
      : [];
    fields.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    setTimeout(function() { if (okEl) okEl.style.display = 'none'; }, 6000);
  })
  .catch(function() {
    if (errEl) {
      errEl.style.display = 'block';
      setTimeout(function() { errEl.style.display = 'none'; }, 8000);
    }
  });
}

// Вспомогательная функция
function val(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
