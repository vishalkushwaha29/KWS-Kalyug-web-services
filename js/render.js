/* ==============================================================
   RENDER — turns the data arrays into DOM
   --------------------------------------------------------------
   Every grid uses event delegation on its container, so re-rendering
   (filtering) can never stack duplicate listeners.
   ============================================================== */

/* --------------------------------------------------------------
   SERVICES
   -------------------------------------------------------------- */
function renderServices() {
    const grid = $('#servicesGrid');
    grid.innerHTML = servicesData.map((s, i) => `
        <article class="service-card glass-card" data-service="${i}" tabindex="0" role="button"
                 aria-label="${esc(s.title)} — view details">
            <div class="icon"><i class="fas ${esc(s.icon)}" aria-hidden="true"></i></div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.desc)}</p>
            <span class="learn-more">Learn More <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
        </article>
    `).join('');

    const open = el => {
        const card = el.closest('[data-service]');
        if (card) openServiceModal(Number(card.dataset.service));
    };
    bindOnce(grid, 'click', e => open(e.target));
    bindOnce(grid, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open(e.target);
        }
    });
}

/** The cheapest thing we sell, in the active currency — used in copy. */
function entryPrice() {
    const cheapest = builderTypes.reduce((a, b) =>
        Money.amount(a.price) <= Money.amount(b.price) ? a : b);
    return money(cheapest.price);
}

/** Swaps {from} in body copy for the current entry price. */
function fillTokens(text) {
    return String(text).replace(/\{from\}/g, entryPrice());
}

function openServiceModal(index) {
    const s = servicesData[index];
    if (!s) return;
    $('#serviceModalTitle').innerHTML =
        `<i class="fas ${esc(s.icon)}" aria-hidden="true" style="color:var(--purple);margin-right:10px"></i>${esc(s.title)}`;
    $('#serviceModalDesc').textContent = s.desc;
    $('#serviceModalPoints').innerHTML = (s.points || [])
        .map(p => `<li><i class="fas fa-check" aria-hidden="true"></i><span>${esc(p)}</span></li>`).join('');
    $('#serviceModalPrice').textContent = s.from ? money(s.from) : 'On request';

    const quote = $('#serviceModalQuote');
    quote.onclick = () => {
        closeModal('serviceModal');
        prefillContact({ service: mapServiceToOption(s.title), message: `I'm interested in: ${s.title}.` });
    };
    const wa = $('#serviceModalWa');
    wa.href = CONFIG.waLink(`Hi ${CONFIG.business.name}, I'd like to know more about your "${s.title}" service.`);

    openModal('serviceModal');
}

/** Maps a service card title onto one of the contact form's <option> values. */
function mapServiceToOption(title) {
    const map = {
        'Website Development': 'Website',
        'E-Commerce Development': 'E-Commerce',
        'AI Chatbots': 'AI Chatbot',
        'AI Agents': 'AI Agent',
        'Automation': 'Automation',
        'Social Media Marketing': 'Social Media Marketing',
        'SEO': 'SEO',
        'Branding & Design': 'Branding',
        'Landing Pages': 'Website',
        'Custom Web Applications': 'Custom Project'
    };
    return map[title] || 'Other';
}

/* --------------------------------------------------------------
   WEBSITE DEMOS
   -------------------------------------------------------------- */
function renderDemoFilters() {
    const container = $('#demoFilters');
    container.innerHTML = demoCategories.map(cat => `
        <button type="button" class="${cat === 'All' ? 'active' : ''}"
                data-filter="${esc(cat)}" aria-pressed="${cat === 'All'}">${esc(cat)}</button>
    `).join('');

    bindOnce(container, 'click', e => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        $$('button', container).forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        renderDemos(btn.dataset.filter);
    });
}

