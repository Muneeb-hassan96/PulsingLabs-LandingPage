/* =====================================================================
   PulsingLabs · Marketing site shared JS
   Injects nav + footer, page-transition curtain, scroll reveals,
   3D tilt, animated counters, magnetic buttons, cursor glow,
   scroll progress, testimonials carousel, ROI calculator.
   ===================================================================== */
(function () {
  'use strict';

  // ---- Launch config — set APP_URL + PROD_API_BASE to your real hosts ----
  // APP_URL: where the deployed Flutter web app lives. Until it is set, every
  // "app" CTA gracefully falls back to the contact page (DEMO_URL) so no button
  // is ever a dead end. Set it once here and all CTAs across all pages light up.
  var APP_URL = '';                  // e.g. 'https://app.pulsinglabs.pk'
  var DEMO_URL = 'contact.html';     // book-a-demo / contact (always works)

  // Backend API base for live data (public, unauthenticated endpoints only).
  // Auto-detects: localhost/file:// -> local Node on :3000; anything else -> the
  // production API host below. Set PROD_API_BASE before deploying the site.
  var PROD_API_BASE = 'https://api.pulsinglabs.pk/api'; // <-- set to your real API host
  var _devHost = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;
  var API_BASE = (location.protocol === 'file:' || _devHost.test(location.hostname))
    ? 'http://localhost:3000/api'
    : PROD_API_BASE;

  // Resolve a CTA's destination from its intent. App/home-visit go to the app
  // when it is deployed, else to the contact page; sales CTAs go to contact.
  function ctaDest(kind) {
    var app = (APP_URL && APP_URL !== '#') ? APP_URL : null;
    switch (kind) {
      case 'app':        return app || DEMO_URL;
      case 'home-visit': return app || DEMO_URL;
      case 'register':   return DEMO_URL;   // B2B sales — capture as a lead
      case 'demo':       return DEMO_URL;
      default:           return DEMO_URL;
    }
  }
  // The brand icon — self-contained rounded-square DNA-helix mark (its own
  // mint-gradient tile baked in), reads on both the cream and dark scroll themes.
  var LOGO_SVG = '<img class="logo-mark" src="assets/img/logo-mark.png" alt="" width="42" height="42" />';

  // ---- Line-icon set (Lucide-style, currentColor), replaces all emoji ----
  var ICONS = {
    zap:        '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
    chart:      '<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="18" y1="20" x2="18" y2="11"/>',
    chat:       '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>',
    trend:      '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/>',
    file:       '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>',
    users:      '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    home:       '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    bell:       '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    card:       '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
    shield:     '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    shieldcheck:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    calendar:   '<rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="9" x2="21" y2="9"/>',
    calc:       '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/>',
    pie:        '<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    droplet:    '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z"/>',
    sparkle:    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    globe:      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    target:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    compass:    '<circle cx="12" cy="12" r="10"/><polygon points="16.2 7.8 14 14 7.8 16.2 10 10 16.2 7.8"/>',
    heart:      '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/>',
    mail:       '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    briefcase:  '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    lab:        '<path d="M9 3h6"/><path d="M10 3v6.5L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-8.5V3"/><line x1="7.5" y1="14" x2="16.5" y2="14"/>'
  };
  function icon(key) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[key] || '') + '</svg>';
  }
  function paintIcons() {
    document.querySelectorAll('[data-icon]').forEach(function (el) { el.innerHTML = icon(el.getAttribute('data-icon')); });
  }

  var NAV = [
    { href: 'index.html',    label: 'Home' },
    { href: 'features.html', label: 'Features', mega: {
        blurb: 'Everything PulsingLabs does, from booking to understanding every number.',
        items: [
          { href: 'features.html', icon: 'zap',   title: 'Book in minutes',     desc: 'Packages, labs & slots' },
          { href: 'features.html', icon: 'chart', title: 'Clinical zone charts', desc: 'See exactly where you stand' },
          { href: 'features.html', icon: 'chat',  title: 'AI health assistant',  desc: 'Your results, explained' },
          { href: 'features.html', icon: 'trend', title: 'Trend tracking',       desc: 'Catch changes early' },
          { href: 'features.html', icon: 'file',  title: 'Import any report',    desc: 'OCR from any lab' },
          { href: 'features.html', icon: 'users', title: 'Family profiles',      desc: 'One account, whole family' }
        ] } },
    { href: 'business.html', label: 'For Business', mega: {
        blurb: 'Preventive screening & wellness for your team, with privacy-first HR insight.',
        items: [
          { href: 'business.html', icon: 'pie',      title: 'Corporate wellness', desc: 'HR dashboard & analytics' },
          { href: 'business.html', icon: 'calc',     title: 'ROI calculator',     desc: 'Cost of absenteeism' },
          { href: 'pricing.html',  icon: 'card',     title: 'Pricing',            desc: 'Flat per-employee plan' },
          { href: 'contact.html',  icon: 'calendar', title: 'Book a demo',        desc: '15-minute walkthrough' }
        ] } },
    { href: 'pricing.html',  label: 'Pricing', mega: {
        blurb: 'Simple, transparent pricing. Free for individuals, a flat plan for teams.',
        items: [
          { href: 'pricing.html', icon: 'sparkle', title: 'Personal',        desc: 'Free app, pay per test' },
          { href: 'pricing.html', icon: 'pie',     title: 'Corporate',       desc: 'Flat per-employee plan' },
          { href: 'pricing.html', icon: 'lab',     title: 'Labs & Clinics',  desc: 'Custom white-label terms' },
          { href: 'pricing.html', icon: 'card',    title: 'Pricing FAQ',     desc: 'Trials, billing & cancellation' }
        ] } },
    { href: 'insights.html', label: 'Insights', mega: {
        blurb: 'Plain-English guides to understanding your lab results.',
        items: [
          { href: 'insights.html', icon: 'file',    title: 'All Insights',  desc: 'Guides & how-tos' },
          { href: 'insights.html', icon: 'droplet', title: 'Health Guides', desc: 'Cholesterol, thyroid, vitamins' },
          { href: 'insights.html', icon: 'bell',    title: 'Newsletter',    desc: 'Updates & health tips' }
        ] } },
    { href: 'about.html',    label: 'About', mega: {
        blurb: 'Our mission: make your health make sense, for everyone.',
        items: [
          { href: 'about.html',    icon: 'compass', title: 'About us',           desc: 'Our mission & story' },
          { href: 'features.html', icon: 'zap',     title: 'The PulsingLabs App', desc: 'Everything it does' },
          { href: 'business.html', icon: 'users',   title: 'For Business',       desc: 'Corporate wellness' },
          { href: 'faq.html',      icon: 'chat',    title: 'FAQ',                desc: 'Common questions' },
          { href: 'contact.html',  icon: 'mail',    title: 'Contact',            desc: 'Talk to us' }
        ] } },
    { href: 'contact.html',  label: 'Contact', mega: {
        blurb: 'Book a demo, ask about partnerships, or just say hello.',
        items: [
          { href: 'contact.html',               icon: 'calendar',  title: 'Book a demo',       desc: '15-minute walkthrough' },
          { href: 'mailto:contact@pulsinglabs.com',  icon: 'mail',      title: 'General & support', desc: 'contact@pulsinglabs.com' },
          { href: 'mailto:contact@pulsinglabs.com',  icon: 'briefcase', title: 'Corporate sales',   desc: 'Demos & partnerships' },
          { href: 'contact.html',               icon: 'chat',      title: 'Send a message',    desc: 'Use the contact form' }
        ] } }
  ];

  var page = (location.pathname.split('/').pop() || 'index.html');
  if (page === '') page = 'index.html';

  /* ------------------------------------------------------------------ */
  /* i18n — English only. The site used to also ship a full Urdu UI; that   */
  /* was retired (Urdu now lives only in the in-app AI chatbot). This      */
  /* dictionary + data-i18n plumbing stays as the single source of truth   */
  /* for shared chrome (nav/footer) + the home page body copy.             */
  /* ------------------------------------------------------------------ */
  var I18N = {
    en: {
      'nav.home': 'Home', 'nav.features': 'Features', 'nav.business': 'For Business',
      'nav.pricing': 'Pricing', 'nav.insights': 'Insights', 'nav.about': 'About', 'nav.contact': 'Contact',
      'cta.getStarted': 'Get Started', 'mega.viewAll': 'View all',
      'mm.1.b': 'Everything PulsingLabs does, from booking to understanding every number.',
      'mm.1.0t': 'Book in minutes', 'mm.1.0d': 'Packages, labs & slots', 'mm.1.1t': 'Clinical zone charts', 'mm.1.1d': 'See exactly where you stand', 'mm.1.2t': 'AI health assistant', 'mm.1.2d': 'Your results, explained', 'mm.1.3t': 'Trend tracking', 'mm.1.3d': 'Catch changes early', 'mm.1.4t': 'Import any report', 'mm.1.4d': 'OCR from any lab', 'mm.1.5t': 'Family profiles', 'mm.1.5d': 'One account, whole family',
      'mm.2.b': 'Preventive screening & wellness for your team, with privacy-first HR insight.',
      'mm.2.0t': 'Corporate wellness', 'mm.2.0d': 'HR dashboard & analytics', 'mm.2.1t': 'ROI calculator', 'mm.2.1d': 'Cost of absenteeism', 'mm.2.2t': 'Pricing', 'mm.2.2d': 'Flat per-employee plan', 'mm.2.3t': 'Book a demo', 'mm.2.3d': '15-minute walkthrough',
      'mm.3.b': 'Simple, transparent pricing. Free for individuals, a flat plan for teams.',
      'mm.3.0t': 'Personal', 'mm.3.0d': 'Free app, pay per test', 'mm.3.1t': 'Corporate', 'mm.3.1d': 'Flat per-employee plan', 'mm.3.2t': 'Labs & Clinics', 'mm.3.2d': 'Custom white-label terms', 'mm.3.3t': 'Pricing FAQ', 'mm.3.3d': 'Trials, billing & cancellation',
      'mm.4.b': 'Plain-English guides to understanding your lab results.',
      'mm.4.0t': 'All Insights', 'mm.4.0d': 'Guides & how-tos', 'mm.4.1t': 'Health Guides', 'mm.4.1d': 'Cholesterol, thyroid, vitamins', 'mm.4.2t': 'Newsletter', 'mm.4.2d': 'Updates & health tips',
      'mm.5.b': 'Our mission: make your health make sense, for everyone.',
      'mm.5.0t': 'About us', 'mm.5.0d': 'Our mission & story', 'mm.5.1t': 'The PulsingLabs App', 'mm.5.1d': 'Everything it does', 'mm.5.2t': 'For Business', 'mm.5.2d': 'Corporate wellness', 'mm.5.3t': 'FAQ', 'mm.5.3d': 'Common questions', 'mm.5.4t': 'Contact', 'mm.5.4d': 'Talk to us',
      'mm.6.b': 'Book a demo, ask about partnerships, or just say hello.',
      'mm.6.0t': 'Book a demo', 'mm.6.0d': '15-minute walkthrough', 'mm.6.1t': 'General & support', 'mm.6.1d': 'contact@pulsinglabs.com', 'mm.6.2t': 'Corporate sales', 'mm.6.2d': 'Demos & partnerships', 'mm.6.3t': 'Send a message', 'mm.6.3d': 'Use the contact form',
      'foot.product': 'Product', 'foot.business': 'Business', 'foot.company': 'Company',
      'foot.tagline': "Book lab tests, understand your results, and track your family's health, all in one app.",
      'foot.rights': 'All rights reserved.', 'foot.made': 'Made with care in Pakistan',
      'stats.note': '* Industry estimates, figures vary by region.',
      'foot.head': 'Take charge of your health today.',
      'foot.connect': 'Connect with us',
      'foot.connectSub': 'Questions, partnerships, or ready to start? We reply fast.',
      'foot.openApp': 'Open the App', 'foot.demo': 'Book a demo',
      'foot.menu': 'Menu',
      'foot.touch': 'Let\'s stay in touch',
      'foot.touchSub': 'Health tips and product news, once a month, no spam.',
      'foot.nlPh': 'you@email.com', 'foot.nlBtn': 'Subscribe',
      'foot.nlOk': 'Subscribed, see you in your inbox.',
      'foot.nlErr': 'That did not work, try again.',
      'foot.privacy': 'Privacy', 'foot.faq': 'FAQ', 'foot.labs': 'Labs & clinics',
      'kb.decoded': 'Your health, decoded', 'kb.book': 'Book', 'kb.test': 'Test',
      'kb.understand': 'Understand', 'kb.act': 'Act early', 'kb.repeat': 'Repeat',
      'kb.teams': 'Healthier teams', 'kb.sick': 'Fewer sick days', 'kb.roi': 'Real ROI',
      'home.eyebrow': 'Your health, simplified',
      'home.h1': 'Book lab tests.<br>Then actually <span class="grad-text">understand</span> them.',
      'home.lead': '50+ blood-test packages, booked at your lab or your door, with every result explained in plain English by AI. For you, and your whole family.',
      'home.cta1': 'Get started free <span class="arrow">→</span>',
      'home.cta2': 'See how it works',
      'home.note': 'Private & secure',
      'home.ctaH': 'Take charge of your health today.',
      'home.ctaP': 'Turn confusing lab reports into clarity, for you and your family.',
      'home.ctaBtn': 'Open the App <span class="arrow">→</span>',
      'mq.packages': '50+ test packages', 'mq.home': 'Home sample collection', 'mq.ai': 'AI-powered insights',
      'mq.family': 'Family profiles', 'mq.trend': 'Trend tracking', 'mq.import': 'Import any lab report', 'mq.lang': 'AI chat understands Urdu',
      'b3d.eyebrow': 'Live organ health',
      'b3d.h2': 'Your body, decoded in 3D.',
      'b3d.lead': 'Every result you take maps onto a holographic body inside the app. Spin it, tap an organ, and see its live condition scored from your own blood work.',
      'b3d.li1': 'Heart, liver, kidneys, thyroid and more, each scored 0 to 100',
      'b3d.li2': 'Organs glow green, amber or red with your latest results',
      'b3d.li3': 'Tap any organ to zoom in and get the full story',
      'b3d.cta': 'Scan your health <span class="arrow">→</span>',
      'bn.eyebrow': 'One app, everything',
      'bn.h2': 'Built like your health deserves it.',
      'bn.score': 'One score for your whole body',
      'bn.scoreSub': 'Every marker rolls up into a single 0 to 100 health score, weighted by what matters clinically.',
      'bn.trend': 'Trends you can actually see',
      'bn.trendSub': 'Months of results on one chart, with healthy zones drawn in.',
      'bn.pkg': 'Test packages',
      'bn.pkgSub': 'At your lab, or your door.',
      'bn.aiMsg': 'Your LDL is high. Here is what to do this month.',
      'bn.ai': 'AI that explains',
      'bn.aiSub': 'Plain answers, your language.',
      'bn.family': 'Whole-family care',
      'bn.familySub': 'Parents, kids, one account.',
      'bn.lang': 'AI that speaks Urdu',
      'bn.langSub': 'Ask it anything, in Urdu or English.',
      'prob.eyebrow': 'The problem',
      'prob.h2': 'Understanding your health shouldn\'t need a medical degree.',
      'prob.lead': 'Most people leave the lab with a printout full of arrows and acronyms, and no idea what it means for them. PulsingLabs turns those numbers into clear, personal answers, and helps you act on them in time.',
      'spA.eyebrow': 'Understand your results', 'spA.h2': 'See exactly where you stand.',
      'spA.lead': 'Every marker sits on a clinical zone chart (Normal, Borderline, or High), tuned to your age and sex, with a plain-English explanation underneath.',
      'spA.li1': 'Colour-coded healthy ranges, not raw numbers', 'spA.li2': 'AI explanations grounded in your own results', 'spA.li3': 'Trends across months and years, at a glance',
      'spB.eyebrow': 'AI health assistant', 'spB.h2': 'Ask anything. In your language.',
      'spB.lead': 'Chat about your results like you would with a calm, knowledgeable friend, in English or اردو, and let it book your next test right inside the conversation.',
      'spB.li1': 'Plain answers, never jargon or scare-talk', 'spB.li2': 'Books, reschedules & cancels conversationally', 'spB.li3': 'Urgent symptoms trigger emergency guidance',
      'spC.eyebrow': 'Family & history', 'spC.h2': 'Your whole household, one account.',
      'spC.lead': 'Add parents, kids and your spouse, and bring in old reports from any lab by snapping a photo, so every result, past and present, lives on one timeline.',
      'spC.li1': 'Age-, sex- & pregnancy-aware reference ranges', 'spC.li2': 'OCR reads photos & PDFs, you just confirm', 'spC.li3': 'Imports join the same trend charts',
      'hc.eyebrow': 'Home sample collection', 'hc.h2': 'Prefer to skip the lab? We come to you.',
      'hc.lead': 'Book a home visit and a certified phlebotomist collects your sample at your door, at a time that suits you. Same accredited labs, same results in-app, zero travel.',
      'hc.li1': 'Choose "home collection" when you book', 'hc.li2': 'Pick a slot, morning, afternoon or evening', 'hc.li3': 'Results flow into the app like any other test',
      'hc.btn': 'Book a home visit <span class="arrow">→</span>',
      'bento.eyebrow': 'One app', 'bento.h2': 'Everything your health needs, in one place.',
      'bento.b1h': 'An AI that explains every result', 'bento.b1p': 'Chat about your numbers in plain English or اردو, and let it book your next test, right in the conversation.',
      'bento.b2h': 'Clinical zone charts', 'bento.b2p': 'See exactly where you stand, tuned to your age & sex.',
      'bento.b3p': 'curated test packages', 'bento.b4h': 'Home collection', 'bento.b4p': 'We come to you.',
      'bento.b5h': 'Your whole family', 'bento.b5p': 'Parents, kids & spouse on one account, each with age-aware ranges.',
      'bento.b6h': 'Import any report', 'bento.b6p': 'Snap a photo, OCR does the rest.',
      'bento.b7h': 'AI that speaks Urdu', 'bento.b7p': 'Ask your health questions in Urdu, too.',
      'how.eyebrow': 'How it works', 'how.h2': 'Three steps to clarity',
      'how.s1h': 'Choose a package', 'how.s1p': 'Browse 50+ curated blood-test packages, or scan an existing report to import it.',
      'how.s2h': 'Pick lab & time', 'how.s2p': 'Select a partner lab or home collection, then a slot that works for you.',
      'how.s3h': 'Get results + insights', 'how.s3p': 'Results arrive in-app with charts, trends, and AI explanations you understand.',
      'why.eyebrow': 'Why it matters', 'why.h2': 'Most chronic illness is caught far too late.',
      'why.lead': 'Diabetes, high cholesterol and thyroid disorders develop silently for years. Early screening changes the outcome. PulsingLabs makes it effortless.',
      'why.s1': 'adults live with a chronic condition, many undiagnosed*', 'why.s2': 'of early-stage conditions are manageable when caught in time*',
      'why.s3': 'curated blood-test packages to choose from', 'why.s4': 'organ systems scored in real time',
      'fb.eyebrow': 'For Business', 'fb.h2': 'Healthier teams, lower absenteeism.',
      'fb.lead': 'Give employees preventive screening and wellness, with an HR dashboard that turns it into insight, without ever exposing individual medical data.',
      'fb.btn1': 'See the business plan <span class="arrow">→</span>', 'fb.btn2': 'Book a demo',
      'fb.c1h': 'Aggregate analytics', 'fb.c1p': 'Wellness trends, never individual records.',
      'fb.c2h': 'Proactive alerts', 'fb.c2p': 'Know when the team needs attention.',
      'fb.c3h': 'AI HR assistant', 'fb.c3p': 'Appointments & roster answers.',
      'fb.c4h': 'Privacy-first', 'fb.c4p': 'Results stay private to employees.',
      'test.eyebrow': 'Loved by users', 'test.h2': 'What people say',
      'test.q1': '"I finally understand my blood reports. The app tells me what\'s normal and what isn\'t, and I can track my parents\' results too."',
      'test.q2': '"Home collection plus instant explanations is a game-changer. I gave a sample at home and understood every number the same day."',
      'test.q3': '"As an HR lead, the aggregate dashboard helped us spot trends early, without ever seeing anyone\'s private results."',
      'scene.eyebrow': 'Why PulsingLabs', 'scene.h2': 'Clarity for the people you love.',
      'scene.p': 'From your own numbers to your whole family\'s, every result explained, tracked, and within reach.',
      'pg.feat.eyebrow': 'Features', 'pg.feat.h1': 'Everything you need to<br><span class="grad-text">own your health</span>', 'pg.feat.lead': 'From the first booking to understanding every number, and doing it for your whole family.',
      'pg.faq.eyebrow': 'Help centre', 'pg.faq.h1': 'Frequently <span class="grad-text">asked</span>', 'pg.faq.lead': 'Everything about booking, results, privacy and the corporate plan. Can\'t find it? <a href="contact.html" style="color:var(--teal-l);font-weight:600;">Get in touch.</a>',
      'pg.biz.eyebrow': 'For Business', 'pg.biz.h1': 'Healthier teams,<br><span class="grad-text">lower absenteeism</span>', 'pg.biz.lead': 'Give employees preventive screening and wellness, with an HR dashboard that turns it into insight, without ever exposing individual medical data.',
      'pg.ins.eyebrow': 'Insights', 'pg.ins.h1': 'Learn about<br><span class="grad-text">your health</span>', 'pg.ins.lead': 'Plain-English guides to understanding your lab results and staying ahead of chronic illness.',
      'pg.price.eyebrow': 'Pricing', 'pg.price.h1': 'Simple, <span class="grad-text">transparent</span> pricing', 'pg.price.lead': 'No subscriptions for individuals, pay per test package. Businesses get a flat per-employee plan, and labs get custom white-label terms.',
      'pg.about.eyebrow': 'Our mission', 'pg.about.h1': 'Make your health<br><span class="grad-text">make sense</span>', 'pg.about.lead': 'Lab reports shouldn\'t need a medical degree to read. PulsingLabs turns confusing numbers into clear, personal understanding, for everyone.',
      'pg.priv.eyebrow': 'Legal', 'pg.priv.h1': 'Privacy <span class="grad-text">Policy</span>', 'pg.priv.lead': 'Your health data is sensitive. Here\'s exactly how we handle it.',
      'pg.contact.eyebrow': 'Get in touch', 'pg.contact.h1': 'Let\'s <span class="grad-text">talk</span>', 'pg.contact.lead': 'Book a demo, ask about partnerships, or just say hello. We usually reply within one business day.',
      'feat.s1.eye': 'Book in minutes', 'feat.s1.h2': 'From "I should get tested" to booked, in two minutes.', 'feat.s1.lead': 'Pick a package, choose a partner lab or home collection, and grab a slot. No queues, no phone calls, pay online or at the lab.',
      'feat.s1.li1': '50+ curated blood-test packages', 'feat.s1.li2': 'Real-time slot availability per lab', 'feat.s1.li3': 'Home sample collection at your door',
      'feat.s2.eye': 'Understand your results', 'feat.s2.h2': 'See exactly where you stand.', 'feat.s2.lead': 'Every marker sits on a clinical zone chart (Normal, Borderline, High), tuned to your age and sex, with a plain-English explanation underneath.',
      'feat.s2.li1': 'Colour-coded healthy ranges, not raw numbers', 'feat.s2.li2': 'Age-, sex- & pregnancy-aware reference ranges', 'feat.s2.li3': 'Trends across months and years',
      'feat.s3.eye': 'AI health assistant', 'feat.s3.h2': 'Ask anything. In your language.', 'feat.s3.lead': 'Chat about your results like you would with a calm, knowledgeable friend, in English or اردو, and let it book your next test inside the conversation.',
      'feat.s3.li1': 'Plain answers grounded in your own numbers', 'feat.s3.li2': 'Books, reschedules & cancels conversationally', 'feat.s3.li3': 'Urgent symptoms trigger emergency guidance',
      'feat.s3.b1': 'Is my vitamin D low?', 'feat.s3.b2': 'Yes, it\'s 22 ng/mL, below the 30 target. Common here and easy to fix with sunlight, diet or a supplement. Want me to book a recheck in 8 weeks?', 'feat.s3.b3': 'Yes please',
      'feat.s4.eye': 'Import & family', 'feat.s4.h2': 'Your whole household, one timeline.', 'feat.s4.lead': 'Add family members and bring in old reports from any lab by snapping a photo, so every result, past and present, lives in one place.',
      'feat.s4.li1': 'OCR reads photos & PDFs, you just confirm', 'feat.s4.li2': 'Imports join the same trend charts', 'feat.s4.li3': 'Separate profile per family member',
      'feat.more.eye': 'And more', 'feat.more.h2': 'Built into every plan',
      'feat.more.c1h': 'Proactive insights', 'feat.more.c1p': 'A "what changed" alert when a new result trends into an abnormal range.',
      'feat.more.c2h': 'Flexible payment', 'feat.more.c2p': 'Pay online or at the lab, no subscription required for individuals.',
      'feat.more.c3h': 'Private & secure', 'feat.more.c3p': 'Encrypted in transit, never sold, and yours to export anytime.',
      'feat.how.eye': 'How it works', 'feat.how.h2': 'Three steps to clarity',
      'feat.how.s1h': 'Choose a package', 'feat.how.s1p': 'Browse 50+ packages, or scan an existing report to import it.',
      'feat.how.s2h': 'Pick lab & time', 'feat.how.s2p': 'Select a partner lab or home collection, then a slot that works for you.',
      'feat.how.s3h': 'Get results + insights', 'feat.how.s3p': 'Results arrive with charts, trends, and AI explanations.',
      'feat.cta.h': 'Ready to understand your health?', 'feat.cta.p': 'Get started free, pay only for the tests you book.', 'feat.cta.btn': 'Get Started <span class="arrow">→</span>',
      'pr.p1.h': 'Personal', 'pr.p1.amt': 'Free<span> app</span>', 'pr.p1.desc': 'Pay only for the test packages you book.',
      'pr.p1.l1': 'All 50+ test packages', 'pr.p1.l2': 'AI result explanations & trends', 'pr.p1.l3': 'Family member profiles', 'pr.p1.l4': 'Home sample collection', 'pr.p1.l5': 'Import reports from any lab', 'pr.p1.l6': 'Pay online or at the lab', 'pr.p1.btn': 'Get Started',
      'pr.tag': 'MOST POPULAR', 'pr.p2.h': 'Corporate', 'pr.p2.amt': 'PKR 1,500<span> / employee / mo</span>', 'pr.p2.desc': '30-day free trial. Cancel anytime.',
      'pr.p2.l1': 'Everything in Personal, for every employee', 'pr.p2.l2': 'HR dashboard & aggregate analytics', 'pr.p2.l3': 'Proactive wellness alerts', 'pr.p2.l4': 'AI HR assistant', 'pr.p2.l5': 'CSV export & PDF employee reports', 'pr.p2.l6': 'Dedicated account manager', 'pr.p2.btn': 'Start free trial',
      'pr.p3.h': 'Labs & Clinics', 'pr.p3.amt': 'Custom', 'pr.p3.desc': 'Branded patient portal & API result delivery.',
      'pr.p3.l1': 'Branded patient-facing portal', 'pr.p3.l2': 'REST API for result uploads', 'pr.p3.l3': 'Automated patient notifications', 'pr.p3.l4': 'Result history & trend charts', 'pr.p3.l5': 'SLA-backed uptime', 'pr.p3.btn': 'Contact sales',
      'pr.note': 'Prices shown in PKR. Test-package prices vary by lab and are shown before you book.',
      'pr.faq.eye': 'Questions', 'pr.faq.h2': 'Pricing FAQ',
      'pr.q1': 'Is the app really free for individuals?', 'pr.a1': 'Yes. Downloading and using PulsingLabs is free, you only pay the lab for the test packages you choose to book. There is no subscription for personal use.',
      'pr.q2': 'How does the corporate trial work?', 'pr.a2': 'Corporate accounts get 30 days of full access at no charge, no credit card required. After the trial, billing is PKR 1,500 per active employee per month. Cancel anytime.',
      'pr.q3': 'What counts as an "active employee"?', 'pr.a3': 'Any approved employee account that logged at least one activity, an appointment booked or a result viewed, in the billing month.',
      'pr.q4': 'Is my health data private from my employer?', 'pr.a4': 'Always. Corporate dashboards show only anonymised, aggregate statistics. Employers never see individual test values or personal health records.',
      'pr.q5': 'Can I cancel anytime?', 'pr.a5': 'Yes. Cancel from your account settings and access continues to the end of the current billing period. No lock-in.',
      'pr.q6': 'Do you offer non-profit or academic discounts?', 'pr.a6': 'Yes, email <a href="mailto:contact@pulsinglabs.com" style="color:var(--teal-d);font-weight:700;">contact@pulsinglabs.com</a> and we will sort out special pricing.',
      'pr.cta.h': 'Start free today', 'pr.cta.p': 'Individuals start instantly. Businesses get a 30-day trial, no card required.', 'pr.cta.b1': 'Get the app', 'pr.cta.b2': 'Talk to sales',
      'biz.heroB1': 'Book a demo <span class="arrow">→</span>', 'biz.heroB2': 'See pricing',
      'biz.stats.eye': 'The cost of poor health', 'biz.stats.h2': 'Ill health is expensive, and largely preventable.', 'biz.stats.lead': 'Sick days, lost productivity and late diagnoses quietly drain your business. Preventive screening is one of the highest-ROI benefits you can offer.',
      'biz.s1': 'employees affected by work-related ill health*', 'biz.s2': 'average sick days per employee, per year*', 'biz.s3': 'of early-stage conditions are manageable if caught in time*', 'biz.s4': 'free trial, no credit card required',
      'biz.wyg.eye': 'What you get', 'biz.wyg.h2': 'An HR wellness platform, not a spreadsheet.',
      'biz.wyg.l1': 'Company dashboard with aggregate wellness analytics', 'biz.wyg.l2': 'Proactive alerts when the team\'s health needs attention', 'biz.wyg.l3': 'AI HR assistant for appointments & roster questions', 'biz.wyg.l4': 'One-click employee invites & CSV exports', 'biz.wyg.l5': 'Individual employee health reports (PDF)', 'biz.wyg.l6': 'Privacy-first: employees\' results stay private to them',
      'biz.calc.h': 'What does poor health cost you?', 'biz.calc.sub': 'Estimate the annual cost of employee sick days, and what prevention could save.',
      'biz.calc.lab1': 'Number of employees', 'biz.calc.r1': 'Employees', 'biz.calc.lab2': 'Avg. sick days per employee / year', 'biz.calc.r2': 'Sick days', 'biz.calc.lab3': 'Avg. daily cost per employee (PKR)', 'biz.calc.r3': 'Daily cost',
      'biz.calc.cap': 'estimated annual cost of absenteeism, preventive screening helps cut it.',
      'biz.gs.eye': 'Getting started', 'biz.gs.h2': 'Up and running in a day',
      'biz.gs.s1h': 'Register your company', 'biz.gs.s1p': 'Create your company account and start a 30-day free trial, no credit card.', 'biz.gs.s2h': 'Invite your team', 'biz.gs.s2p': 'Send invites or upload a CSV. Employees join with their own private accounts.', 'biz.gs.s3h': 'See wellness insights', 'biz.gs.s3p': 'Track aggregate trends and proactive alerts, individual results stay private.',
      'biz.t.eye': 'From a pilot', 'biz.t.h2': '"The aggregate dashboard helped us spot trends early and plan screening drives, without ever seeing anyone\'s private results."', 'biz.t.who': 'HR Lead, Pilot company (Islamabad)',
      'biz.cta.h': 'Invest in your team\'s health', 'biz.cta.p': 'Start a 30-day free trial, or book a 15-minute demo to see the HR dashboard.', 'biz.cta.b1': 'Register your company', 'biz.cta.b2': 'Book a demo',
      'ab.story.eye': 'The story', 'ab.story.h2': 'Built for people who were handed a report and left to guess.', 'ab.story.lead': 'Too many people walk out of a lab with a printout full of acronyms and arrows, and no idea what it means for them. They Google in a panic, or do nothing until it\'s serious.', 'ab.story.p2': 'PulsingLabs closes that gap: book in minutes, get every result explained in plain English (or chat with the AI in Urdu), see exactly where you stand against age- and sex-aware ranges, and track how you trend over time, for you and your whole family.',
      'ab.val.eye': 'What we stand for', 'ab.val.h2': 'Our principles',
      'ab.v1h': 'Clinically grounded', 'ab.v1p': 'Reference ranges follow evidence-based guidelines (ADA, AASLD, WHO, NICE and more), tuned to age, sex and pregnancy, verified by a cross-engine test suite.',
      'ab.v2h': 'Privacy by default', 'ab.v2p': 'Your results are yours. Encrypted in transit, never sold, and for companies only ever shown as anonymised aggregates.',
      'ab.v3h': 'Built for everyone', 'ab.v3p': 'The AI assistant chats in Urdu or English, understanding your results shouldn\'t depend on which language you\'re comfortable in.',
      'ab.v4h': 'Clarity over jargon', 'ab.v4p': 'Every explanation is written to be understood, calm, plain, and actionable, never alarming.',
      'ab.v5h': 'Whole-family care', 'ab.v5p': 'One account covers parents, kids and spouse, so a family\'s health lives in one place.',
      'ab.v6h': 'Safety first', 'ab.v6p': 'The AI assistant escalates urgent symptoms to emergency guidance and never gives unsafe dosing advice.',
      'ab.num.eye': 'By the numbers', 'ab.num.h2': 'A platform that does a lot.',
      'ab.n1': 'curated blood-test packages', 'ab.n2': 'clinical test cases keeping our engines honest', 'ab.n3': 'organ systems tracked, from heart to thyroid', 'ab.n4': 'your data is yours, never sold',
      'ab.cta.h': 'Join us on the mission', 'ab.cta.p': 'Understand your health, and help the people you care about understand theirs.', 'ab.cta.btn': 'Get Started <span class="arrow">→</span>',
      'ins.feat.eye': 'Featured guide', 'ins.feat.h2': 'What your HbA1c really tells you', 'ins.feat.p': 'The diabetes marker everyone talks about, what the numbers mean, and what to do at each level.',
      'ins.dGuide': 'Guide', 'ins.dHowto': 'How-to', 'ins.dFamily': 'Family',
      'ins.a1h': 'Cholesterol, decoded', 'ins.a1p': 'LDL, HDL, triglycerides, which numbers matter and how to move them in the right direction.',
      'ins.a2h': 'Why Vitamin D matters', 'ins.a2p': 'Low Vitamin D is common and easy to miss. How to read your level and act on it.',
      'ins.a3h': 'Understanding your thyroid (TSH)', 'ins.a3p': 'What TSH, T3 and T4 mean, and the signs worth a follow-up test.',
      'ins.a4h': 'Reading a Complete Blood Count', 'ins.a4p': 'Haemoglobin, RBC, WBC and platelets, a calm walkthrough of the most common panel.',
      'ins.a5h': 'Preparing for a fasting blood test', 'ins.a5p': 'What "fasting" really means, how long, and what you can still do beforehand.',
      'ins.a6h': 'Health checks by age', 'ins.a6p': 'Which screenings make sense in your 20s, 30s, 40s and beyond, for the whole family.',
      'ins.nl.eye': 'Stay in the loop', 'ins.nl.h2': 'Get launch updates & health tips', 'ins.nl.p': 'Occasional emails about new features and understanding your health. No spam.', 'ins.nl.btn': 'Subscribe', 'ins.nl.ok': 'Thanks, you are on the list!', 'ins.nl.err': 'Could not subscribe right now. Please try again later.',
      'fq.s1.eye': 'Using PulsingLabs', 'fq.s2.eye': 'Results & AI', 'fq.s3.eye': 'Privacy & billing',
      'fq.u1q': 'How do I book a test?', 'fq.u1a': 'Pick a package, choose a partner lab or home collection, select a slot, and confirm. You can pay online or at the lab. The whole flow takes a couple of minutes.',
      'fq.u2q': 'Do you offer home sample collection?', 'fq.u2a': 'Yes, a certified phlebotomist visits your home at your chosen time. Your results flow into the app just like an in-lab visit.',
      'fq.u3q': 'Can I import results from another lab?', 'fq.u3a': 'Yes. Snap a photo or upload a PDF of any lab report and PulsingLabs reads the values (you confirm them), so they join your trends and charts.',
      'fq.u4q': 'Can I manage my family\'s health too?', 'fq.u4a': 'Yes. Add profiles for parents, kids and your spouse, each with age- and sex-aware reference ranges, all from one account.',
      'fq.u5q': 'Is the app available in Urdu?', 'fq.u5a': 'The app itself is in English, but the AI health assistant can chat with you in Urdu if you prefer.',
      'fq.r1q': 'How are my results explained?', 'fq.r1a': 'Each marker is plotted on a clinical zone chart (Normal / Borderline / High) tuned to your age and sex, with a plain-English explanation. The AI assistant can answer follow-up questions in everyday language.',
      'fq.r2q': 'Are the reference ranges trustworthy?', 'fq.r2a': 'They follow evidence-based guidelines (ADA, AASLD, WHO, NICE and others), differentiated by age, sex and pregnancy, and are kept honest by an 85-case clinical test suite.',
      'fq.r3q': 'Can the AI give me medical advice?', 'fq.r3a': 'It explains your results and general next steps, but it never prescribes drugs or doses, and it escalates urgent symptoms to emergency guidance. It is a guide, not a replacement for your doctor.',
      'fq.p1q': 'Is my health data private?', 'fq.p1a': 'Yes. Your results are private to your account, encrypted in transit, and never sold. For companies, employees\' individual results are never visible to HR, only anonymised aggregate trends.',
      'fq.p2q': 'What does it cost?', 'fq.p2a': 'The app is free for individuals, you pay only for the test packages you book. Companies pay a flat PKR 1,500 per active employee per month after a 30-day free trial. See <a href="pricing.html" style="color:var(--teal-d);font-weight:700;">pricing</a>.',
      'fq.p3q': 'Can I export or delete my data?', 'fq.p3a': 'Yes. You can export your full account and results anytime, and request deletion, your data belongs to you.',
      'fq.cta.h': 'Still have a question?', 'fq.cta.p': 'Our team is happy to help, usually within one business day.', 'fq.cta.btn': 'Contact us <span class="arrow">→</span>',
      'ct.ch.eye': 'Reach us directly', 'ct.ch.h2': 'Channels',
      'ct.ch1t': 'General & support', 'ct.ch2t': 'Corporate sales & demos', 'ct.ch3t': 'Labs & clinic partnerships',
      'ct.madeIn': 'Made with care in Pakistan',
      'ct.form.h': 'Send us a message', 'ct.form.sub': 'Tell us a bit about what you need and we will get back to you.',
      'ct.lbl.name': 'Full name', 'ct.lbl.email': 'Email', 'ct.lbl.company': 'Company (optional)', 'ct.lbl.interest': 'I am interested in', 'ct.lbl.msg': 'Message',
      'ct.ph.name': 'Your name', 'ct.ph.company': 'Company name', 'ct.ph.msg': 'How can we help?',
      'ct.opt1': 'Booking a corporate demo', 'ct.opt2': 'Lab / clinic partnership', 'ct.opt3': 'General question', 'ct.opt4': 'Support',
      'ct.form.btn': 'Send message <span class="arrow">→</span>', 'ct.form.ok': 'Thanks, your message is on its way! We will be in touch shortly.', 'ct.form.err': 'Something went wrong. Please email contact@pulsinglabs.com.',
      'ct.cta.h': 'Prefer to just try it?', 'ct.cta.p': 'Download PulsingLabs and start understanding your results in minutes, no demo needed.', 'ct.cta.btn': 'Get the app <span class="arrow">→</span>'
    }
  };
  function tr(key) { return (I18N.en[key] != null) ? I18N.en[key] : null; }
  function applyLang() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n')); if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n-html')); if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n-ph')); if (v != null) el.setAttribute('placeholder', v);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Build header + footer                                              */
  /* ------------------------------------------------------------------ */
  function buildHeader() {
    var KEY = { 'Home': 'nav.home', 'Features': 'nav.features', 'For Business': 'nav.business', 'Pricing': 'nav.pricing', 'Insights': 'nav.insights', 'About': 'nav.about', 'Contact': 'nav.contact' };
    var links = NAV.map(function (n, ni) {
      var active = (n.href === page) ? ' active' : '';
      var k = KEY[n.label] || '';
      var di = k ? ' data-i18n="' + k + '"' : '';
      if (!n.mega) {
        return '<a class="nav-link' + active + '" href="' + n.href + '"' + di + '>' + n.label + '</a>';
      }
      var cells = n.mega.items.map(function (it, ii) {
        return '<a class="mega-item" href="' + it.href + '">' +
                 '<span class="mi-title" data-i18n="mm.' + ni + '.' + ii + 't">' + it.title + '</span>' +
                 '<span class="mi-desc" data-i18n="mm.' + ni + '.' + ii + 'd">' + it.desc + '</span>' +
               '</a>';
      }).join('');
      return '<div class="has-mega">' +
               '<a class="nav-link' + active + '" href="' + n.href + '"><span' + di + '>' + n.label + '</span> <span class="caret">▾</span></a>' +
               '<div class="mega"><div class="wrap mega-inner">' +
                 '<div class="mega-blurb"><span class="eyebrow"' + di + '>' + n.label + '</span><p data-i18n="mm.' + ni + '.b">' + n.mega.blurb + '</p>' +
                   '<a class="btn btn-ghost" href="' + n.href + '"><span data-i18n="mega.viewAll">View all</span> <span class="arrow">→</span></a></div>' +
                 '<div class="mega-grid">' + cells + '</div>' +
               '</div></div>' +
             '</div>';
    }).join('');

    var html =
      '<header class="nav" id="siteNav"><div class="wrap nav-inner">' +
        '<a href="index.html" class="logo"><span class="dot">' + LOGO_SVG + '</span>PulsingLabs</a>' +
        '<nav class="nav-links" id="navLinks">' + links +
          // Drawer-only extra (hidden on desktop): primary CTA, since the
          // header version is hidden on small screens.
          '<a class="btn btn-primary drawer-cta" href="' + ctaDest('app') + '" data-i18n="cta.getStarted">Get Started</a>' +
        '</nav>' +
        '<div class="nav-cta">' +
          '<a class="btn btn-primary" href="' + ctaDest('app') + '" data-i18n="cta.getStarted">Get Started</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div></header>' +
      '<div class="nav-backdrop" id="navBackdrop"></div>';

    var host = document.getElementById('site-header');
    if (host) host.outerHTML = html; else document.body.insertAdjacentHTML('afterbegin', html);
  }

  // Mega footer: a rounded dark "sheet" with a glowing teal horizon that
  // slides over the page; a giant statement headline that sharpens from a
  // blur as you arrive; three glass cards (connect / giant menu / newsletter).
  function buildFooter() {
    var html =
      // NOTE: class must NOT be "mega" — that's the header dropdown's class,
      // whose CSS would hide the footer (visibility:hidden until hover).
      '<footer class="site mf">' +
        '<div class="mf-horizon" aria-hidden="true"></div>' +
        '<div class="wrap">' +
        '<h2 class="mf-headline" id="mfHeadline" data-i18n="foot.head">Take charge of your health today.</h2>' +
        '<div class="mf-cards">' +
          '<div class="mf-card mf-connect reveal">' +
            '<span class="mf-eyebrow" data-i18n="foot.connect">Connect with us</span>' +
            '<p class="mf-big" data-i18n="foot.connectSub">Questions, partnerships, or ready to start? We reply fast.</p>' +
            '<div class="mf-ctas">' +
              '<a class="btn btn-primary" href="' + ctaDest('app') + '" data-magnetic><span data-i18n="foot.openApp">Open the App</span> <span class="arrow">→</span></a>' +
              '<a class="btn btn-ghost mf-ghost" href="contact.html" data-i18n="foot.demo">Book a demo</a>' +
            '</div>' +
          '</div>' +
          '<div class="mf-card mf-menu reveal d1">' +
            '<span class="mf-eyebrow" data-i18n="foot.menu">Menu</span>' +
            '<nav class="mf-links">' +
              '<a href="features.html" data-i18n="nav.features">Features</a>' +
              '<a href="business.html" data-i18n="nav.business">For Business</a>' +
              '<a href="pricing.html" data-i18n="nav.pricing">Pricing</a>' +
              '<a href="insights.html" data-i18n="nav.insights">Insights</a>' +
              '<a href="about.html" data-i18n="nav.about">About</a>' +
              '<a href="contact.html" data-i18n="nav.contact">Contact</a>' +
            '</nav>' +
          '</div>' +
          '<div class="mf-card mf-touch reveal d2">' +
            '<span class="mf-eyebrow" data-i18n="foot.touch">Let\'s stay in touch</span>' +
            '<p class="mf-big" data-i18n="foot.touchSub">Health tips and product news, once a month, no spam.</p>' +
            '<form data-newsletter class="mf-nl" novalidate>' +
              '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="mf-hp" />' +
              '<input type="email" required placeholder="you@email.com" data-i18n-ph="foot.nlPh" aria-label="Email" />' +
              '<button class="btn btn-primary" type="submit" data-i18n="foot.nlBtn">Subscribe</button>' +
              '<span class="ok-msg" data-i18n="foot.nlOk">Subscribed, see you in your inbox.</span>' +
              '<span class="err-msg" data-i18n="foot.nlErr">That did not work, try again.</span>' +
            '</form>' +
          '</div>' +
        '</div>' +
        '<div class="foot-bottom mf-bottom">' +
          '<span class="mf-logo">' + LOGO_SVG + ' PulsingLabs</span>' +
          '<span>© <span id="yr"></span> PulsingLabs · <a href="privacy.html" data-i18n="foot.privacy">Privacy</a> · <a href="faq.html" data-i18n="foot.faq">FAQ</a> · <a href="mailto:muneeb@pulsinglabs.com" data-i18n="foot.labs">Labs &amp; clinics</a></span>' +
          '<span data-i18n="foot.made">Made with care in Pakistan</span>' +
        '</div>' +
      '</div></footer>';

    var host = document.getElementById('site-footer');
    if (host) host.outerHTML = html; else document.body.insertAdjacentHTML('beforeend', html);
    var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  }

  /* Footer reveal: the sheet rises as a DOME (top arc of a circle) that
     progressively flattens into the rounded rectangle as it enters, and the
     statement headline sharpens out of a blur. */
  function bindFooterReveal() {
    var h = document.getElementById('mfHeadline');
    var f = document.querySelector('footer.site.mf');
    if (!h || !f) return;
    if (reducedMotion()) return;
    var ticking = false;
    function clamp01(v) { return Math.max(0, Math.min(1, v)); }
    function upd() {
      ticking = false;
      var vh = window.innerHeight;

      // Shape morph: driven by how far the footer's top has risen.
      var fr = f.getBoundingClientRect();
      var ps = clamp01((vh - fr.top) / (vh * 0.85));
      var ease = 1 - Math.pow(1 - ps, 2);
      var hr = fr.width * 0.5 + (42 - fr.width * 0.5) * ease; // half-circle -> 42px
      var vr = 300 + (42 - 300) * ease;                        // deep dome -> 42px
      f.style.borderRadius = hr.toFixed(0) + 'px ' + hr.toFixed(0) + 'px 0 0 / ' +
                             vr.toFixed(0) + 'px ' + vr.toFixed(0) + 'px 0 0';

      // Headline blur-in.
      var r = h.getBoundingClientRect();
      var p = clamp01((vh - r.top) / (vh * 0.55));
      h.style.opacity = (0.15 + 0.85 * p).toFixed(3);
      h.style.filter = 'blur(' + ((1 - p) * 14).toFixed(1) + 'px)';
      h.style.transform = 'translateY(' + ((1 - p) * 46).toFixed(1) + 'px)';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
    upd();
  }

  /* ------------------------------------------------------------------ */
  /* Page-transition curtain                                            */
  /* ------------------------------------------------------------------ */
  var curtain;
  function buildCurtain() {
    curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.innerHTML = '<div class="pc-logo">' + LOGO_SVG + ' PulsingLabs</div>';
    document.body.appendChild(curtain);
  }

  function reveal() {
    // entrance: curtain starts covering then lifts away
    curtain.classList.add('cover');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('loaded');
        curtain.classList.remove('cover');
        curtain.classList.add('reveal');
        setTimeout(function () { curtain.classList.remove('reveal'); }, 650);
      });
    });
  }

  function isInternal(a) {
    if (!a) return false;
    var href = a.getAttribute('href') || '';
    if (a.target === '_blank' || href === '' || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|https?:)/i.test(href)) return false;
    return /\.html(\?|#|$)/.test(href) || href === 'index.html';
  }

  function bindCurtainNav() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!isInternal(a)) return;
      var href = a.getAttribute('href');
      // same page? ignore
      if (href === page) { e.preventDefault(); return; }
      e.preventDefault();
      curtain.classList.remove('reveal');
      curtain.classList.add('cover');
      setTimeout(function () { window.location.href = href; }, 520);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Sticky nav + mobile menu + scroll progress                         */
  /* ------------------------------------------------------------------ */
  function bindNav() {
    var nav = document.getElementById('siteNav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    var backdrop = document.getElementById('navBackdrop');
    var bar = document.querySelector('.scroll-bar');

    // Auto-hide header: slides up on scroll-down, reappears on scroll-up.
    // Skipped entirely under reduced-motion (header just stays put).
    var hideEnabled = !reducedMotion();
    var lastY = window.scrollY || document.documentElement.scrollTop;
    var REVEAL_TOP = 80; // always visible near the top, no flicker on load

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (nav) nav.classList.toggle('scrolled', y > 12);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      if (hideEnabled && nav) {
        // never hide while the mobile drawer or a mega dropdown is in use
        var menuOpen = (links && links.classList.contains('open')) ||
                       document.body.classList.contains('mega-open') ||
                       nav.querySelector('.has-mega.open');
        if (y <= REVEAL_TOP || y < lastY || menuOpen) {
          nav.classList.remove('nav-hidden');
        } else if (y > lastY) {
          nav.classList.add('nav-hidden');
        }
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var mobileMq = window.matchMedia('(max-width: 960px)');

    function closeMenu() {
      if (links) links.classList.remove('open');
      if (toggle) toggle.classList.remove('open');
      if (backdrop) backdrop.classList.remove('show');
      document.body.classList.remove('menu-open');
    }
    if (toggle) toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open); // scroll lock + solid header
      if (backdrop) backdrop.classList.toggle('show', open);
    });
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    if (links) {
      // In the drawer, tapping a section-with-children ("Features ▾") toggles
      // its accordion instead of navigating; its child links still navigate.
      links.querySelectorAll('.has-mega > .nav-link').forEach(function (pl) {
        pl.addEventListener('click', function (e) {
          if (!mobileMq.matches) return; // desktop: hover mega + normal navigation
          e.preventDefault();
          var host = pl.parentElement;
          links.querySelectorAll('.has-mega.m-open').forEach(function (o) {
            if (o !== host) o.classList.remove('m-open');
          });
          host.classList.toggle('m-open');
        });
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          // accordion parents keep the drawer open on mobile
          if (mobileMq.matches && a.classList.contains('nav-link') && a.closest('.has-mega')) return;
          closeMenu();
        });
      });
    }

    // Dev hook: ?menudebug opens the drawer on load (headless screenshots).
    if (/menudebug/.test(location.search) && toggle) toggle.click();
  }

  /* ------------------------------------------------------------------ */
  /* Mega-menu (hover dropdown + page backdrop)                         */
  /* ------------------------------------------------------------------ */
  function bindMega() {
    var megas = document.querySelectorAll('.has-mega');
    if (!megas.length) return;
    var backdrop = document.createElement('div');
    backdrop.className = 'mega-backdrop';
    document.body.appendChild(backdrop);
    var hideTimer, isTouch = window.matchMedia('(hover: none)').matches;

    megas.forEach(function (el) {
      if (isTouch) return; // on touch the slide-out menu shows children inline
      el.addEventListener('mouseenter', function () {
        clearTimeout(hideTimer);
        el.classList.add('open');
        document.body.classList.add('mega-open');
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('open');
        hideTimer = setTimeout(function () {
          if (!document.querySelector('.has-mega:hover')) document.body.classList.remove('mega-open');
        }, 130);
      });
    });
    backdrop.addEventListener('mouseenter', function () { document.body.classList.remove('mega-open'); });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal (IntersectionObserver)                               */
  /* ------------------------------------------------------------------ */
  function bindReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-zoom');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    // Pre-trigger well below the fold so content is already revealed by the time
    // the user scrolls to it (fixes the "waiting for content to appear" lag).
    // Touch scrolling flings much faster than wheel: pre-reveal further below
    // the fold so content never appears "missing" mid-fling.
    var pre = window.matchMedia('(hover: none)').matches ? '48%' : '22%';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px ' + pre + ' 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Animated counters                                                  */
  /* ------------------------------------------------------------------ */
  function bindCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count),
            suffix = el.dataset.suffix || '', prefix = el.dataset.prefix || '',
            dur = 1400, start = null, dec = (target % 1 !== 0) ? 1 : 0;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          el.textContent = prefix + (dec ? v.toFixed(1) : Math.round(v).toLocaleString('en-US')) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------ */
  /* 3D tilt on cards                                                   */
  /* ------------------------------------------------------------------ */
  function bindTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    var set = new Set();
    document.querySelectorAll('[data-tilt], .card, .b-tile').forEach(function (el) { set.add(el); });
    set.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * 10).toFixed(2) + 'deg) rotateX(' + (-py * 10).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Magnetic buttons                                                   */
  /* ------------------------------------------------------------------ */
  function bindMagnetic() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.25) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.35) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Theme crossfade, whole screen + fonts slowly shift light<->dark   */
  /* A dark band centred in the viewport flips the page to the dark     */
  /* theme; CSS transitions (~0.85s) do the smooth crossfade.           */
  /* ------------------------------------------------------------------ */
  function bindTheme() {
    // full-screen background layer (colour driven by the --pg-bg theme var)
    var fx = document.createElement('div'); fx.id = 'bgfx'; document.body.appendChild(fx);

    var root = document.documentElement;
    var darkEls = document.querySelectorAll('.s-dark, .dark');
    if (!darkEls.length) return;

    // SCROLL-PROGRESSIVE crossfade (owner request — no hard flip): the page
    // dims gradually as a dark band approaches the viewport centre, is fully
    // dark inside it, and brightens gradually on the way out. The three theme
    // tokens are interpolated inline each frame (inline style always beats the
    // .theme-dark class values); the class still toggles at the halfway point
    // for any styles keyed off it beyond the tokens.
    var LIGHT = { bg: [244, 239, 231], fg: [20, 51, 46],    muted: [91, 107, 122] };
    var DARK  = { bg: [14, 37, 34],    fg: [236, 230, 218], muted: [173, 185, 186] };

    // Short consumer transition so colours track the scroll position closely
    // (the long .85s crossfade only made sense for the old binary flip).
    root.style.setProperty('--theme-ms', '160ms');

    function mix(a, b, t) {
      return Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
             Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
             Math.round(a[2] + (b[2] - a[2]) * t);
    }

    var ticking = false;
    function apply() {
      ticking = false;
      var vh = window.innerHeight, center = vh / 2, ramp = vh * 0.6;
      var t = 0;
      darkEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.height < 2) return; // hidden/empty bands never dim the page
        var dist = r.top > center ? r.top - center : (r.bottom < center ? center - r.bottom : 0);
        var k = 1 - Math.min(Math.max(dist / ramp, 0), 1);
        if (k > t) t = k;
      });
      var e = t * t * (3 - 2 * t); // smoothstep — gentle at both ends
      root.style.setProperty('--pg-bg', mix(LIGHT.bg, DARK.bg, e));
      root.style.setProperty('--pg-fg', mix(LIGHT.fg, DARK.fg, e));
      root.style.setProperty('--pg-muted', mix(LIGHT.muted, DARK.muted, e));
      root.classList.toggle('theme-dark', e >= 0.5);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply(); // initial state synchronously (no light flash on dark-hero pages)
  }

  /* ------------------------------------------------------------------ */
  /* Testimonials carousel                                              */
  /* ------------------------------------------------------------------ */
  function bindCarousel() {
    var track = document.getElementById('ttrack');
    if (!track) return;
    var slides = track.children.length, dotsWrap = document.getElementById('tdots'), idx = 0, auto;
    for (var i = 0; i < slides; i++) { var d = document.createElement('span'); d.dataset.i = i; if (i === 0) d.className = 'active'; dotsWrap.appendChild(d); }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (el, i) { el.className = i === idx ? 'active' : ''; });
    }
    var next = document.getElementById('tnext'), prev = document.getElementById('tprev');
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    dotsWrap.addEventListener('click', function (e) { if (e.target.dataset.i) go(+e.target.dataset.i); });
    function play() { auto = setInterval(function () { go(idx + 1); }, 6000); }
    play();
    track.parentElement.addEventListener('mouseenter', function () { clearInterval(auto); });
    track.parentElement.addEventListener('mouseleave', play);
  }

  /* ------------------------------------------------------------------ */
  /* ROI calculator                                                     */
  /* ------------------------------------------------------------------ */
  function bindCalc() {
    var emp = document.getElementById('emp'), days = document.getElementById('days'), cost = document.getElementById('cost');
    if (!emp) return;
    function fmt(n) { return n.toLocaleString('en-US'); }
    function calc() {
      document.getElementById('empVal').textContent = fmt(+emp.value);
      document.getElementById('daysVal').textContent = days.value;
      document.getElementById('costVal').textContent = fmt(+cost.value);
      document.getElementById('roiTotal').textContent = 'PKR ' + fmt((+emp.value) * (+days.value) * (+cost.value));
    }
    [emp, days, cost].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }

  /* ------------------------------------------------------------------ */
  /* Generic "thank you" form stubs                                     */
  /* ------------------------------------------------------------------ */
  function bindForms() {
    document.querySelectorAll('form[data-stub]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = f.querySelector('.ok-msg'); if (ok) ok.style.display = 'block';
        f.querySelectorAll('input,textarea').forEach(function (i) { if (i.type !== 'submit') i.value = ''; });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Motion helpers (premium feel)                                      */
  /* ------------------------------------------------------------------ */
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Lenis smooth (inertia) scrolling — loaded from CDN, degrades to native */
  function bindLenis() {
    if (reducedMotion()) return;
    if (window.matchMedia('(hover: none)').matches) return; // keep native momentum on touch
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    // Subresource Integrity — reject the script if the CDN ever serves tampered bytes.
    s.integrity = 'sha384-B2WBjDzEjJpYvhmi2UyEn7rektqkf5suS6sNoyyrf0EBAwBHdkiXxIlU0V5Ru2ed';
    s.crossOrigin = 'anonymous';
    s.onload = function () {
      if (typeof Lenis === 'undefined') return;
      var lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1 });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      window.__lenis = lenis;
    };
    s.onerror = function () { /* offline / blocked: native scroll remains */ };
    document.head.appendChild(s);
  }

  /* Split target headlines into words for a staggered blur-rise reveal */
  function splitWords(el) {
    if (el.getAttribute('data-split') === 'done') return;
    var nodes = Array.prototype.slice.call(el.childNodes), out = [];
    nodes.forEach(function (n) {
      if (n.nodeType === 3) { // text node
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (p === '' || /^\s+$/.test(p)) { out.push(document.createTextNode(p)); }
          else { var s = document.createElement('span'); s.className = 'w'; s.textContent = p; out.push(s); }
        });
      } else if (n.tagName === 'BR') {
        out.push(n);
      } else { // inline element (e.g. .grad-text) — keep intact as one animated unit
        var w = document.createElement('span'); w.className = 'w'; w.appendChild(n.cloneNode(true)); out.push(w);
      }
    });
    while (el.firstChild) el.removeChild(el.firstChild);
    out.forEach(function (n) { el.appendChild(n); });
    var i = 0;
    el.querySelectorAll('.w').forEach(function (w) { w.style.setProperty('--wi', i++); });
    el.setAttribute('data-split', 'done');
  }
  function splitHeadlines() {
    if (reducedMotion()) return;
    var heads = document.querySelectorAll('.hero h1, .page-hero h1, .split-copy h2');
    if (!heads.length) return;
    heads.forEach(splitWords);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('split-in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* Film grain overlay (fixed, subtle) */
  function addGrain() {
    if (document.getElementById('grain')) return;
    var g = document.createElement('div'); g.id = 'grain'; document.body.appendChild(g);
  }

  /* Pointer-tracking spotlight glow inside cards & bento tiles */
  function bindSpotlight() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.card, .b-tile').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Clip-path wipe reveal on photographic media panels */
  function bindImgFade() {
    // Photos fade in the moment their bytes finish arriving, instead of
    // painting scanline-by-scanline on slow connections (owner bug report:
    // result.jpeg visibly streamed top-to-bottom on first load). Opacity
    // only, gated behind html.imgfade so no-JS/reduced-motion users simply
    // see images normally. Runs on ALL devices including touch.
    if (reducedMotion()) return;
    var imgs = document.querySelectorAll('img.media-img, img.scene-img, img.sec-bg-img');
    if (!imgs.length) return;
    document.documentElement.classList.add('imgfade');
    imgs.forEach(function (img) {
      var done = function () { img.classList.add('ld'); };
      if (img.complete && img.naturalWidth > 0) { done(); return; }
      img.addEventListener('load', done);
      img.addEventListener('error', done); // never leave a broken img invisible
    });
    // Safety net: whatever happens (cache oddities, decode stalls), nothing
    // stays invisible for more than 3s.
    setTimeout(function () { imgs.forEach(function (i) { i.classList.add('ld'); }); }, 3000);
  }

  function bindClipReveal() {
    // Touch devices skip the wipe entirely (html.anim never added, so photos
    // are simply visible): a missed IntersectionObserver tick during a fast
    // fling left whole panels clipped to nothing = big blank gaps on phones.
    if (reducedMotion() || window.matchMedia('(hover: none)').matches) return;
    var els = document.querySelectorAll('.media.photo');
    if (!els.length) return;
    document.documentElement.classList.add('anim');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('shown'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (e) { io.observe(e); });
    // Safety net: Lenis-driven smooth scroll can let a panel cross the
    // visibility threshold between observer callbacks without ever firing
    // (seen across multiple photo panels sitewide, not just one card) —
    // force-reveal anything still hidden once it's plainly on screen, using
    // plain geometry checks as a backup to IntersectionObserver.
    function sweep() {
      els.forEach(function (e) {
        if (e.classList.contains('shown')) return;
        var r = e.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('shown');
      });
    }
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    setTimeout(sweep, 400);
    setTimeout(sweep, 1500);
  }

  /* ------------------------------------------------------------------ */
  /* Custom cursor (dot + lagging ring), desktop fine-pointer only      */
  /* ------------------------------------------------------------------ */
  function bindCursor() {
    if (reducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.documentElement.classList.add('cursor-on');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function raf() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    })();
    var HOV = 'a, button, [data-magnetic], .b-tile, .card, .ai-chip, summary, .tnav button, input, textarea, select, .mega-item';
    document.addEventListener('mouseover', function (e) { if (e.target.closest && e.target.closest(HOV)) document.documentElement.classList.add('cursor-hover'); });
    document.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest(HOV)) document.documentElement.classList.remove('cursor-hover'); });
    document.addEventListener('mousedown', function () { document.documentElement.classList.add('cursor-down'); });
    document.addEventListener('mouseup', function () { document.documentElement.classList.remove('cursor-down'); });
    document.documentElement.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.documentElement.addEventListener('mouseenter', function () { dot.style.opacity = ''; ring.style.opacity = ''; });
  }

  /* ------------------------------------------------------------------ */
  /* Hero particle constellation (canvas), reacts to the pointer        */
  /* ------------------------------------------------------------------ */
  function bindParticles() {
    if (reducedMotion()) return;
    var canvas = document.getElementById('hero-particles');
    if (!canvas || !canvas.getContext) return;
    var host = canvas.parentElement, ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], mouse = { x: null, y: null }, raf = null, running = false;
    function size() {
      var r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(22, Math.min(64, Math.round(w * h / 17000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
      }
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      var i, j, a, b, dx, dy, d, al;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i]; a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.7, 0, 6.283); ctx.fillStyle = 'rgba(0,150,136,.55)'; ctx.fill();
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
          if (d < 13500) {
            al = (1 - d / 13500) * .22;
            ctx.strokeStyle = 'rgba(0,191,165,' + al + ')'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.x != null) {
          dx = a.x - mouse.x; dy = a.y - mouse.y; d = dx * dx + dy * dy;
          if (d < 24000) {
            al = (1 - d / 24000) * .5;
            ctx.strokeStyle = 'rgba(0,191,165,' + al + ')'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(step); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    // expose so the 3D helix can retire the 2D layer once WebGL is confirmed
    window.__heroParticles = { stop: stop, el: canvas };
    host.addEventListener('mousemove', function (e) { var r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('mouseleave', function () { mouse.x = mouse.y = null; });
    window.addEventListener('resize', size, { passive: true });
    size(); start();
    // pause when the hero scrolls out of view (battery / CPU)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0 }).observe(host);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Mouse-depth parallax — [data-depth] layers drift with the pointer  */
  /* ------------------------------------------------------------------ */
  function bindDepth() {
    if (reducedMotion()) return;
    if (window.matchMedia('(hover: none)').matches) return;
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    if (!layers.length) return;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    window.addEventListener('mousemove', function (e) {
      var ox = (e.clientX - cx) / cx, oy = (e.clientY - cy) / cy; // -1..1
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 0.5;
        el.style.transform = 'translate(' + (ox * d * 16).toFixed(1) + 'px,' + (oy * d * 16).toFixed(1) + 'px)';
      });
    }, { passive: true });
    window.addEventListener('resize', function () { cx = window.innerWidth / 2; cy = window.innerHeight / 2; }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Animated score ring (conic sweep + count-up)                       */
  /* ------------------------------------------------------------------ */
  function bindRing() {
    var ring = document.querySelector('[data-ring]');
    if (!ring) return;
    var target = parseFloat(ring.getAttribute('data-ring')) || 0, num = ring.querySelector('i');
    function run() {
      var start = null, dur = 1700;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3), v = target * eased;
        ring.style.background = 'conic-gradient(var(--teal) 0 ' + v + '%, #E6ECF0 ' + v + '% 100%)';
        if (num) num.textContent = Math.round(v);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    io.observe(ring);
  }

  /* ------------------------------------------------------------------ */
  /* Decode/scramble text reveal ([data-scramble])                      */
  /* ------------------------------------------------------------------ */
  function bindScramble() {
    if (reducedMotion()) return;
    var els = document.querySelectorAll('[data-scramble]');
    if (!els.length) return;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
    els.forEach(function (el) {
      var finalText = el.textContent, len = finalText.length;
      function run() {
        var iter = 0, t = setInterval(function () {
          el.textContent = finalText.split('').map(function (c, i) {
            if (c === ' ') return ' ';
            if (i < iter) return finalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          iter += 0.5;
          if (iter >= len) { clearInterval(t); el.textContent = finalText; }
        }, 34);
      }
      if (!('IntersectionObserver' in window)) { run(); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); io.unobserve(e.target); } });
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Holographic back-to-top with scroll-progress ring                  */
  /* ------------------------------------------------------------------ */
  function bindToTop() {
    var btn = document.createElement('button');
    btn.id = 'to-top'; btn.setAttribute('aria-label', 'Back to top');
    var C = 2 * Math.PI * 23;
    btn.innerHTML =
      '<svg class="prog" viewBox="0 0 52 52"><circle class="trk" cx="26" cy="26" r="23"/>' +
      '<circle class="bar" cx="26" cy="26" r="23" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg>' +
      '<svg class="arr" viewBox="0 0 24 24"><polyline points="6 14 12 8 18 14"/></svg>';
    document.body.appendChild(btn);
    var bar = btn.querySelector('.bar');
    btn.addEventListener('click', function () {
      if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? y / max : 0;
      bar.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
      btn.classList.toggle('show', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------ */
  /* Three.js 3D DNA helix in the hero (CDN, WebGL-gated, 2D fallback)  */
  /* ------------------------------------------------------------------ */
  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  function bind3D() {
    if (reducedMotion()) return;
    // Phones get the helix too (owner request): the geometry is tiny
    // (2x132 points + rungs) — buildHelix trims pixel ratio and centres
    // the group on narrow viewports instead of skipping.
    var hero = document.querySelector('.hero');
    if (!hero || !hasWebGL() || typeof Promise === 'undefined') return;
    // Self-hosted (pinned three@0.160.0) — no third-party CDN dependency, so
    // there's no unpinnable dynamic-import supply-chain surface.
    // NOTE: import() here resolves relative to THIS SCRIPT's URL (/assets/),
    // not the page. './assets/vendor/...' 404'd and silently killed the helix.
    // PERF: the helix is a decorative layer over the 2D particle field, so the
    // 1.2MB engine must never compete with first paint — wait for the full
    // page load, then a browser-idle moment, before fetching it.
    var start = function () {
      import('./vendor/three.module.js')
        .then(function (THREE) { buildHelix(THREE, hero); })
        .catch(function () { /* offline / blocked → the 2D particle field stays */ });
    };
    var whenIdle = function () {
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 1200);
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
  }
  /* model-viewer (~1MB module) powers the holographic body band far below
     the fold — inject it only when the band approaches the viewport. The
     stage has a fixed CSS height, so the late upgrade causes no layout
     shift; the <model-viewer> GLB itself stays loading="lazy". */
  function bindModelViewerLoader() {
    var mv = document.querySelector('model-viewer');
    if (!mv) return;
    var injected = false;
    var inject = function () {
      if (injected) return; injected = true;
      var s = document.createElement('script');
      s.type = 'module';
      s.src = 'assets/vendor/model-viewer.min.js?v=1';
      document.head.appendChild(s);
    };
    if (!('IntersectionObserver' in window)) { inject(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { inject(); io.disconnect(); } });
    }, { rootMargin: '900px 0px' });
    io.observe(mv);
  }
  function buildHelix(THREE, hero) {
    var canvas = document.createElement('canvas');
    canvas.id = 'hero-3d'; canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    var isTouch = window.matchMedia('(hover: none)').matches;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cam.position.set(0, 0, 15);

    var group = new THREE.Group(); scene.add(group);
    var N = 132, turns = 3.3, R = 3.1, H = 12;
    var posA = [], posB = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1), ang = t * turns * Math.PI * 2, y = (t - 0.5) * H;
      posA.push(Math.cos(ang) * R, y, Math.sin(ang) * R);
      posB.push(Math.cos(ang + Math.PI) * R, y, Math.sin(ang + Math.PI) * R);
    }
    function strand(arr, color, size) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0.8, depthWrite: false }));
    }
    group.add(strand(posA, 0x00BFA5, 0.19));
    group.add(strand(posB, 0x4DEAD0, 0.19));
    // base-pair "rungs"
    var rung = [];
    for (var k = 0; k < N; k += 5) {
      rung.push(posA[k * 3], posA[k * 3 + 1], posA[k * 3 + 2], posB[k * 3], posB[k * 3 + 1], posB[k * 3 + 2]);
    }
    var rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(rung, 3));
    group.add(new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0x00897B, transparent: true, opacity: 0.26 })));
    // faint ambient point dust
    var dust = [];
    for (var d = 0; d < 90; d++) { dust.push((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10); }
    var dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x4DEAD0, size: 0.07, transparent: true, opacity: 0.5, depthWrite: false })));

    group.rotation.z = 0.16;

    function resize() {
      var r = hero.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
      // Wide: bias toward the product mock on the right. Narrow (single
      // column): centre the helix behind the hero copy.
      group.position.x = window.matchMedia('(max-width: 960px)').matches ? 0 : 1.0;
    }
    resize(); window.addEventListener('resize', resize, { passive: true });

    var tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    // retire the 2D particle field now that 3D is confirmed working
    if (window.__heroParticles) { window.__heroParticles.stop(); if (window.__heroParticles.el) window.__heroParticles.el.style.display = 'none'; }
    requestAnimationFrame(function () { canvas.classList.add('lit'); });

    var raf = null, vis = true;
    function loop() {
      group.rotation.y += 0.0034;
      group.rotation.x += (ty * 0.45 - group.rotation.x) * 0.04;
      group.rotation.z += ((0.16 + tx * 0.25) - group.rotation.z) * 0.04;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    }
    loop();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          vis = e.isIntersecting;
          if (vis && !raf) loop();
          else if (!vis && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Holographic body band: cursor parallax on the whole 3D stage.      */
  /* The stage (not the model-viewer camera) tilts toward the cursor,   */
  /* so it never fights model-viewer's own auto-rotate.                 */
  /* ------------------------------------------------------------------ */
  function bindBodyOrbit() {
    var stage = document.querySelector('.body3d-stage');
    if (!stage) return;
    var band = stage.closest('.body3d-band');
    var mv = document.getElementById('mv-body');
    if (!band || !mv) return;
    if (reducedMotion()) { mv.removeAttribute('auto-rotate'); return; }

    // Scrollytelling: YOUR scroll spins the hologram. The camera's yaw is
    // scrubbed to the band's progress through the viewport (about 300deg of
    // rotation across the pass), which reads far more alive than a passive
    // auto-rotate. Drag still works between scrolls.
    mv.removeAttribute('auto-rotate');
    var ticking = false;
    function scrub() {
      ticking = false;
      var r = band.getBoundingClientRect();
      var total = window.innerHeight + r.height;
      var p = 1 - (r.top + r.height) / total; // 0 entering -> 1 leaving
      if (p < 0 || p > 1) return;
      mv.cameraOrbit = (p * 300 - 150).toFixed(1) + 'deg 82deg auto';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(scrub); }
    }, { passive: true });
    scrub();

    // Desktop: the whole stage also tilts toward the cursor.
    if (!window.matchMedia('(hover: none)').matches) {
      band.addEventListener('mousemove', function (e) {
        var r = band.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        stage.style.transform = 'perspective(1100px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 5).toFixed(2) + 'deg)';
      }, { passive: true });
      band.addEventListener('mouseleave', function () { stage.style.transform = ''; });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Kinetic type band: giant outlined text that drifts sideways and    */
  /* skews with scroll VELOCITY (2026 kinetic-typography pattern).      */
  /* ------------------------------------------------------------------ */
  function bindKinetic() {
    var tracks = document.querySelectorAll('[data-kinetic]');
    if (!tracks.length || reducedMotion()) return;
    tracks.forEach(function (track) {
      var x = 0, lastY = window.scrollY || 0, vel = 0, raf = null, vis = true;
      function loop() {
        var y = window.scrollY || 0, dy = y - lastY; lastY = y;
        vel += (dy - vel) * 0.08;
        x -= 0.9 + Math.min(Math.abs(vel) * 0.30, 16);
        var half = track.scrollWidth / 2;
        if (half > 0 && -x >= half) x += half;
        var skew = Math.max(-9, Math.min(9, -vel * 0.25));
        track.style.transform = 'translateX(' + x.toFixed(1) + 'px) skewX(' + skew.toFixed(2) + 'deg)';
        raf = vis ? requestAnimationFrame(loop) : null;
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            vis = e.isIntersecting;
            if (vis && !raf) raf = requestAnimationFrame(loop);
          });
        }, { threshold: 0 }).observe(track.parentElement);
      }
      raf = requestAnimationFrame(loop);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Sticky stacking cards: as the next card slides over the pinned one, */
  /* the covered card scales down and dims (scroll-driven depth).        */
  /* ------------------------------------------------------------------ */
  function bindStack() {
    var wrap = document.querySelector('[data-stack]');
    if (!wrap || reducedMotion()) return;
    if (window.matchMedia('(max-width: 900px)').matches) return; // static on mobile
    var cards = [].slice.call(wrap.children);
    if (cards.length < 2) return;
    var ticking = false;
    var TOP = 74;
    function upd() {
      ticking = false;
      for (var i = 0; i < cards.length - 1; i++) {
        var nt = cards[i + 1].getBoundingClientRect().top;
        var p = 1 - (nt - TOP) / Math.max(window.innerHeight - TOP, 1);
        p = Math.max(0, Math.min(1, p));
        cards[i].style.transform = p > 0 ? 'scale(' + (1 - p * 0.05).toFixed(4) + ')' : '';
        cards[i].style.filter = p > 0 ? 'brightness(' + (1 - p * 0.16).toFixed(3) + ')' : '';
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
    upd();
  }

  /* ------------------------------------------------------------------ */
  /* Live public stats — progressive enhancement over baked-in numbers  */
  /* ------------------------------------------------------------------ */
  function bindLiveStats() {
    if (typeof fetch === 'undefined') return;
    var map = document.querySelectorAll('[data-live]');
    if (!map.length) return;
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 3500);
    fetch(API_BASE + '/public/stats', ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(to);
        if (!data) return;
        map.forEach(function (el) {
          var key = el.getAttribute('data-live');
          if (data[key] == null) return;
          // Live data only ever RAISES the number — never undercuts the curated
          // marketing claim (so a small dev DB can't downgrade "50+" to "3+").
          var floor = parseFloat(el.getAttribute('data-count')) || 0;
          var live = parseFloat(data[key]) || 0;
          el.setAttribute('data-count', Math.max(floor, live));
          el.textContent = '0';
        });
        // re-run counters now that targets are live (idempotent)
        bindCounters();
      })
      .catch(function () { clearTimeout(to); /* keep the static numbers */ });
  }

  /* ------------------------------------------------------------------ */
  /* Lead form → POST /api/leads (honest success/error, never fakes it) */
  /* ------------------------------------------------------------------ */
  function bindLeadForm() {
    if (typeof fetch === 'undefined') return;
    document.querySelectorAll('form[data-lead]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = f.querySelector('.ok-msg'), err = f.querySelector('.err-msg'), btn = f.querySelector('button[type=submit]');
        if (ok) ok.style.display = 'none';
        if (err) err.style.display = 'none';
        function get(sel) { var el = f.querySelector(sel); return el ? el.value.trim() : ''; }
        var hp = f.querySelector('[name=website]');
        var payload = {
          name: get('#cn'), email: get('#ce'), company: get('#cc'),
          interest: get('#ct'), message: get('#cm'), source: 'marketing_contact',
          website: hp ? hp.value : '' // honeypot — empty for humans
        };
        if (!payload.name || !payload.email) {
          if (err) { err.textContent = 'Please enter your name and a valid email.'; err.style.display = 'block'; }
          return;
        }
        var label = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
        fetch(API_BASE + '/leads', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
          .then(function (r) { return r.ok ? r.json() : r.json().then(function (j) { throw new Error(j && j.error || 'Failed'); }); })
          .then(function () {
            if (ok) ok.style.display = 'block';
            f.querySelectorAll('input, textarea').forEach(function (i) { if (i.type !== 'submit') i.value = ''; });
          })
          .catch(function () {
            if (err) { err.textContent = 'Could not reach our server. Please email contact@pulsinglabs.com.'; err.style.display = 'block'; }
          })
          .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Newsletter form → POST /api/newsletter (honest success/error)      */
  /* ------------------------------------------------------------------ */
  function bindNewsletterForm() {
    if (typeof fetch === 'undefined') return;
    document.querySelectorAll('form[data-newsletter]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = f.querySelector('.ok-msg'), err = f.querySelector('.err-msg'), btn = f.querySelector('button[type=submit]');
        if (ok) ok.style.display = 'none';
        if (err) err.style.display = 'none';
        var emailEl = f.querySelector('input[type=email]'), hp = f.querySelector('[name=website]');
        var email = emailEl ? emailEl.value.trim() : '';
        if (!email) { if (err) err.style.display = 'block'; return; }
        var label = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '…'; }
        fetch(API_BASE + '/newsletter', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, source: 'newsletter', website: hp ? hp.value : '' })
        })
          .then(function (r) { return r.ok ? r.json() : r.json().then(function (j) { throw new Error(j && j.error || 'Failed'); }); })
          .then(function () {
            if (ok) ok.style.display = 'block';
            f.querySelectorAll('input').forEach(function (i) { if (i.type !== 'submit') i.value = ''; });
          })
          .catch(function () { if (err) err.style.display = 'block'; })
          .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
      });
    });
  }

  /* Point every [data-cta] link at its real destination (single source: ctaDest). */
  function bindCtas() {
    document.querySelectorAll('a[data-cta]').forEach(function (a) {
      var dest = ctaDest(a.getAttribute('data-cta'));
      if (dest) a.setAttribute('href', dest);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                               */
  /* ------------------------------------------------------------------ */
  function init() {
    // scroll progress bar
    var bar = document.createElement('div'); bar.className = 'scroll-bar'; document.body.appendChild(bar);
    bindTheme();
    buildHeader();
    buildFooter();
    applyLang();
    buildCurtain();
    paintIcons();
    bindNav();
    bindMega();
    bindCurtainNav();
    bindReveal();
    bindCounters();
    bindTilt();
    bindMagnetic();
    bindCarousel();
    bindCalc();
    bindForms();
    bindLeadForm();
    bindNewsletterForm();
    bindCtas();
    addGrain();
    splitHeadlines();
    // bindParallax() and bindScene() intentionally not called: photos on the
    // site must stay static, not drift/expand on scroll.
    bindImgFade();
    bindClipReveal();
    bindSpotlight();
    bindLenis();
    // bindCursor() intentionally not called: keep the normal system pointer,
    // no custom dot/ring cursor.
    bindParticles();
    bind3D();
    bindModelViewerLoader();
    bindBodyOrbit();
    bindKinetic();
    bindStack();
    bindFooterReveal();
    bindDepth();
    bindRing();
    bindScramble();
    bindToTop();
    bindLiveStats();
    reveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
