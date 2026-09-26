/* ==============================================================
   BUILDER — the "Build Your Website" price calculator
   --------------------------------------------------------------
   Selections survive a page reload via localStorage, so a visitor
   who wanders off and comes back still has their configuration.
   ============================================================== */

const BUILDER_STORE = 'kws.builder.v1';

const builderState = {
    type: null,          // type name
    features: [],        // feature names
    ai: []               // AI add-on names
};

/** The raw amount for an option, in whichever currency is active. */
function findPrice(list, name) {
    const hit = list.find(x => x.name === name);
    return hit ? Money.amount(hit.price) : 0;
}

/** The formatted amount for an option. */
function findPriceLabel(list, name) {
    const hit = list.find(x => x.name === name);
    return hit ? money(hit.price) : '';
}

/* --------------------------------------------------------------
   RENDER
   -------------------------------------------------------------- */
function renderBuilder() {
    loadBuilderState();

    chipGroup('#builderType', builderTypes, 'type');
    chipGroup('#builderFeatures', builderFeatures, 'feature');
    chipGroup('#builderAI', builderAI, 'ai');

    bindOnce($('#builderReset'), 'click', resetBuilder);
    bindOnce($('#builderRequest'), 'click', requestBuilderPackage);

    syncChips();
    updateBuilderPrice();
}

function chipGroup(selector, items, kind) {
    const container = $(selector);
    container.innerHTML = items.map(item => {
        const amount = Money.amount(item.price);
        return `
        <button type="button" class="builder-chip" data-kind="${kind}" data-name="${esc(item.name)}"
                aria-pressed="false">
            ${esc(item.name)}${amount ? `<span class="chip-price">+${esc(money(item.price))}</span>` : ''}
        </button>`;
    }).join('');

    bindOnce(container, 'click', e => {
        const chip = e.target.closest('.builder-chip');
        if (!chip) return;
        toggleBuilderChip(chip.dataset.kind, chip.dataset.name);
    });
}

/** Redraws the chip labels after a currency switch, keeping selections. */
function refreshBuilderLabels() {
    chipGroup('#builderType', builderTypes, 'type');
    chipGroup('#builderFeatures', builderFeatures, 'feature');
    chipGroup('#builderAI', builderAI, 'ai');
    syncChips();
    updateBuilderPrice();
}

function toggleBuilderChip(kind, name) {
    if (kind === 'type') {
        // Single choice — clicking the active type clears it.
        builderState.type = builderState.type === name ? null : name;
    } else {
        const key = kind === 'ai' ? 'ai' : 'features';
        const list = builderState[key];
        const at = list.indexOf(name);
        if (at === -1) list.push(name);
        else list.splice(at, 1);
    }
    syncChips();
    updateBuilderPrice();
    saveBuilderState();
}

/** Called from the AI cards. Returns true when the add-on was newly selected. */
function selectBuilderAI(name) {
    if (!builderAI.some(a => a.name === name)) return false;
    if (builderState.ai.includes(name)) return false;
    builderState.ai.push(name);
    syncChips();
    updateBuilderPrice();
    saveBuilderState();
    return true;
}

/** Pushes state onto the chips (also used after loading from storage). */
function syncChips() {
    $$('.builder-chip').forEach(chip => {
        const { kind, name } = chip.dataset;
        const on = kind === 'type'
            ? builderState.type === name
            : builderState[kind === 'ai' ? 'ai' : 'features'].includes(name);
        chip.classList.toggle('selected', on);
        chip.setAttribute('aria-pressed', String(on));
    });
}

/* --------------------------------------------------------------
   PRICING
   -------------------------------------------------------------- */
function builderTotal() {
    let total = 0;
    if (builderState.type) total += findPrice(builderTypes, builderState.type);
    builderState.features.forEach(f => { total += findPrice(builderFeatures, f); });
    builderState.ai.forEach(a => { total += findPrice(builderAI, a); });
    return total;
}

function builderWeeks() {
    if (!builderState.type) return null;
    const base = builderTypes.find(t => t.name === builderState.type)?.weeks || 2;
    const extra = Math.ceil(builderState.features.length / 3) + builderState.ai.length;
    const min = base;
    const max = base + extra;
    return min === max ? `${min} week${min > 1 ? 's' : ''}` : `${min}–${max} weeks`;
}