function renderDemos(filter = 'All') {
    const grid = $('#demosGrid');
    const list = filter === 'All' ? demosData : demosData.filter(d => d.category === filter);

    if (!list.length) {
        grid.innerHTML = `<p class="demos-empty">No demos in this category yet —
            <a href="#contact" style="color:var(--purple-light)">ask us to build one</a>.</p>`;
        return;
    }

    // data-demo-id is a stable slug, so a filtered card always opens its own demo.
    grid.innerHTML = list.map(d => `
        <article class="demo-card glass-card" data-demo-id="${esc(d.id)}">
            <a class="preview" href="${esc(d.file)}" target="_blank" rel="noopener"
               aria-label="Open the ${esc(d.name)} demo in a new tab">
                <span class="preview-chrome" aria-hidden="true">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    <span class="bar"></span>
                </span>
                <span class="preview-fallback">${esc(d.name)}</span>
                <span class="preview-viewport" data-src="${esc(d.file)}?embed=1"></span>
                <span class="preview-overlay" aria-hidden="true">
                    <i class="fas fa-up-right-from-square"></i> Open live demo
                </span>
            </a>
            <div class="category">${esc(d.category)}</div>
            <h3>${esc(d.name)}</h3>
            <p class="desc">${esc(d.desc)}</p>
            <div class="price">${esc(money(d.price))}</div>
            <div class="actions">
                <button type="button" class="btn btn-primary btn-sm" data-action="view">View Demo</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="customize">Customize</button>
            </div>
        </article>
    `).join('');

    hydrateDemoPreviews(grid);
}

/**
 * Loads each card's live thumbnail only when it scrolls into view.
 * If the iframe cannot render (some browsers block file:// framing),
 * the styled fallback label stays visible instead of an empty box.
 */
function hydrateDemoPreviews(grid) {
    const viewports = $$('.preview-viewport[data-src]', grid);
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);

            const holder = entry.target;
            const iframe = document.createElement('iframe');
            iframe.src = holder.dataset.src;
            iframe.loading = 'lazy';
            iframe.tabIndex = -1;
            iframe.setAttribute('aria-hidden', 'true');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('title', '');
            iframe.addEventListener('load', () => {
                const fallback = holder.parentElement.querySelector('.preview-fallback');
                if (fallback) fallback.style.display = 'none';
            });
            holder.appendChild(iframe);
        });
    }, { rootMargin: '200px' });

    viewports.forEach(v => io.observe(v));
}

function initDemoGridActions() {
    const grid = $('#demosGrid');
    grid.addEventListener('click', e => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = btn.closest('[data-demo-id]').dataset.demoId;
        if (btn.dataset.action === 'view') openDemoModal(id);
        else openCustomizeModal(id);
    });
}

function getDemo(id) {
    return demosData.find(d => d.id === id) || null;
}

function openDemoModal(id) {
    const d = getDemo(id);
    if (!d) return;

    $('#demoModalTitle').textContent = d.name;
    $('#demoModalDesc').textContent = d.desc;
    $('#demoModalPrice').textContent = money(d.price);
    $('#demoModalMeta').innerHTML = [d.category, d.pages, d.timeline]
        .filter(Boolean).map(t => `<span class="tag">${esc(t)}</span>`).join('') +
        (d.highlights || []).map(h => `<span class="tag">${esc(h)}</span>`).join('');

    const frame = $('#demoModalFrame');
    frame.classList.remove('loaded');
    const iframe = $('iframe', frame);
    iframe.title = d.name + ' live demo';
    iframe.src = d.file + '?embed=1';
    iframe.onload = () => frame.classList.add('loaded');

    $('#demoModalOpen').href = d.file;
    $('#demoModalCustomize').onclick = () => {
        closeModal('demoModal');
        openCustomizeModal(id);
    };
    $('#demoModalGet').onclick = () => {
        closeModal('demoModal');
        prefillContact({
            service: d.category === 'E-Commerce' ? 'E-Commerce' : 'Website',
            message: `I'd like the "${d.name}" design (${money(d.price)}). Please send me a proposal.`
        });
    };

    openModal('demoModal');
}

function openCustomizeModal(id) {
    const d = getDemo(id);
    $('#customizeDemoName').textContent = d ? d.name : 'this website';
    $('#customizeForm').dataset.demoId = d ? d.id : '';
    openModal('customizeModal');
}

/* --------------------------------------------------------------
   AI SOLUTIONS
   -------------------------------------------------------------- */
