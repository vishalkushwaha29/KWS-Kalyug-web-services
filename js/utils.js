/* ==============================================================
   UTILITIES — DOM helpers, toast, modal manager
   ============================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escapes text before it goes into innerHTML. */
function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** 24999 -> "₹24,999" using the Indian digit grouping. */
function inr(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/**
 * Attaches a listener only the first time it is asked for.
 * Render functions can then be called repeatedly — on a currency switch,
 * say — without stacking duplicate handlers on their container.
 */
function bindOnce(el, type, handler) {
    if (!el) return;
    const key = '_bound_' + type;
    if (el[key]) return;
    el[key] = true;
    el.addEventListener(type, handler);
}

/** Runs fn at most once per animation frame. */
function rafThrottle(fn) {
    let queued = false;
    return function (...args) {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn.apply(this, args);
        });
    };
}

/* --------------------------------------------------------------
   TOAST
   -------------------------------------------------------------- */
function showToast(msg, type) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.toggle('error', type === 'error');
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3600);
}

/* --------------------------------------------------------------
   MODALS
   Handles focus trapping, Escape, backdrop clicks and restoring
   focus to whatever opened the modal.
   -------------------------------------------------------------- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lastFocused = null;

function openModal(id) {
    const modal = typeof id === 'string' ? document.getElementById(id) : id;
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    const first = $(FOCUSABLE, modal);
    if (first) first.focus();
}

function closeModal(id) {
    const modal = typeof id === 'string' ? document.getElementById(id) : id;
    if (!modal) return;
    modal.classList.remove('open');
    // Only release the scroll lock once every modal is closed.
    if (!$('.modal.open')) document.body.classList.remove('no-scroll');
    // Stop any iframe inside from continuing to run in the background.
    $$('iframe', modal).forEach(f => {
        if (f.dataset.keepAlive !== 'true') f.removeAttribute('src');
    });
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
}

function closeAllModals() {
    $$('.modal.open').forEach(closeModal);
}

function initModalBehaviour() {
    // Backdrop click and any [data-close] control.
    $$('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.closest('[data-close]')) closeModal(modal);
        });
    });

    document.addEventListener('keydown', e => {
        const open = $('.modal.open');
        if (!open) return;

        if (e.key === 'Escape') {
            closeModal(open);
            return;
        }

        // Keep Tab inside the dialog.
        if (e.key === 'Tab') {
            const items = $$(FOCUSABLE, open).filter(el => el.offsetParent !== null);
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

/**
 * Smoothly scrolls to a section, accounting for the sticky navbar.
 * Native scroll-padding handles most cases; this covers programmatic jumps.
 */
function scrollToSection(selector) {
    const target = $(selector);
    if (!target) return;
    const offset = ($('#navbar')?.offsetHeight || 0) + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}
