/* ==============================================================
   FORMS — validation and serverless lead delivery
   --------------------------------------------------------------
   No backend. Submitting composes a readable message and hands it
   to WhatsApp (wa.me) or the visitor's mail client (mailto:), both
   pre-addressed to you. Works on any static host, costs nothing.
   ============================================================== */

/** Reads a form into an ordered [label, value] list, skipping blanks. */
function collectFields(form) {
    return $$('[data-label]', form)
        .map(el => [el.dataset.label, (el.value || '').trim()])
        .filter(([, value]) => value !== '');
}

/**
 * Validates required fields and shows inline messages.
 * Returns true when the form is good to send.
 */
function validateForm(form) {
    let firstBad = null;

    $$('.field', form).forEach(field => {
        const input = $('input, select, textarea', field);
        if (!input) return;

        const value = (input.value || '').trim();
        let bad = input.hasAttribute('required') && value === '';

        if (!bad && value !== '') {
            if (input.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
            // Accept +, spaces, dashes and brackets; require at least 8 digits.
            if (input.type === 'tel') bad = (value.replace(/\D/g, '').length < 8);
        }

        field.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = input;
    });

    if (firstBad) {
        firstBad.focus();
        showToast('Please check the highlighted fields.', 'error');
        return false;
    }
    return true;
}

/** Clears validation styling as soon as the visitor starts fixing a field. */
function initLiveValidation(form) {
    form.addEventListener('input', e => {
        const field = e.target.closest('.field');
        if (field) field.classList.remove('invalid');
    });
    form.addEventListener('change', e => {
        const field = e.target.closest('.field');
        if (field) field.classList.remove('invalid');
    });
}

/** Builds the plain-text body sent over either channel. */
function buildMessage(heading, fields, extra) {
    const lines = [heading, ''];
    fields.forEach(([label, value]) => {
        // Multi-line answers read better on their own line.
        lines.push(value.includes('\n') ? `${label}:\n${value}` : `${label}: ${value}`);
    });
    if (extra) {
        lines.push('');
        lines.push(extra);
    }
    lines.push('');
    // Tells you which price list this person was actually looking at.
    lines.push(`Prices viewed in: ${Money.code}`);
    lines.push(`— Sent from ${CONFIG.business.url}`);
    return lines.join('\n');
}

/** Opens WhatsApp or the mail client with everything filled in. */
function deliver(channel, subject, body) {
    const url = channel === 'whatsapp'
        ? CONFIG.waLink(body)
        : CONFIG.mailLink(subject, body);

    if (channel === 'whatsapp') {
        window.open(url, '_blank', 'noopener');
    } else {
        // mailto: must stay in the same tab or popup blockers eat it.
        window.location.href = url;
    }
}

/**
 * Wires one form up to both delivery channels.
 * `waButton` is optional; when present it sends the same data to WhatsApp.
 */
function wireForm({ form, heading, subject, waButton, successMessage, extra }) {
    const el = $(form);
    if (!el) return;

    initLiveValidation(el);

    const send = channel => {
        if (!validateForm(el)) return;
        const fields = collectFields(el);
        const suffix = typeof extra === 'function' ? extra(el) : extra;
        const body = buildMessage(heading, fields, suffix);
        deliver(channel, `${CONFIG.lead.subjectPrefix}: ${subject}`, body);
        showToast(successMessage);
        el.reset();
        $$('.field', el).forEach(f => f.classList.remove('invalid'));
        closeAllModals();
    };

    el.addEventListener('submit', e => {
        e.preventDefault();
        send('email');
    });

    if (waButton) {
        const btn = $(waButton);
        if (btn) {
            btn.addEventListener('click', e => {
                e.preventDefault();
                send('whatsapp');
            });
        }
    }
}

/* --------------------------------------------------------------
   PREFILL — used by service cards, AI cards, plans and the builder
   -------------------------------------------------------------- */
function prefillContact({ service, message, budget } = {}) {
    const form = $('#contactForm');
    if (!form) return;

    if (service) {
        const select = $('#contactService');
        // Only set it if the option actually exists.
        if (select && $$('option', select).some(o => o.value === service || o.textContent === service)) {
            select.value = service;
        }
    }
    if (budget) {
        const select = $('#contactBudget');
        if (select && $$('option', select).some(o => o.textContent === budget)) select.value = budget;
    }
    if (message) {
        const box = $('#contactMessage');
        // Append rather than overwrite, so multiple picks accumulate.
        box.value = box.value.trim() ? box.value.trim() + '\n\n' + message : message;
    }

    $$('.field', form).forEach(f => f.classList.remove('invalid'));
    scrollToSection('#contact');
    setTimeout(() => $('#contactName')?.focus({ preventScroll: true }), 500);
}

/* --------------------------------------------------------------
   INIT
   -------------------------------------------------------------- */
function initForms() {
    wireForm({
        form: '#contactForm',
        heading: 'New enquiry from the website',
        subject: 'Project enquiry',
        waButton: '#whatsappBtn',
        successMessage: 'Thank you! Finish sending in the window that just opened.'
    });

    wireForm({
        form: '#customizeForm',
        heading: 'Website customisation request',
        subject: 'Customisation request',
        waButton: '#customizeWa',
        successMessage: 'Customisation request ready to send.',
        extra: form => {
            const demo = getDemo(form.dataset.demoId);
            return demo ? `Based on demo: ${demo.name} (${demo.price}) — ${CONFIG.business.url}/${demo.file}` : '';
        }
    });

    wireForm({
        form: '#careersForm',
        heading: 'New application',
        subject: 'Job / freelance application',
        waButton: '#careersWa',
        successMessage: 'Application ready to send.'
    });

    // Static WhatsApp entry points.
    const generic = CONFIG.waLink(`Hi ${CONFIG.business.name}, I'd like to discuss a project.`);
    ['#footerWhatsapp', '#waFloat'].forEach(sel => {
        const el = $(sel);
        if (el) el.href = generic;
    });

    // Footer social icons come from CONFIG.
    $$('[data-social]').forEach(a => {
        const url = CONFIG.social[a.dataset.social];
        a.href = url || '#';
        if (!url || url === '#') a.setAttribute('aria-disabled', 'true');
    });

    // Community CTAs.
    $('#openCareersBtn').addEventListener('click', e => {
        e.preventDefault();
        openCareersModal();
    });
    $('#becomeFreelancerBtn').addEventListener('click', e => {
        e.preventDefault();
        openCareersModal('Intern / Freelancer');
    });
}