function renderAI() {
    const grid = $('#aiGrid');
    grid.innerHTML = aiSolutionsData.map((a, i) => `
        <article class="ai-card glass-card">
            <div class="icon"><i class="${esc(a.icon)}" aria-hidden="true"></i></div>
            <h4>${esc(a.title)}</h4>
            <p>${esc(a.desc)}</p>
            <div class="ai-price">${esc(money(a.price))}</div>
            <button type="button" class="btn btn-primary btn-sm" data-ai="${i}">Add to Website</button>
        </article>
    `).join('');

    bindOnce(grid, 'click', e => {
        const btn = e.target.closest('button[data-ai]');
        if (!btn) return;
        const a = aiSolutionsData[Number(btn.dataset.ai)];
        // Tick the matching chip in the builder so the estimate updates too.
        const added = selectBuilderAI(a.title);
        prefillContact({
            service: mapAIToOption(a.title),
            message: `I'd like to add "${a.title}" (${money(a.price)}) to my website.`
        });
        showToast(added
            ? `${a.title} added to your estimate and enquiry.`
            : `${a.title} added to your enquiry.`);
    });
}

function mapAIToOption(title) {
    if (title.includes('Chatbot') || title.includes('WhatsApp')) return 'AI Chatbot';
    if (title.includes('Agent')) return 'AI Agent';
    if (title.includes('Automation')) return 'Automation';
    return 'Custom Project';
}

/* --------------------------------------------------------------
   SOCIAL MEDIA
   -------------------------------------------------------------- */
function renderSocial() {
    const container = $('#socialPlatforms');
    container.innerHTML = socialPlatforms.map((p, i) => `
        <button type="button" class="${i === 0 ? 'active' : ''}"
                data-platform="${esc(p)}" aria-pressed="${i === 0}">${esc(p)}</button>
    `).join('');

    bindOnce(container, 'click', e => {
        const btn = e.target.closest('button[data-platform]');
        if (!btn) return;
        $$('button', container).forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        updateSocialServices(btn.dataset.platform);
    });

    updateSocialServices(socialPlatforms[0]);
    renderPlanGrid('#socialPricing', socialPlans, 'social');
}

function updateSocialServices(platform) {
    const services = socialServicesMap[platform] || [];
    $('#socialServices').innerHTML = services
        .map(s => `<span class="service-tag">${esc(s)}</span>`).join('');
    // Keep the enquiry context current for whichever platform is showing.
    $('#socialServices').dataset.platform = platform;
}

/* --------------------------------------------------------------
   PRICING (shared by the social plans and the main pricing grid)
   -------------------------------------------------------------- */
function renderPlanGrid(selector, plans, kind) {
    const grid = $(selector);
    grid.innerHTML = plans.map((p, i) => `
        <article class="pricing-card glass-card ${p.popular ? 'popular' : ''}">
            ${p.popular ? '<div class="badge">Most Popular</div>' : ''}
            <h4>${esc(p.name)}</h4>
            <div class="price">${esc(money(p.price))}${p.per ? `<span>${esc(p.per)}</span>` : ''}</div>
            ${p.desc ? `<p class="plan-desc">${esc(p.desc)}</p>` : ''}
            <ul>${p.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${esc(f)}</li>`).join('')}</ul>
            <button type="button" class="btn ${p.popular ? 'btn-primary btn-glow' : 'btn-outline'}"
                    data-plan="${i}">${p.custom ? 'Let\'s Talk' : 'Choose Plan'}</button>
        </article>
    `).join('');

    bindOnce(grid, 'click', e => {
        const btn = e.target.closest('button[data-plan]');
        if (!btn) return;
        const p = plans[Number(btn.dataset.plan)];
        const platform = kind === 'social' ? ($('#socialServices').dataset.platform || '') : '';
        prefillContact({
            service: kind === 'social' ? 'Social Media Marketing' : 'Website',
            message: kind === 'social'
                ? `I'd like the ${p.name} social media plan (${money(p.price)}${p.per || ''})${platform ? ' for ' + platform : ''}.`
                : `I'd like the ${p.name} plan (${money(p.price)}).`
        });
        showToast(`${p.name} plan selected — tell us a bit more below.`);
    });
}

function renderPricing() {
    renderPlanGrid('#pricingGrid', pricingPlans, 'website');
}

/* --------------------------------------------------------------
   WHY US / PORTFOLIO / PROCESS / COMMUNITY
   -------------------------------------------------------------- */
function renderWhy() {
    $('#whyGrid').innerHTML = whyData.map(w => `
        <div class="why-item">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <h4>${esc(w.title)}</h4>
            <p>${esc(fillTokens(w.desc))}</p>
        </div>
    `).join('');
}

