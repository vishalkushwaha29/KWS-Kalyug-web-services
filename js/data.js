/* ==============================================================
   DATA
   --------------------------------------------------------------
   All site content lives here. Add, remove or reorder entries and
   the page rebuilds itself — no HTML edits needed.
   ============================================================== */

/* ---------- Services ---------- */
const servicesData = [
    {
        icon: 'fa-code',
        title: 'Website Development',
        desc: 'Modern, responsive and conversion-focused websites for businesses, brands and professionals.',
        points: [
            'Custom design built around your brand, never a recycled template',
            'Mobile-first layouts that look right on every screen size',
            'Fast load times and clean, crawlable markup',
            'Contact forms, WhatsApp buttons and Google Maps built in'
        ],
        from: { inr: 7999, usd: 299 }
    },
    {
        icon: 'fa-shopping-cart',
        title: 'E-Commerce Development',
        desc: 'Build powerful online stores with product management, payments and modern shopping experiences.',
        points: [
            'Product catalogue with variants, stock and categories',
            'Razorpay / Stripe / UPI checkout integration',
            'Cart, wishlist, coupons and order tracking',
            'Admin dashboard so you can manage everything yourself'
        ],
        from: { inr: 19999, usd: 799 }
    },
    {
        icon: 'fa-comment-dots',
        title: 'AI Chatbots',
        desc: 'Intelligent AI chatbots that answer questions and engage with your customers.',
        points: [
            'Trained on your own products, pricing and policies',
            'Answers in English, Hindi and regional languages',
            'Hands off to a human when the question needs one',
            'Works on your website, WhatsApp and Instagram DMs'
        ],
        from: { inr: 4999, usd: 199 }
    },
    {
        icon: 'fa-robot',
        title: 'AI Agents',
        desc: 'AI-powered agents that can automate tasks, workflows and customer interactions.',
        points: [
            'Qualifies leads and books meetings without you',
            'Reads email and documents, then takes the next action',
            'Connects to your CRM, sheets and internal tools',
            'Full activity log so you always see what it did'
        ],
        from: { inr: 9999, usd: 399 }
    },
    {
        icon: 'fa-cogs',
        title: 'Automation',
        desc: 'Automate repetitive business tasks and save valuable time.',
        points: [
            'Invoice, quotation and report generation',
            'Auto-sync between WhatsApp, email and spreadsheets',
            'Scheduled reminders and follow-ups',
            'Typical client saves 10–15 hours a month'
        ],
        from: { inr: 12999, usd: 499 }
    },
    {
        icon: 'fa-share-alt',
        title: 'Social Media Marketing',
        desc: 'Grow your online presence with content, strategy, advertising and social media management.',
        points: [
            'Monthly content calendar planned around your offers',
            'Reels, posts, carousels and thumbnails designed for you',
            'Paid ad campaigns with budget and audience management',
            'Transparent monthly reporting on reach and leads'
        ],
        from: { inr: 4999, usd: 199, per: '/mo' }
    },
    {
        icon: 'fa-search',
        title: 'SEO',
        desc: 'Improve your visibility on search engines and attract organic traffic.',
        points: [
            'Technical audit, site speed and Core Web Vitals fixes',
            'Keyword research mapped to real buyer intent',
            'Google Business Profile and local SEO setup',
            'Monthly ranking and traffic reports'
        ],
        from: { inr: 6999, usd: 279, per: '/mo' }
    },
    {
        icon: 'fa-paint-brush',
        title: 'Branding & Design',
        desc: 'Create a strong visual identity with professional graphics, branding and UI/UX.',
        points: [
            'Logo design with full source files',
            'Colour palette, typography and usage guidelines',
            'Business cards, letterheads and social templates',
            'UI/UX design handed off ready to build'
        ],
        from: { inr: 5999, usd: 239 }
    },
    {
        icon: 'fa-file-alt',
        title: 'Landing Pages',
        desc: 'High-converting landing pages for products, services and campaigns.',
        points: [
            'Single-purpose page built around one clear action',
            'Copywriting and layout tuned for conversion',
            'A/B testable sections and analytics wired up',
            'Live in as little as 3 days'
        ],
        from: { inr: 4999, usd: 199 }
    },
    {
        icon: 'fa-laptop',
        title: 'Custom Web Applications',
        desc: 'Custom web apps and dashboards designed around your business requirements.',
        points: [
            'Login, roles and permissions',
            'Dashboards, reports and data exports',
            'REST APIs and third-party integrations',
            'Built to scale as your team grows'
        ],
        from: { inr: 24999, usd: 999 }
    }
];

