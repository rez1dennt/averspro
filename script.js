/* ============================================
   АверсПро — Shared JS
   Burger, accordions, forms, reveal, counters
   ============================================ */
(() => {
  'use strict';

  const updateScrollbarCompensation = () => {
    const scrollbarWidth = Math.max(window.innerWidth - document.documentElement.clientWidth, 0);
    document.documentElement.style.setProperty('--scrollbar-comp', `${scrollbarWidth}px`);
  };
  updateScrollbarCompensation();
  window.addEventListener('resize', updateScrollbarCompensation, { passive: true });

  const syncCollapsibleState = (element, open, activeClass = 'active') => {
    if (!element) return;
    element.classList.toggle(activeClass, open);
    element.style.maxHeight = open ? `${element.scrollHeight}px` : '0px';
  };

  const animateCollapsibleState = (element, open, activeClass = 'active') => {
    if (!element) return;
    const startHeight = element.getBoundingClientRect().height;
    element.classList.toggle(activeClass, open);
    const endHeight = open ? element.scrollHeight : 0;
    element.style.maxHeight = `${startHeight}px`;
    requestAnimationFrame(() => {
      element.style.maxHeight = `${endHeight}px`;
    });
  };

  // --- Header scroll ---
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Burger ---
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const setMobileMenuState = open => {
    if (!burger || !mobileMenu) return;
    updateScrollbarCompensation();
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('active', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.remove('menu-open');
    document.body.classList.toggle('menu-open', open);
  };
  const closeMobile = () => setMobileMenuState(false);
  if (burger && mobileMenu) {
    burger.setAttribute('aria-controls', 'mobileMenu');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');

    burger.addEventListener('click', () => {
      setMobileMenuState(!burger.classList.contains('active'));
    });
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMobile();
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });

  // --- Mobile dropdown toggle ---
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    const sub = btn.nextElementSibling;
    if (!(sub instanceof HTMLElement)) return;

    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'true');

    const setOpen = open => {
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      sub.setAttribute('aria-hidden', String(!open));
      animateCollapsibleState(sub, open, 'open');
    };

    const hasActiveLink = !!sub.querySelector('.active');
    btn.setAttribute('aria-expanded', 'false');
    sub.setAttribute('aria-hidden', 'true');
    syncCollapsibleState(sub, hasActiveLink, 'open');
    btn.classList.toggle('open', hasActiveLink);
    btn.setAttribute('aria-expanded', String(hasActiveLink));
    sub.setAttribute('aria-hidden', String(!hasActiveLink));

    btn.addEventListener('click', () => {
      setOpen(!btn.classList.contains('open'));
    });
  });

  // --- Desktop dropdown (touch support) ---
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.addEventListener('click', e => {
      if (window.innerWidth <= 1024) return;
      const link = item.querySelector('.nav-link');
      if (e.target === link || link?.contains(e.target)) {
        e.preventDefault();
        item.classList.toggle('dropdown-open');
      }
    });
  });

  // --- Accordions ---
  const setAccordionState = (trigger, content, open, animate = true) => {
    trigger.classList.toggle('active', open);
    trigger.setAttribute('aria-expanded', String(open));
    content.setAttribute('aria-hidden', String(!open));

    if (animate) {
      animateCollapsibleState(content, open, 'active');
    } else {
      syncCollapsibleState(content, open, 'active');
    }
  };

  document.querySelectorAll('[data-accordion-trigger], .accordion-trigger').forEach(trigger => {
    // Skip if already bound (prevents double-binding when element matches both selectors)
    if (trigger._accordionBound) return;
    trigger._accordionBound = true;

    const accordion = trigger.closest('[data-accordion]') || trigger.parentElement;
    const content = accordion?.querySelector('[data-accordion-content]') || accordion?.querySelector('.accordion-content');
    if (!content) return;

    setAccordionState(trigger, content, trigger.classList.contains('active'), false);

    trigger.addEventListener('click', () => {
      const isActive = trigger.classList.contains('active');

      // Close siblings in same cases-list
      const parent = trigger.closest('.cases-list');
      if (parent) {
        parent.querySelectorAll('[data-accordion-trigger], .accordion-trigger').forEach(t => {
          if (t === trigger) return;
          const acc = t.closest('[data-accordion]') || t.parentElement;
          const c = acc?.querySelector('[data-accordion-content]') || acc?.querySelector('.accordion-content');
          if (!c) return;
          setAccordionState(t, c, false);
        });
      }

      setAccordionState(trigger, content, !isActive);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobile();
    document.querySelectorAll('.mobile-sub-list.open').forEach(sub => {
      sub.style.maxHeight = `${sub.scrollHeight}px`;
    });
    document.querySelectorAll('.accordion-content.active').forEach(content => {
      content.style.maxHeight = `${content.scrollHeight}px`;
    });
  });

  // --- Blog filters ---
  const filters = document.querySelectorAll('[data-filter]');
  const blogCards = document.querySelectorAll('.blog-card[data-category]');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      const cat = f.dataset.filter;
      filters.forEach(b => b.classList.remove('active'));
      f.classList.add('active');
      blogCards.forEach(c => {
        c.classList.toggle('hidden', cat !== 'all' && c.dataset.category !== cat);
      });
    });
  });

  // --- Form submit ---
  const toast = document.getElementById('toast');
  const showToast = (msg) => {
    if (!toast) return;
    const el = toast.querySelector('.toast-message');
    if (msg && el) el.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 4000);
  };

  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Отправка...';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = orig;
        btn.disabled = false;

        // Lead-magnet: show download button
        if (form.hasAttribute('data-lead-magnet')) {
          const dl = form.querySelector('.lead-download');
          if (dl) dl.classList.remove('hidden');
          showToast('Заявка отправлена! Скачайте памятку ниже.');
        } else if (form.classList.contains('subscribe-form')) {
          showToast('Вы подписаны! Спасибо.');
        } else {
          showToast('Заявка отправлена! Мы свяжемся с вами.');
        }
      }, 1000);
    });
  });

  // --- Reveal on scroll ---
  const revealSelector =
    '.svc-card,.why-card,.case-home-card,.blog-card,.merge-card,.stat-item,' +
    '.case-card,.contact-item,.expertise-card,.approach-step';

  const reveal = () => {
    document.querySelectorAll(revealSelector).forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll(revealSelector).forEach(el => {
      if (!el.classList.contains('visible')) obs.observe(el);
    });
  };
  requestAnimationFrame(reveal);

  // --- Counter animation ---
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const start = performance.now();
      const dur = 1800;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => counterObs.observe(c));

  // --- Phone mask ---
  const getPhoneDigits = value => {
    let digits = value.replace(/\D/g, '');
    if (!digits) return '';
    if (digits[0] === '8') digits = `7${digits.slice(1)}`;
    if (digits[0] === '7') digits = digits.slice(1);
    return digits.slice(0, 10);
  };

  const formatPhoneValue = digits => {
    if (!digits) return '';
    const area = digits.slice(0, 3);
    const middle = digits.slice(3, 6);
    const first = digits.slice(6, 8);
    const second = digits.slice(8, 10);

    let value = '+7';
    if (area) value += ` (${area}`;
    if (area.length === 3) value += ')';
    if (middle) value += ` ${middle}`;
    if (first) value += `-${first}`;
    if (second) value += `-${second}`;
    return value;
  };

  const getEditablePhonePositions = value => {
    const positions = [];
    Array.from(value).forEach((char, index) => {
      if (!/\d/.test(char)) return;
      if (value.startsWith('+7') && index === 1) return;
      positions.push(index);
    });
    return positions;
  };

  const placeCaretAtEnd = input => {
    requestAnimationFrame(() => {
      const end = input.value.length;
      input.setSelectionRange(end, end);
    });
  };

  document.querySelectorAll('input[type="tel"]').forEach(input => {
    const syncPhoneValue = () => {
      const digits = getPhoneDigits(input.value);
      input.value = formatPhoneValue(digits);
    };

    input.addEventListener('keydown', e => {
      if (e.key !== 'Backspace' && e.key !== 'Delete') return;

      const digits = getPhoneDigits(input.value);
      if (!digits) {
        input.value = '';
        return;
      }

      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      if (start !== end) return;

      const positions = getEditablePhonePositions(input.value);
      const targetPos = e.key === 'Backspace'
        ? [...positions].reverse().find(pos => pos < start)
        : positions.find(pos => pos >= start);

      if (targetPos == null) {
        e.preventDefault();
        input.value = '';
        return;
      }

      const removeIndex = positions.indexOf(targetPos);
      const nextDigits = `${digits.slice(0, removeIndex)}${digits.slice(removeIndex + 1)}`;
      e.preventDefault();
      input.value = formatPhoneValue(nextDigits);
      placeCaretAtEnd(input);
    });

    input.addEventListener('input', syncPhoneValue);
    input.addEventListener('paste', () => requestAnimationFrame(() => {
      syncPhoneValue();
      placeCaretAtEnd(input);
    }));
    input.addEventListener('blur', () => {
      if (!getPhoneDigits(input.value)) input.value = '';
    });
  });

  // --- Active nav highlight ---
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
