/* ==============================================================
   UI — navbar, scroll spy, reveal, counters, back-to-top
   ============================================================== */

/* --------------------------------------------------------------
   NAVBAR
   -------------------------------------------------------------- */
function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const links = $('#navbarLinks');

    hamburger.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });

    const closeMenu = () => {
        links.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    links.addEventListener('click', e => {
        if (e.target.closest('a')) closeMenu();
    });

    // Escape and outside clicks close the mobile menu.
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && links.classList.contains('open')) {
            closeMenu();
            hamburger.focus();
        }
    });
    document.addEventListener('click', e => {
        if (!links.classList.contains('open')) return;
        if (!e.target.closest('#navbarLinks') && !e.target.closest('#hamburger')) closeMenu();
    });

    // Scroll spy + condensed navbar background.
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    const onScroll = rafThrottle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);

        const line = window.scrollY + navbar.offsetHeight + 80;
        let currentId = sections.length ? sections[0].id : '';

        for (const section of sections) {
            if (section.offsetTop <= line) currentId = section.id;
        }
        // At the very bottom, highlight the last section regardless of maths.
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
            currentId = sections[sections.length - 1].id;
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------
   BACK TO TOP
   -------------------------------------------------------------- */
function initBackToTop() {
    const btn = $('#backToTop');
    const onScroll = rafThrottle(() => btn.classList.toggle('visible', window.scrollY > 400));
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
}

/* --------------------------------------------------------------
   ANIMATED COUNTERS
   Runs when the stats row scrolls into view, not on page load, so
   visitors actually see the count happen.
   -------------------------------------------------------------- */
function initCounters() {
    const counters = $$('.stat-number');
    if (!counters.length) return;

    const run = counter => {
        const target = Number(counter.dataset.count);
        const duration = 1400;
        const start = performance.now();

        const tick = now => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease-out so it decelerates into the final number.
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else counter.textContent = target;
        };
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
        counters.forEach(run);
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            run(entry.target);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => io.observe(c));
}

/* --------------------------------------------------------------
   SCROLL REVEAL
   Modal contents are deliberately excluded — they live off-screen
   until opened, and hiding them here would leave them invisible.
   -------------------------------------------------------------- */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const selector = '.service-card, .demo-card, .ai-card, .pricing-card, .portfolio-item, .why-item, .process-step, .contact-card, .builder-summary, .faq-item';
    const targets = $$(selector).filter(el => !el.closest('.modal'));

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        // Small stagger within a row, capped so nothing waits long.
        el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
        io.observe(el);
    });
}

/* --------------------------------------------------------------
   CONFIG-DRIVEN TEXT
   -------------------------------------------------------------- */
function applyConfigToPage() {
    $$('[data-config]').forEach(el => {
        const path = el.dataset.config.split('.');
        let value = CONFIG;
        for (const key of path) value = value?.[key];
        if (value != null) el.textContent = value;
    });
    const year = $('#footerYear');
    if (year) year.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------
   SMOOTH ANCHORS
   Native scroll-padding covers most of it; this keeps focus correct
   for keyboard users after an in-page jump.
   -------------------------------------------------------------- */
function initAnchors() {
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();
        scrollToSection('#' + target.id);
        history.replaceState(null, '', href);
        target.setAttribute('tabindex', '-1');
        setTimeout(() => target.focus({ preventScroll: true }), 500);
    });
}