function renderPortfolioFilters() {
    const container = $('#portfolioFilters');
    container.innerHTML = portfolioCats.map(cat => `
        <button type="button" class="${cat === 'All' ? 'active' : ''}"
                data-pfcat="${esc(cat)}" aria-pressed="${cat === 'All'}">${esc(cat)}</button>
    `).join('');

    bindOnce(container, 'click', e => {
        const btn = e.target.closest('button[data-pfcat]');
        if (!btn) return;
        $$('button', container).forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        renderPortfolio(btn.dataset.pfcat);
    });
}

function renderPortfolio(filter = 'All') {
    const grid = $('#portfolioGrid');
    const list = filter === 'All' ? portfolioItems : portfolioItems.filter(p => p.category === filter);
    grid.innerHTML = list.map(p => {
        const demo = p.demo ? getDemo(p.demo) : null;
        const inner = `
            <div class="pf-icon"><i class="fas ${esc(p.icon)}" aria-hidden="true"></i></div>
            <h4>${esc(p.title)}</h4>
            <div class="pf-cat">${esc(p.category)}</div>
            ${p.result ? `<span class="pf-result">${esc(p.result)}</span>` : ''}`;
        return demo
            ? `<a class="portfolio-item" href="${esc(demo.file)}" target="_blank" rel="noopener">${inner}</a>`
            : `<div class="portfolio-item">${inner}</div>`;
    }).join('');
}

function renderProcess() {
    $('#processTimeline').innerHTML = processSteps.map((s, i) => `
        <div class="process-step">
            <div class="step-number">${i + 1}</div>
            <h4>${esc(s.step)}</h4>
            <p>${esc(s.desc)}</p>
        </div>
    `).join('');
}

function renderCommunity() {
    const container = $('#communityRoles');
    container.innerHTML = communityRoles.map(r => `
        <button type="button" class="role-tag" data-role="${esc(r)}">${esc(r)}</button>
    `).join('');

    bindOnce(container, 'click', e => {
        const tag = e.target.closest('[data-role]');
        if (!tag) return;
        openCareersModal(tag.dataset.role);
    });
}

function openCareersModal(role) {
    const select = $('#careersRole');
    if (role && select) select.value = role;
    openModal('careersModal');
}

/* --------------------------------------------------------------
   CONTACT INFO CARDS
   -------------------------------------------------------------- */
function renderContactInfo() {
    const c = CONFIG;
    $('#contactInfo').innerHTML = `
        <a class="contact-card glass-card" href="mailto:${esc(c.email)}">
            <i class="fas fa-envelope" aria-hidden="true"></i>
            <div><strong>Email</strong><span>${esc(c.email)}</span></div>
        </a>
        <a class="contact-card glass-card" href="tel:${esc(c.phone.replace(/\s/g, ''))}">
            <i class="fas fa-phone" aria-hidden="true"></i>
            <div><strong>Phone</strong><span>${esc(c.phone)}</span></div>
        </a>
        <a class="contact-card glass-card" href="${esc(c.waLink('Hi ' + c.business.name + ', I have an enquiry.'))}"
           target="_blank" rel="noopener">
            <i class="fab fa-whatsapp" aria-hidden="true"></i>
            <div><strong>WhatsApp</strong><span>${esc(c.whatsapp)}</span></div>
        </a>
        <div class="contact-card glass-card">
            <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
            <div><strong>Location</strong><span>${esc(c.business.location)}</span></div>
        </div>
        <div class="contact-card glass-card">
            <i class="fas fa-clock" aria-hidden="true"></i>
            <div><strong>Business Hours</strong><span>${esc(c.business.hours)}</span></div>
        </div>
    `;
}

/* --------------------------------------------------------------
   TESTIMONIALS — dots, arrows, autoplay, swipe
   -------------------------------------------------------------- */