/* ---------- Website demos ----------
   `file` points at a real, fully working page in /demos.
   `id` is a stable key so filtering can never mismatch a card. */
const demoCategories = ['All', 'Business', 'E-Commerce', 'Portfolio', 'Restaurant', 'Real Estate', 'Education', 'Agency',
    'Landing Page', 'Booking', 'Blog'
];

const demosData = [
    {
        id: 'business',
        name: 'Modern Business Website',
        category: 'Business',
        desc: 'Professional and clean business presence.',
        price: { inr: 7999, usd: 299 },
        file: 'demos/business.html',
        pages: '5 pages',
        timeline: '1–2 weeks',
        highlights: ['Services & about sections', 'Enquiry form', 'Team profiles', 'Google Maps']
    },
    {
        id: 'restaurant',
        name: 'Luxury Restaurant Website',
        category: 'Restaurant',
        desc: 'Elegant design with menu and reservation.',
        price: { inr: 9999, usd: 399 },
        file: 'demos/restaurant.html',
        pages: '4 pages',
        timeline: '1–2 weeks',
        highlights: ['Filterable menu', 'Table reservation', 'Gallery', 'Opening hours']
    },
    {
        id: 'real-estate',
        name: 'Real Estate Website',
        category: 'Real Estate',
        desc: 'Property listings and agent profiles.',
        price: { inr: 14999, usd: 599 },
        file: 'demos/real-estate.html',
        pages: '6 pages',
        timeline: '2–3 weeks',
        highlights: ['Property search & filters', 'Listing detail view', 'Agent profiles', 'EMI calculator']
    },
    {
        id: 'portfolio',
        name: 'Creative Portfolio',
        category: 'Portfolio',
        desc: 'Showcase your work in style.',
        price: { inr: 6999, usd: 249 },
        file: 'demos/portfolio.html',
        pages: '4 pages',
        timeline: '1 week',
        highlights: ['Filterable gallery', 'Lightbox viewer', 'Case studies', 'Downloadable CV']
    },
    {
        id: 'ecommerce',
        name: 'E-Commerce Store',
        category: 'E-Commerce',
        desc: 'Full-featured online store with payments.',
        price: { inr: 19999, usd: 799 },
        file: 'demos/ecommerce.html',
        pages: '8+ pages',
        timeline: '3–4 weeks',
        highlights: ['Product catalogue', 'Working cart & checkout', 'Search & filters', 'Order summary']
    },
    {
        id: 'agency',
        name: 'Digital Agency Website',
        category: 'Agency',
        desc: 'Modern agency layout with services.',
        price: { inr: 11999, usd: 449 },
        file: 'demos/agency.html',
        pages: '6 pages',
        timeline: '2 weeks',
        highlights: ['Case study grid', 'Service breakdown', 'Team & culture', 'Client logos']
    },
    {
        id: 'education',
        name: 'Education Platform',
        category: 'Education',
        desc: 'Courses, lessons and student management.',
        price: { inr: 24999, usd: 999 },
        file: 'demos/education.html',
        pages: '10+ pages',
        timeline: '4–6 weeks',
        highlights: ['Course catalogue', 'Lesson player & progress', 'Enrolment flow', 'Student dashboard']
    },
    {
        id: 'landing',
        name: 'Professional Landing Page',
        category: 'Landing Page',
        desc: 'High-converting single page for campaigns.',
        price: { inr: 4999, usd: 199 },
        file: 'demos/landing.html',
        pages: '1 page',
        timeline: '3–5 days',
        highlights: ['Countdown offer', 'Pricing table', 'Waitlist capture', 'Analytics ready']
    },
    {
        id: 'booking',
        name: 'Salon & Spa Booking',
        category: 'Booking',
        desc: 'Appointment booking with live slot selection.',
        price: { inr: 12999, usd: 499 },
        file: 'demos/booking.html',
        pages: '5 pages',
        timeline: '2 weeks',
        highlights: ['Service picker', 'Date & time slots', 'Staff selection', 'Booking confirmation']
    },
    {
        id: 'blog',
        name: 'Modern Blog & Magazine',
        category: 'Blog',
        desc: 'Content-first layout with search and categories.',
        price: { inr: 8999, usd: 349 },
        file: 'demos/blog.html',
        pages: '5 pages',
        timeline: '1–2 weeks',
        highlights: ['Live article search', 'Category filters', 'Reading view', 'Newsletter signup']
    }
];

