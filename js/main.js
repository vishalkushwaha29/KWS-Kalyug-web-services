/* ==============================================================
   MAIN — boot sequence
   --------------------------------------------------------------
   Order matters: content is rendered first so the behaviour layer
   below has real nodes to attach to.
   ============================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Currency must resolve before anything prints a price.
    initCurrencySwitch(refreshPrices);

    // 1. Content
    applyConfigToPage();
    renderServices();
    renderDemoFilters();
    renderDemos('All');
    renderAI();
    renderSocial();
    renderWhy();
    renderPricing();
    renderPortfolioFilters();
    renderPortfolio('All');
    renderProcess();
    renderCommunity();
    renderTestimonials();
    renderFAQ();
    renderContactInfo();
    renderBudgetOptions();
    renderBuilder();

    // 2. Behaviour
    initNavbar();
    initAnchors();
    initModalBehaviour();
    initDemoGridActions();
    initForms();
    initBackToTop();
    initCounters();
    initScrollReveal();

    // 3. Deep links: index.html#demo=restaurant opens that demo's modal.
    const match = /[#&]demo=([\w-]+)/.exec(location.hash);
    if (match && getDemo(match[1])) openDemoModal(match[1]);
});