function renderTestimonials() {
    const track = $('#testimonialTrack');
    const dots = $('#testimonialDots');

    track.innerHTML = testimonialsData.map(t => `
        <div class="testimonial-item">
            <div class="stars" aria-label="${t.rating} out of 5 stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
            <blockquote>&ldquo;${esc(t.review)}&rdquo;</blockquote>
            <div class="client">${esc(t.name)} <span>— ${esc(t.business)}</span></div>
        </div>
    `).join('');

    dots.innerHTML = testimonialsData.map((t, i) => `
        <button type="button" class="${i === 0 ? 'active' : ''}" data-index="${i}"
                aria-label="Show review from ${esc(t.name)}"></button>
    `).join('');

    const total = testimonialsData.length;
    let current = 0;
    let timer = null;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        $$('button', dots).forEach((b, i) => b.classList.toggle('active', i === current));
    }

    function play() {
        stop();
        timer = setInterval(() => goTo(current + 1), 6000);
    }

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    dots.addEventListener('click', e => {
        const btn = e.target.closest('button[data-index]');
        if (!btn) return;
        goTo(Number(btn.dataset.index));
        play();
    });

    $('#testimonialPrev').addEventListener('click', () => { goTo(current - 1); play(); });
    $('#testimonialNext').addEventListener('click', () => { goTo(current + 1); play(); });

    // Pause while the visitor is reading.
    const slider = $('.testimonial-slider');
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());

    // Touch swipe.
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
        play();
    });

    goTo(0);
    play();
}

/* --------------------------------------------------------------
   FAQ
   -------------------------------------------------------------- */
function renderFAQ() {
    const container = $('#faqAccordion');
    container.innerHTML = faqs.map((f, i) => `
        <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
                <span>${esc(f.q)}</span>
                <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="faq-answer" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">${esc(fillTokens(f.a))}</div>
        </div>
    `).join('');

    bindOnce(container, 'click', e => {
        const q = e.target.closest('.faq-question');
        if (!q) return;
        const item = q.parentElement;
        const wasOpen = item.classList.contains('open');

        $$('.faq-item', container).forEach(el => {
            el.classList.remove('open');
            $('.faq-question', el).setAttribute('aria-expanded', 'false');
            $('.faq-answer', el).style.maxHeight = null;
        });

        if (!wasOpen) {
            item.classList.add('open');
            q.setAttribute('aria-expanded', 'true');
            // Measured height, so long answers are never clipped.
            const answer = $('.faq-answer', item);
            answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
    });
}

/* --------------------------------------------------------------
   BUDGET DROPDOWN
   Built from data so its bands always match the builder's.
   -------------------------------------------------------------- */
function renderBudgetOptions() {
    const select = $('#contactBudget');
    if (!select) return;
    const previous = select.value;

    select.innerHTML = '<option value="">Budget</option>' +
        budgetBands.map(b => {
            const label = Money.isIndia ? b.inr.label : b.usd.label;
            return `<option>${esc(label)}</option>`;
        }).join('') +
        '<option>Not Sure</option>';

    // Keep the visitor's pick across a currency switch by matching position.
    if (previous) {
        const wasIndex = budgetBands.findIndex(b => b.inr.label === previous || b.usd.label === previous);
        if (wasIndex > -1) {
            select.value = Money.isIndia ? budgetBands[wasIndex].inr.label : budgetBands[wasIndex].usd.label;
        } else if (previous === 'Not Sure') {
            select.value = 'Not Sure';
        }
    }
}

/* --------------------------------------------------------------
   CURRENCY REFRESH
   Re-renders only what shows a price. Filter and platform state is
   read back off the active buttons so nothing resets under the
   visitor. Listeners are attached with bindOnce, so repeating these
   calls cannot stack duplicates.
   -------------------------------------------------------------- */
function refreshPrices() {
    const demoFilter = $('#demoFilters button.active')?.dataset.filter || 'All';
    const platform = $('#socialPlatforms button.active')?.dataset.platform || socialPlatforms[0];

    renderDemos(demoFilter);
    renderAI();
    renderPricing();
    renderPlanGrid('#socialPricing', socialPlans, 'social');
    updateSocialServices(platform);
    renderWhy();
    renderFAQ();
    renderBudgetOptions();
    refreshBuilderLabels();

    // Any open service modal should follow the switch too.
    const openService = $('#serviceModal.open');
    if (openService) {
        const title = $('#serviceModalTitle').textContent.trim();
        const index = servicesData.findIndex(s => s.title === title);
        if (index > -1) $('#serviceModalPrice').textContent = money(servicesData[index].from);
    }
    const openDemo = $('#demoModal.open');
    if (openDemo) {
        const name = $('#demoModalTitle').textContent.trim();
        const demo = demosData.find(d => d.name === name);
        if (demo) $('#demoModalPrice').textContent = money(demo.price);
    }
}