/* ---------- AI solutions ---------- */
const aiSolutionsData = [
    { icon: 'fas fa-comment-dots', title: 'AI Chatbot', desc: 'Engage visitors 24/7.', price: { inr: 4999, usd: 199 } },
    { icon: 'fas fa-robot', title: 'AI Agent', desc: 'Automate complex workflows.', price: { inr: 9999, usd: 399 } },
    { icon: 'fas fa-headset', title: 'AI Customer Support', desc: 'Instant support automation.', price: { inr: 7999, usd: 329 } },
    { icon: 'fas fa-users', title: 'AI Lead Generation', desc: 'Capture and qualify leads.', price: { inr: 8999, usd: 349 } },
    { icon: 'fas fa-pen-fancy', title: 'AI Content Assistant', desc: 'Generate content with AI.', price: { inr: 5999, usd: 239 } },
    { icon: 'fas fa-cogs', title: 'AI Automation', desc: 'Streamline business processes.', price: { inr: 12999, usd: 499 } },
    // Brand icons live in the 'fab' family, not 'fas'.
    { icon: 'fab fa-whatsapp', title: 'AI WhatsApp Assistant', desc: 'WhatsApp bot for business.', price: { inr: 6999, usd: 279 } },
    { icon: 'fas fa-database', title: 'AI Knowledge Base', desc: 'Smart knowledge management.', price: { inr: 10999, usd: 429 } }
];

/* ---------- Social media ---------- */
const socialPlatforms = ['Instagram', 'YouTube', 'Facebook', 'Telegram', 'LinkedIn', 'X / Twitter'];

const socialServicesMap = {
    'Instagram': ['Social Media Management', 'Content Strategy', 'Reels', 'Post Design', 'Instagram Ads',
        'Engagement Strategy', 'Growth Campaigns'
    ],
    'YouTube': ['Channel Management', 'Video SEO', 'Thumbnail Design', 'Shorts Strategy', 'YouTube Ads',
        'Content Strategy', 'Analytics'
    ],
    'Facebook': ['Page Management', 'Content Creation', 'Facebook Ads', 'Community Management', 'Growth Strategy'],
    'Telegram': ['Channel Management', 'Community Management', 'Content', 'Promotion', 'Growth Strategy'],
    'LinkedIn': ['Company Page Management', 'Personal Branding', 'Content Strategy', 'Lead Generation',
        'LinkedIn Ads'
    ],
    'X / Twitter': ['Profile Management', 'Content Strategy', 'Community Engagement', 'Growth Campaigns']
};

const socialPlans = [
    {
        name: 'Starter',
        price: { inr: 4999, usd: 199 },
        per: '/mo',
        features: ['Basic Management', 'Content Strategy', 'Post Design']
    },
    {
        name: 'Growth',
        price: { inr: 9999, usd: 399 },
        per: '/mo',
        popular: true,
        features: ['Everything in Starter', 'Ads Management', 'Growth Campaigns', 'Analytics & Reporting']
    },
    {
        name: 'Pro',
        price: { inr: 19999, usd: 799 },
        per: '/mo',
        features: ['Everything in Growth', 'Full Funnel Strategy', 'Dedicated Manager', 'Custom Campaigns']
    }
];

/* ---------- Why us ---------- */
const whyData = [
    { title: 'Fast Delivery', desc: 'Most sites live in 1–3 weeks.' },
    { title: 'Modern Design', desc: 'Built to 2026 design standards.' },
    { title: 'Affordable Pricing', desc: 'Startup-friendly, from {from}.' },
    { title: 'AI Integration', desc: 'Chatbots and agents built in.' },
    { title: 'Mobile First', desc: 'Designed for phones before desktops.' },
    { title: 'Custom Solutions', desc: 'No recycled templates, ever.' },
    { title: 'Transparent Pricing', desc: 'Fixed quotes, no surprise invoices.' },
    { title: 'Post-Launch Support', desc: '30 days of free fixes after launch.' }
];

