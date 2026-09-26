/* ==============================================================
   CURRENCY
   --------------------------------------------------------------
   Shows ₹ to visitors in India and $ to everyone else, with a
   manual switch so a wrong guess costs one click.

   Detection is timezone-based rather than IP-based on purpose:
   it needs no API key, no network request and no rate limit, so
   there is never a flash of the wrong price while a lookup
   resolves. Only India uses the Asia/Kolkata zone, which makes it
   a reliable signal. A VPN can fool it — hence the switch.

   The visitor's choice is remembered and wins over detection
   from then on.
   ============================================================== */

const Money = (() => {
    const STORE = 'kws.currency.v1';
    const SEEN = 'kws.currency.notice.v1';
    const VALID = ['INR', 'USD'];

    let code = 'INR';
    const listeners = [];

    /** Timezone first, browser language as a backstop. */
    function detect() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            // Asia/Calcutta is the older alias some browsers still report.
            if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
            if (tz) return 'USD';
        } catch (e) {
            /* Intl unavailable — fall through to language. */
        }
        const langs = navigator.languages || [navigator.language || ''];
        return langs.some(l => /-IN$/i.test(l)) ? 'INR' : 'USD';
    }

    function load() {
        try {
            const saved = localStorage.getItem(STORE);
            if (VALID.includes(saved)) return { code: saved, chosen: true };
        } catch (e) {
            /* Storage blocked — detection still works. */
        }
        return { code: detect(), chosen: false };
    }

    function save() {
        try {
            localStorage.setItem(STORE, code);
        } catch (e) {
            /* Non-fatal: the switch still works for this visit. */
        }
    }

    /** Formats a raw number in the active currency. */
    function num(value) {
        const n = Number(value || 0);
        return code === 'INR'
            ? '₹' + n.toLocaleString('en-IN')
            : '$' + n.toLocaleString('en-US');
    }

    /**
     * Formats a price object: { inr, usd }, optionally with
     * `plus: true` for "from" pricing or `custom` for a fixed label.
     */
    function format(price) {
        if (price == null) return '';
        if (typeof price === 'number') return num(price);
        if (price.custom) return price.custom;
        const value = code === 'INR' ? price.inr : price.usd;
        if (value == null) return '';
        return num(value) + (price.plus ? '+' : '') + (price.per || '');
    }

    /** The raw number in the active currency — for arithmetic. */
    function amount(price) {
        if (price == null) return 0;
        if (typeof price === 'number') return price;
        return Number((code === 'INR' ? price.inr : price.usd) || 0);
    }

    function set(next, { silent = false } = {}) {
        if (!VALID.includes(next) || next === code) return;
        code = next;
        save();
        if (!silent) listeners.forEach(fn => fn(code));
    }

    return {
        get code() { return code; },
        get symbol() { return code === 'INR' ? '₹' : '$'; },
        get isIndia() { return code === 'INR'; },
        format,
        amount,
        num,
        set,
        onChange(fn) { listeners.push(fn); },
        init() {
            const { code: initial, chosen } = load();
            code = initial;
            return { chosen };
        },
        /** True the first time we auto-detect a non-default currency. */
        shouldAnnounce() {
            try {
                if (localStorage.getItem(SEEN)) return false;
                localStorage.setItem(SEEN, '1');
                return true;
            } catch (e) {
                return false;
            }
        }
    };
})();

/** Shorthand used throughout the render layer. */
function money(price) {
    return Money.format(price);
}

/* --------------------------------------------------------------
   TOGGLE UI
   -------------------------------------------------------------- */
function initCurrencySwitch(onChange) {
    const { chosen } = Money.init();
    const box = $('#currencySwitch');

    function paint() {
        $$('button', box).forEach(b => {
            const on = b.dataset.currency === Money.code;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
        });
        document.documentElement.setAttribute('data-currency', Money.code);
    }

    if (box) {
        paint();
        bindOnce(box, 'click', e => {
            const btn = e.target.closest('button[data-currency]');
            if (!btn) return;
            Money.set(btn.dataset.currency);
            paint();
        });
    }

    Money.onChange(next => {
        onChange();
        showToast(next === 'INR'
            ? 'Prices now shown in Indian rupees (₹).'
            : 'Prices now shown in US dollars ($).');
    });

    // Tell first-time overseas visitors why they are seeing dollars.
    if (!chosen && !Money.isIndia && Money.shouldAnnounce()) {
        setTimeout(() => showToast('Prices shown in USD — switch to ₹ INR in the menu bar.'), 1600);
    }
}
