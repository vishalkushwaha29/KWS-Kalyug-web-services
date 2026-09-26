/* ==============================================================
   DEMO FRAME
   --------------------------------------------------------------
   Adds the Kalyug bar to a demo page and exposes two helpers every
   demo uses: kwsToast() and kwsMoney().

   Reads from <body data-demo-name="..." data-demo-price="..."
   data-demo-id="...">. Skipped entirely when the page is embedded
   as a thumbnail (?embed=1), so previews show only the design.
   ============================================================== */

(function () {
    'use strict';

    const params = new URLSearchParams(location.search);
    const embedded = params.get('embed') === '1';

    /* ---------- Toast ---------- */
    let toastEl = null;
    let toastTimer = null;

    window.kwsToast = function (message) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'kws-toast';
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = message;
        // Force a reflow so the transition replays on rapid repeat calls.
        void toastEl.offsetWidth;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
    };

    /* ---------- Currency ----------
       Demo content prices (menus, products, rents) stay in rupees —
       those belong to the fictional business, not to KWS. Only the
       Kalyug bar's own price follows the visitor's currency, read from
       the same key the main site writes. */
    window.kwsMoney = function (amount) {
        return '₹' + Number(amount || 0).toLocaleString('en-IN');
    };

    function visitorCurrency() {
        try {
            const saved = localStorage.getItem('kws.currency.v1');
            if (saved === 'INR' || saved === 'USD') return saved;
        } catch (e) {
            /* Storage blocked — fall through to detection. */
        }
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
            if (tz) return 'USD';
        } catch (e) {
            /* Intl unavailable. */
        }
        return 'INR';
    }

    function barPrice(body) {
        const code = visitorCurrency();
        const raw = code === 'INR' ? body.dataset.demoPriceInr : body.dataset.demoPriceUsd;
        if (!raw) return '';
        const n = Number(raw);
        return code === 'INR'
            ? '₹' + n.toLocaleString('en-IN')
            : '$' + n.toLocaleString('en-US');
    }

    /* ---------- Bar ---------- */
    function buildBar() {
        const body = document.body;
        const name = body.dataset.demoName || 'Website demo';
        const price = barPrice(body);
        const id = body.dataset.demoId || '';

        const bar = document.createElement('div');
        bar.className = 'kws-bar';
        bar.innerHTML = `
            <span class="kws-bar__brand">Kalyug <span>Web Services</span></span>
            <span class="kws-bar__label">Live demo — <strong>${name}</strong></span>
            ${price ? `<span class="kws-bar__price">${price}</span>` : ''}
            <span class="kws-bar__actions">
                <a class="kws-btn" href="../index.html#demos">&larr; All demos</a>
                <a class="kws-btn kws-btn--solid" href="../index.html${id ? '#demo=' + id : '#contact'}">Get this design</a>
            </span>
        `;
        body.insertBefore(bar, body.firstChild);
    }

    function init() {
        if (!embedded) buildBar();
        else document.documentElement.classList.add('kws-embedded');

        // Demo pages are self-contained: in-page links stay in-page, and
        // placeholder links say so rather than silently doing nothing.
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href="#"]');
            if (!link || link.closest('.kws-bar')) return;
            e.preventDefault();
            window.kwsToast('This is a design demo — the full build wires this up.');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