/* ---------- Pricing plans ---------- */
const pricingPlans = [
    {
        name: 'STARTER',
        price: { inr: 4999, usd: 199, plus: true },
        desc: 'For basic landing pages.',
        features: ['1 Page', 'Contact Form', 'Responsive']
    },
    {
        name: 'BUSINESS',
        price: { inr: 9999, usd: 399, plus: true },
        desc: 'For small businesses.',
        features: ['5 Pages', 'Contact Form', 'WhatsApp Integration', 'SEO Setup'],
        popular: true
    },
    {
        name: 'PROFESSIONAL',
        price: { inr: 19999, usd: 799, plus: true },
        desc: 'For growing businesses.',
        features: ['10 Pages', 'Payment Gateway', 'Admin Dashboard', 'Blog', 'Analytics']
    },
    {
        name: 'CUSTOM',
        price: { custom: 'Let\'s Talk' },
        desc: 'For advanced requirements.',
        features: ['Fully Custom', 'AI Integration', 'Scalable'],
        custom: true
    }
];

/* ---------- Portfolio ---------- */
const portfolioCats = ['All', 'Websites', 'UI/UX', 'AI', 'Branding', 'Social Media'];

const portfolioItems = [
    { title: 'E-Commerce Store', category: 'Websites', icon: 'fa-shopping-bag', result: '2.4× more orders', demo: 'ecommerce' },
    { title: 'AI Chatbot Interface', category: 'AI', icon: 'fa-comment-dots', result: '40% more qualified leads' },
    { title: 'Brand Identity Pack', category: 'Branding', icon: 'fa-palette', result: 'Full rebrand in 10 days' },
    { title: 'Social Media Campaign', category: 'Social Media', icon: 'fa-share-alt', result: '+124% follower growth' },
    { title: 'Business Dashboard', category: 'UI/UX', icon: 'fa-chart-pie', result: '15 hrs/month saved' },
    { title: 'Landing Page Design', category: 'Websites', icon: 'fa-file-alt', result: '18% conversion rate', demo: 'landing' },
    { title: 'AI Automation Workflow', category: 'AI', icon: 'fa-robot', result: '900+ tasks automated' },
    { title: 'Logo & Branding', category: 'Branding', icon: 'fa-tag', result: 'Delivered in 72 hours' }
];

/* ---------- Process ---------- */
const processSteps = [
    { step: 'Discuss', desc: 'We understand your goals and requirements.' },
    { step: 'Plan', desc: 'We create the right strategy and structure.' },
    { step: 'Design', desc: 'We design a modern experience around your brand.' },
    { step: 'Build', desc: 'We develop and test your project.' },
    { step: 'Launch', desc: 'We launch your project and help you move forward.' }
];

/* ---------- Community ---------- */
const communityRoles = ['Web Developer', 'UI/UX Designer', 'Graphic Designer', 'Video Editor', 'Social Media Manager',
    'SEO Specialist', 'AI Automation Specialist', 'Sales / Business Development', 'Intern / Freelancer'
];

/* ---------- Testimonials ---------- */
const testimonialsData = [
    {
        name: 'Priya Sharma',
        business: 'TechStart Inc.',
        rating: 5,
        review: 'Kalyug Web Services completely transformed our online presence. The AI chatbot we integrated has boosted our lead generation by 40%. Highly recommend!'
    },
    {
        name: 'Arjun Singh',
        business: 'The Gourmet Kitchen',
        rating: 5,
        review: 'Our restaurant website is stunning and the booking system works flawlessly. The team understood our vision perfectly.'
    },
    {
        name: 'Sneha Patel',
        business: 'Creative Studio',
        rating: 4,
        review: 'Professional, responsive, and results-driven. Our portfolio site looks premium and has impressed all our clients.'
    }
];