function updateBuilderPrice() {
    const total = builderTotal();
    $('#builderPrice').textContent = Money.num(total);

    // Line-item breakdown.
    const rows = [];
    if (builderState.type) {
        rows.push([builderState.type, findPriceLabel(builderTypes, builderState.type)]);
    }
    builderState.features.forEach(f => {
        const p = findPrice(builderFeatures, f);
        rows.push([f, p ? findPriceLabel(builderFeatures, f) : 'Included']);
    });
    builderState.ai.forEach(a => rows.push([a, findPriceLabel(builderAI, a)]));

    const breakdown = $('#builderBreakdown');
    if (!rows.length) {
        breakdown.classList.add('empty');
        breakdown.innerHTML = '<li>Pick a website type to start.</li>';
    } else {
        breakdown.classList.remove('empty');
        breakdown.innerHTML = rows
            .map(([label, value]) => `<li><span>${esc(label)}</span><span>${esc(value)}</span></li>`).join('');
    }

    const weeks = builderWeeks();
    $('#builderTimeline').innerHTML = weeks
        ? `Estimated delivery: <strong>${esc(weeks)}</strong>`
        : '';

    $('#builderRequest').classList.toggle('is-disabled', total === 0);
}

/* --------------------------------------------------------------
   ACTIONS
   -------------------------------------------------------------- */
function resetBuilder() {
    builderState.type = null;
    builderState.features = [];
    builderState.ai = [];
    syncChips();
    updateBuilderPrice();
    saveBuilderState();
    showToast('Estimate cleared.');
}

/** Sends the whole configuration to the contact form, ready to submit. */
function requestBuilderPackage() {
    const total = builderTotal();
    if (!total) {
        showToast('Choose a website type first.', 'error');
        scrollToSection('#builder');
        return;
    }

    const lines = [
        `Website type: ${builderState.type}`,
        builderState.features.length ? `Features: ${builderState.features.join(', ')}` : null,
        builderState.ai.length ? `AI add-ons: ${builderState.ai.join(', ')}` : null,
        `Estimated cost: ${Money.num(total)} (${Money.code})`,
        builderWeeks() ? `Estimated delivery: ${builderWeeks()}` : null
    ].filter(Boolean);

    prefillContact({
        service: serviceForBuilderType(builderState.type),
        message: 'I built this package with your calculator:\n' + lines.join('\n'),
        budget: budgetBandFor(total)
    });
    showToast('Package added below — just add your details.');
}

function serviceForBuilderType(type) {
    const map = {
        'Landing Page': 'Website',
        'Business Website': 'Website',
        'Portfolio': 'Website',
        'E-Commerce': 'E-Commerce',
        'Booking Website': 'Custom Project',
        'Custom Web App': 'Custom Project'
    };
    return map[type] || 'Website';
}

/**
 * Maps an estimate onto the contact form's budget <option> label,
 * using the band table for whichever currency is active.
 */
function budgetBandFor(total) {
    const key = Money.isIndia ? 'inr' : 'usd';
    // The first band reads "Below X", so X itself belongs to the next one up.
    const band = budgetBands.find((b, i) =>
        i === 0 ? total < b[key].max : total <= b[key].max
    ) || budgetBands[budgetBands.length - 1];
    return band[key].label;
}

/* --------------------------------------------------------------
   PERSISTENCE
   -------------------------------------------------------------- */
function saveBuilderState() {
    try {
        localStorage.setItem(BUILDER_STORE, JSON.stringify(builderState));
    } catch (e) {
        /* Private mode or storage disabled — the calculator still works. */
    }
}

function loadBuilderState() {
    try {
        const raw = localStorage.getItem(BUILDER_STORE);
        if (!raw) return;
        const saved = JSON.parse(raw);
        // Drop anything that no longer exists in the data file.
        if (builderTypes.some(t => t.name === saved.type)) builderState.type = saved.type;
        builderState.features = (saved.features || []).filter(f => builderFeatures.some(x => x.name === f));
        builderState.ai = (saved.ai || []).filter(a => builderAI.some(x => x.name === a));
    } catch (e) {
        /* Corrupt payload — start fresh. */
    }
}
