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

  const getFieldContainer = field => field.closest('.form-group, .form-check');
  const normalizeFieldValue = field => {
    const nextValue = field.value.trim().replace(/\s+/g, ' ');
    field.value = nextValue;
    return nextValue;
  };

  const getErrorNode = field => {
    const container = getFieldContainer(field);
    if (container) {
      let error = container.querySelector('.form-error');
      if (!error) {
        error = document.createElement('div');
        error.className = 'form-error';
        error.setAttribute('aria-live', 'polite');
        container.append(error);
      }
      return error;
    }

    let error = field.nextElementSibling;
    if (!error || !error.classList.contains('form-error')) {
      error = document.createElement('div');
      error.className = 'form-error';
      error.setAttribute('aria-live', 'polite');
      field.insertAdjacentElement('afterend', error);
    }
    return error;
  };

  const setFieldError = (field, message) => {
    const container = getFieldContainer(field);
    if (container) container.classList.add('is-invalid');
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    getErrorNode(field).textContent = message;
  };

  const clearFieldError = field => {
    const container = getFieldContainer(field);
    if (container) container.classList.remove('is-invalid');
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');

    const error = container
      ? container.querySelector('.form-error')
      : (field.nextElementSibling?.classList.contains('form-error') ? field.nextElementSibling : null);
    if (error) error.textContent = '';
  };

  const clearFormErrors = form => {
    form.querySelectorAll('input, textarea, select').forEach(clearFieldError);
  };

  const getFormStatusNode = form => {
    let status = form.querySelector('.form-status');
    if (status) return status;

    status = document.createElement('div');
    status.className = 'form-status';
    status.setAttribute('aria-live', 'polite');

    const leadDownload = form.querySelector('.lead-download');
    const submitButton = form.querySelector('button[type="submit"]');

    if (leadDownload) {
      form.insertBefore(status, leadDownload);
    } else if (submitButton) {
      submitButton.insertAdjacentElement('afterend', status);
    } else {
      form.append(status);
    }

    return status;
  };

  const setFormStatus = (form, message, type) => {
    const status = getFormStatusNode(form);
    status.className = `form-status is-${type}`;
    status.textContent = message;
  };

  const clearFormStatus = form => {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.className = 'form-status';
    status.textContent = '';
  };

  const getInvalidFormMessage = form => {
    if (form.classList.contains('subscribe-form')) {
      return 'Проверьте email в поле выше, чтобы оформить подписку.';
    }
    return 'Проверьте отмеченные поля. После исправления заявка отправится из этой формы.';
  };

  const getPendingFormMessage = form => {
    if (form.classList.contains('subscribe-form')) {
      return 'Оформляем подписку на полезные материалы по 1С...';
    }
    return 'Отправляем заявку. Сообщение останется прямо под кнопкой.';
  };

  const getSuccessFormMessage = form => {
    if (form.hasAttribute('data-lead-magnet')) {
      return 'Заявка принята. Материал для скачивания уже доступен ниже.';
    }
    if (form.classList.contains('subscribe-form')) {
      return 'Подписка оформлена. Материалы по 1С будем отправлять на указанный email.';
    }
    return 'Заявка принята. Мы свяжемся с вами после изучения задачи.';
  };

  const validateForm = form => {
    clearFormErrors(form);

    let firstInvalidField = null;
    const invalidate = (field, message) => {
      if (!field) return;
      setFieldError(field, message);
      if (!firstInvalidField) firstInvalidField = field;
    };

    if (form.classList.contains('subscribe-form')) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const subscribeEmail = form.querySelector('input[type="email"]');
      const emailValue = subscribeEmail ? normalizeFieldValue(subscribeEmail).toLowerCase() : '';

      if (!emailValue) {
        invalidate(subscribeEmail, 'Укажите рабочий email, чтобы получить материалы по 1С.');
      } else if (!emailPattern.test(emailValue)) {
        invalidate(subscribeEmail, 'Проверьте email: адрес нужен в формате name@example.com.');
      }

      return { valid: !firstInvalidField, firstInvalidField };
    }

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const contactMethodSelect = form.querySelector('select[name="contact_method"]');
    const serviceSelect = form.querySelector('select[name="service"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (nameInput) {
      const nameValue = normalizeFieldValue(nameInput);
      if (!nameValue) {
        invalidate(nameInput, 'Представьтесь, чтобы мы понимали, как к вам обращаться.');
      } else if (nameValue.length < 2) {
        invalidate(nameInput, 'Имя должно быть не короче двух символов.');
      }
    }

    const phoneDigits = phoneInput ? getPhoneDigits(phoneInput.value) : '';
    if (phoneInput) {
      if (phoneDigits) phoneInput.value = formatPhoneValue(phoneDigits);
      if (phoneInput.hasAttribute('required') && phoneDigits.length !== 10) {
        invalidate(phoneInput, 'Укажите телефон полностью, чтобы мы могли связаться с вами по заявке.');
      } else if (phoneDigits && phoneDigits.length !== 10) {
        invalidate(phoneInput, 'Проверьте телефон: нужен полный номер в формате +7 (___) ___-__-__.');
      }
    }

    if (contactMethodSelect && !contactMethodSelect.value) {
      invalidate(contactMethodSelect, 'Выберите удобный способ связи, чтобы мы ответили в нужном формате.');
    }

    if (serviceSelect && !serviceSelect.value) {
      invalidate(serviceSelect, 'Выберите направление 1С, чтобы мы подключили нужного специалиста.');
    }

    if (messageInput) {
      const messageValue = normalizeFieldValue(messageInput);
      if (!messageValue) {
        invalidate(messageInput, 'Кратко опишите задачу: конфигурацию, проблему или нужный результат.');
      } else if (messageValue.length < 12) {
        invalidate(messageInput, 'Добавьте чуть больше деталей по задаче, хотя бы 12 символов.');
      }
    }

    return { valid: !firstInvalidField, firstInvalidField };
  };

  document.querySelectorAll('[data-form]').forEach(form => {
    form.setAttribute('novalidate', 'novalidate');

    form.querySelectorAll('input, textarea, select').forEach(field => {
      const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        clearFieldError(field);
        clearFormStatus(form);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const { valid, firstInvalidField } = validateForm(form);
      if (!valid) {
        setFormStatus(form, getInvalidFormMessage(form), 'error');
        firstInvalidField?.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn?.textContent ?? '';
      setFormStatus(form, getPendingFormMessage(form), 'pending');
      if (btn) {
        btn.textContent = 'Отправка...';
        btn.disabled = true;
      }

      setTimeout(() => {
        form.reset();
        clearFormErrors(form);
        if (btn) {
          btn.textContent = orig;
          btn.disabled = false;
        }

        // Lead-magnet: show download button
        if (form.hasAttribute('data-lead-magnet')) {
          const dl = form.querySelector('.lead-download');
          if (dl) dl.classList.remove('hidden');
        }

        setFormStatus(form, getSuccessFormMessage(form), 'success');
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