/* ---------- FAQ ---------- */
const faqs = [
    { q: 'How much does a website cost?', a: 'We offer flexible pricing starting from {from} for landing pages. The final cost depends on features and complexity. Use our "Build Your Website" calculator for an estimate.' },
    { q: 'How long does website development take?', a: 'Typically 2-6 weeks depending on the scope. We\'ll provide a clear timeline during the planning phase.' },
    { q: 'Can I customize a demo?', a: 'Absolutely! All our demos are fully customizable. Click "Customize" on any demo to tell us your requirements.' },
    { q: 'Do you provide website maintenance?', a: 'Yes, we offer ongoing maintenance and support packages to keep your site secure and up-to-date.' },
    { q: 'Can you integrate AI into my existing website?', a: 'Yes, we can add AI chatbots, agents, and automation to your current website. Contact us for a consultation.' },
    { q: 'Do you provide SEO?', a: 'Yes, we offer comprehensive SEO services to improve your search engine visibility and organic traffic.' },
    { q: 'Do you provide social media marketing?', a: 'Yes, we manage social media campaigns across all major platforms with a focus on organic growth and advertising.' },
    { q: 'Can you create an e-commerce website?', a: 'Yes, we build full-featured e-commerce sites with payment gateways, product management, and secure checkout.' },
    { q: 'Do you provide hosting and domain?', a: 'We can recommend and set up reliable hosting and domain services, or work with your existing providers.' },
    { q: 'How can I get a quote?', a: 'Fill out the contact form on this page, or reach out via WhatsApp. We\'ll get back to you within 24 hours.' }
];

/* ---------- Builder (price calculator) ----------
   Prices are the single source of truth for the estimate AND for the
   chip labels, so the two can never disagree. */
const builderTypes = [
    { name: 'Landing Page',     price: { inr: 4999,  usd: 199 }, weeks: 1 },
    { name: 'Business Website', price: { inr: 9999,  usd: 399 }, weeks: 2 },
    { name: 'Portfolio',        price: { inr: 6999,  usd: 249 }, weeks: 1 },
    { name: 'E-Commerce',       price: { inr: 19999, usd: 799 }, weeks: 4 },
    { name: 'Booking Website',  price: { inr: 14999, usd: 599 }, weeks: 3 },
    { name: 'Custom Web App',   price: { inr: 24999, usd: 999 }, weeks: 6 }
];

const builderFeatures = [
    { name: 'Responsive Design',    price: { inr: 0,    usd: 0 } },
    { name: 'Contact Form',         price: { inr: 500,  usd: 25 } },
    { name: 'WhatsApp Integration', price: { inr: 500,  usd: 25 } },
    { name: 'Payment Gateway',      price: { inr: 2500, usd: 99 } },
    { name: 'Login / Signup',       price: { inr: 2000, usd: 79 } },
    { name: 'Admin Dashboard',      price: { inr: 4000, usd: 149 } },
    { name: 'Blog',                 price: { inr: 1500, usd: 59 } },
    { name: 'Booking System',       price: { inr: 3000, usd: 119 } },
    { name: 'SEO Setup',            price: { inr: 1500, usd: 59 } },
    { name: 'Analytics',            price: { inr: 500,  usd: 25 } },
    { name: 'Multi-language',       price: { inr: 2500, usd: 99 } },
    { name: 'Custom API',           price: { inr: 4000, usd: 149 } }
];

const builderAI = [
    { name: 'AI Chatbot',           price: { inr: 4999,  usd: 199 } },
    { name: 'AI Agent',             price: { inr: 9999,  usd: 399 } },
    { name: 'AI Content Assistant', price: { inr: 5999,  usd: 239 } },
    { name: 'AI Customer Support',  price: { inr: 7999,  usd: 329 } },
    { name: 'AI Automation',        price: { inr: 12999, usd: 499 } }
];

/* ---------- Budget bands ----------
   Used both for the contact form dropdown and for pre-selecting a band
   from a builder estimate, so the two can never drift apart. */
const budgetBands = [
    { inr: { max: 5000,     label: 'Below ₹5,000' },        usd: { max: 200,      label: 'Under $200' } },
    { inr: { max: 10000,    label: '₹5,000 – ₹10,000' },  usd: { max: 400,   label: '$200 – $400' } },
    { inr: { max: 25000,    label: '₹10,000 – ₹25,000' }, usd: { max: 1000,  label: '$400 – $1,000' } },
    { inr: { max: 50000,    label: '₹25,000 – ₹50,000' }, usd: { max: 2000,  label: '$1,000 – $2,000' } },
    { inr: { max: Infinity, label: '₹50,000+' },            usd: { max: Infinity, label: '$2,000+' } }
];
