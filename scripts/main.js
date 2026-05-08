/* =================================================================
   TG MARKET CONF 2026 — MAIN SCRIPTS
   Файл: scripts/main.js

   СОДЕРЖАНИЕ:
   1. Анимации появления при скролле
   2. Анимация hero при загрузке
   3. Параллакс числа "26" при скролле мыши
   4. Тень шапки при скролле
   5. Анимация счётчиков статистики
   6. Лайтбокс для галереи
   7. Отправка форм в Google Sheets

   ⚠️ НЕ ТРОГАЙТЕ этот файл если не уверены в результате
   ✅ ЕДИНСТВЕННОЕ что нужно менять: SCRIPT_URL
================================================================= */

/* =================================================================
   ✅ НАСТРОЙКА GOOGLE ТАБЛИЦЫ
   ========================
   Замените "ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА" на URL Apps Script.
   Подробная инструкция: apps_script_instructions.html
   
   Пример:
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
================================================================= */
const SCRIPT_URL = "ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА";


/* =================================================================
   1. АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
   Элементы с классом .reveal появляются когда попадают в экран
================================================================= */
(function initReveal() {
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    obs.observe(el);
  });
})();


/* =================================================================
   2. АНИМАЦИЯ HERO ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
   Элементы появляются по очереди
================================================================= */
(function initHero() {
  var elements = [
    document.querySelector('.hero-kicker'),
    document.querySelector('h1'),
    document.querySelector('.hero-lead'),
    document.querySelector('.hero-btns'),
  ];
  elements.forEach(function(el, i) {
    if (!el) return;
    // Небольшая задержка при первой загрузке
    setTimeout(function() {
      el.classList.add('hero-in');
    }, 100 + i * 130);
  });
})();


/* =================================================================
   3. ТЕНЬ ШАПКИ ПРИ СКРОЛЛЕ
================================================================= */
(function initNavShadow() {
  var nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* =================================================================
   4. ЛЁГКОЕ ДВИЖЕНИЕ ЧИСЛА "26" ПРИ СКРОЛЛЕ (параллакс)
   ✅ Чтобы отключить — удалите этот блок
================================================================= */
(function initParallax() {
  var heroYr = document.querySelector('.hero-yr');
  if (!heroYr) return;
  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    // Число движется в 0.15x скорости скролла
    heroYr.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
  }, { passive: true });
})();


/* =================================================================
   5. АНИМАЦИЯ СЧЁТЧИКОВ СТАТИСТИКИ
   Числа "3 000+" считаются вверх когда попадают в экран
================================================================= */
(function initCounters() {
  var counters = document.querySelectorAll('.past-stat-n[data-count]');
  if (!counters.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el     = e.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start  = 0;
      var duration = 1800; // мс
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing out
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(ease * target);
        el.textContent = current.toLocaleString('ru') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { obs.observe(c); });
})();


/* =================================================================
   6. ЛАЙТБОКС ДЛЯ ГАЛЕРЕИ
   Открывается при клике на фото, закрывается по Esc / стрелки
================================================================= */
(function initLightbox() {
  var lb     = document.getElementById('lb');
  var lbImg  = document.getElementById('lb-img');
  var lbX    = document.getElementById('lb-x');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');

  if (!lb || !lbImg) return;

  var gps  = Array.from(document.querySelectorAll('.gp'));
  var imgs = Array.from(document.querySelectorAll('.gp img'));
  var idx  = 0;

  function open(i) {
    if (!imgs[i]) return;
    idx = i;
    lbImg.src = imgs[i].src;
    lbImg.alt = imgs[i].alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(dir) {
    idx = (idx + dir + imgs.length) % imgs.length;
    lbImg.src = imgs[idx].src;
    lbImg.alt = imgs[idx].alt;
  }

  gps.forEach(function(gp, i) {
    gp.addEventListener('click', function() { open(i); });
  });

  if (lbX)    lbX.addEventListener('click', close);
  if (lbPrev) lbPrev.addEventListener('click', function() { step(-1); });
  if (lbNext) lbNext.addEventListener('click', function() { step(1);  });

  lb.addEventListener('click', function(e) {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();


/* =================================================================
   7. ОТПРАВКА ФОРМ В GOOGLE ТАБЛИЦУ
   =================================
   Функция submitForm(type):
   - type = 'partner'     → форма партнёра
   - type = 'participant' → форма участника (если понадобится)

   Данные отправляются через fetch с mode: "no-cors"
   Content-Type: text/plain;charset=utf-8
   (требование Apps Script)
================================================================= */
function submitForm(type) {
  var data, okEl, errEl;

  /* Собираем данные из полей формы */
  if (type === 'partner') {
    data = {
      type:    'partner',
      name:    getVal('p-name'),
      company: getVal('p-company'),
      telegram:getVal('p-telegram'),
      email:   getVal('p-email'),
      comment: getVal('p-comment'),
    };
    okEl  = document.getElementById('p-ok');
    errEl = document.getElementById('p-err');
  } else {
    // Расширяйте здесь при необходимости
    return;
  }

  /* Валидация обязательных полей */
  if (!data.name || !data.email) {
    alert('Пожалуйста, заполните имя и email.');
    return;
  }

  /* Проверка: URL ещё не настроен */
  if (SCRIPT_URL === 'ВСТАВЬТЕ_URL_ВАШЕГО_СКРИПТА') {
    if (okEl) {
      okEl.style.display = 'block';
      okEl.textContent = '⚠ Вставьте URL Apps Script (см. apps_script_instructions.html)';
      setTimeout(function() { okEl.style.display = 'none'; }, 6000);
    }
    return;
  }

  /* Отправка */
  fetch(SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',  /* ✅ Обязательно — Apps Script требует no-cors */
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body:    JSON.stringify(data),
  })
  .then(function() {
    /* no-cors не возвращает ответ — считаем успехом */
    if (okEl) { okEl.style.display = 'block'; }
    if (errEl){ errEl.style.display = 'none';  }
    /* Очищаем форму */
    clearForm(type);
    setTimeout(function() {
      if (okEl) okEl.style.display = 'none';
    }, 6000);
  })
  .catch(function() {
    if (errEl) {
      errEl.style.display = 'block';
      setTimeout(function() { errEl.style.display = 'none'; }, 8000);
    }
  });
}

/* Вспомогательные функции */
function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function clearForm(type) {
  var ids = type === 'partner'
    ? ['p-name','p-company','p-telegram','p-email','p-comment']
    : [];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
}
