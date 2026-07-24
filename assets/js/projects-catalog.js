const projects = [
  {
    id: '2022-07-aiparkinscan',
    title: 'AIParkinScan',
    excerpt:
      'Co-developed AIParkinScan software for Parkinson&apos;s diagnosis using audio and image data. Utilized neural networks, spectrograms, and Random Forest algorithm.',
    venue: 'MITxSureStart FutureMakers Create-a-Thon Program',
    venue_tag: 'MITxSureStart',
    permalink: '/projects/aiparkinscan',
    date: '2022-07-31',
    category: 'Research & ML',
    technologies: [
      'Python',
      'TensorFlow',
      'Flask',
      'Scikit-learn',
      'Artificial Intelligence',
      'Machine Learning',
    ],
    github: 'https://github.com/agopalareddy/AIPS',
    demo: null,
    pdf: null,
    presentation:
      'https://docs.google.com/presentation/d/10910WNa3CjiXIcH_T5OIXyOuOTiVKFHr/export/pptx',
    has_detail: true,
    formatted_date: 'Jun 2022 – Aug 2022',
  },
  {
    id: '2022-07-artificial-intelligence-in-modern-board-games',
    title: 'Artificial Intelligence in Modern Board Games',
    excerpt:
      'Built a browser-playable Java Lost Cities game with greedy, minimax, and alpha-beta AI agents that evaluate complete turn outcomes.',
    venue: 'Ohio Wesleyan University',
    venue_tag: 'OWU',
    permalink: '/projects/artificial-intelligence-in-modern-board-games',
    date: '2022-07-25',
    category: 'Web Apps',
    technologies: [
      'Java',
      'HTML',
      'CSS',
      'JavaScript',
      'Artificial Intelligence',
      'OOP',
      'Game Theory',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/LostCities',
    demo: '/lost-cities/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2022 – Aug 2022',
  },
  {
    id: '2022-11-connect-4-ai',
    title: 'Connect 4 AI',
    excerpt: 'Co-developed an AI opponent for Connect 4 using alpha-beta pruning algorithm.',
    venue: 'Ohio Wesleyan University',
    venue_tag: 'OWU',
    permalink: '/projects/connect-4-ai',
    date: '2022-11-30',
    category: 'Web Apps',
    technologies: ['Java', 'HTML', 'CSS', 'JavaScript', 'OOP', 'Artificial Intelligence', 'Git'],
    github: 'https://github.com/agopalareddy/connect-4-ai',
    demo: '/connect4/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2022 – Dec 2022',
  },
  {
    id: '2023-04-artificial-intelligence-opinion-survey',
    title: 'Artificial Intelligence Opinion Survey',
    excerpt:
      'Designed, fielded, and investigated a survey research of 1000 employees to analyze AI&apos;s impact on work efficiency and attitudes. Found AI improved efficiency across industries.',
    venue: 'Ohio Wesleyan University',
    venue_tag: 'OWU',
    permalink: '/projects/artificial-intelligence-opinion-survey',
    date: '2023-04-30',
    category: 'Research & ML',
    technologies: [
      'Research',
      'Data Analysis',
      'R',
      'Tableau',
      'Qualtrics',
      'Prolific',
      'Artificial Intelligence',
      'Statistics',
    ],
    github: 'https://github.com/agopalareddy/ai-opinion-survey',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jan 2023 – May 2023',
  },
  {
    id: '2024-11-php-calendar-app',
    title: 'PHP Calendar Application',
    excerpt:
      'Developed Chronos, a feature-rich personal calendar and event management web app using PHP 8.4 and MySQL, with secure authentication, an interactive month-view dashboard, and a glassmorphic UI.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/php-calendar-app',
    date: '2025-07-15',
    category: 'Web Apps',
    technologies: [
      'PHP',
      'MySQL',
      'HTML',
      'CSS',
      'JavaScript',
      'Web Security',
      'Database Design',
      'Authentication',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/calendar-app',
    demo: '/calendar/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jul 2025',
  },
  {
    id: '2024-11-socketio-chat-app',
    title: 'Socket.IO Multi-Room Chat Application',
    excerpt:
      'Developed a feature-rich multi-room chat application using Node.js and Socket.IO with password-protected rooms, private messaging, and user moderation capabilities.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/socketio-chat-app',
    date: '2024-11-19',
    category: 'Web Apps',
    technologies: [
      'Node.js',
      'Socket.IO',
      'JavaScript',
      'HTML',
      'CSS',
      'Real-time Communication',
      'Web Development',
      'Authentication',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/chat-app',
    demo: '/chat/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2024 – Dec 2024',
  },
  {
    id: '2024-12-datacenter-cooling',
    title: 'Datacenter Cooling Optimization using Deep Reinforcement Learning',
    excerpt:
      'Implemented multiple deep reinforcement learning algorithms (DDQN, PPO, SAC) integrated with EnergyPlus simulations to optimize datacenter cooling systems for improved energy efficiency.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/datacenter-cooling',
    date: '2024-11-30',
    category: 'Research & ML',
    technologies: [
      'Python',
      'PyTorch',
      'EnergyPlus',
      'Gymnasium',
      'Sinergym',
      'NumPy',
      'TensorBoard',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/datacenter-cooling-rl',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2024 – Dec 2024',
  },
  {
    id: '2024-12-interactive-storybook',
    title: 'Interactive Storybook',
    excerpt:
      'Built Tales We Weave, an AI-powered interactive storytelling platform where readers shape branching narratives through choices, with AI-generated text (Google Gemini) and illustrations (fal.ai), built with Vue 3, Express, and MongoDB.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/interactive-storybook',
    date: '2024-11-30',
    category: 'Web Apps',
    technologies: [
      'Vue.js',
      'Pinia',
      'Vue Router',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Google Gemini API',
      'fal.ai',
      'JavaScript',
      'HTML',
      'CSS',
      'AI Integration',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/tales-we-weave',
    demo: '/storybook/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2024 – Dec 2024',
  },
  {
    id: '2024-12-multimodal-alzheimers',
    title: "Multimodal Prediction of Alzheimer's Disease",
    excerpt:
      'Built a multimodal machine learning pipeline combining MRI imaging and clinical data from the OASIS-1 dataset for early Alzheimer&apos;s disease detection.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/multimodal-alzheimers',
    date: '2024-11-30',
    category: 'Research & ML',
    technologies: [
      'Python',
      'Deep Learning',
      'TensorFlow',
      'Keras',
      'PyTorch',
      'Machine Learning',
      'Scikit-learn',
      'XGBoost',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn',
      'Jupyter Notebooks',
    ],
    github: 'https://github.com/agopalareddy/multimodal-alzheimers-prediction',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2024 – Dec 2024',
  },
  {
    id: '2025-05-desperate-housewives-monologues',
    title: 'Desperate Housewives Monologues Dataset',
    excerpt:
      'Extracted and organized monologues from Desperate Housewives for NLP analysis, sentiment analysis, and text-based machine learning projects.',
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/desperate-housewives-monologues',
    date: '2025-05-31',
    category: 'Research & ML',
    technologies: ['Python', 'NLP', 'Text Processing'],
    github: 'https://github.com/agopalareddy/Desperate-Housewives-Monologues',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jan 2025 – May 2025',
  },
  {
    id: '2025-07-bayesian-optimization',
    title: 'Bayesian Optimization for Material and Product Optimization',
    excerpt:
      'Applied Bayesian optimization techniques for hyperparameter tuning and feature optimization across superconductivity, concrete strength, and wine quality prediction problems.',
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/bayesian-optimization',
    date: '2025-07-01',
    category: 'Research & ML',
    technologies: [
      'Python',
      'Jupyter Notebooks',
      'Scikit-learn',
      'Scikit-optimize',
      'XGBoost',
      'NumPy',
      'Pandas',
      'Matplotlib',
      'Seaborn',
    ],
    github: 'https://github.com/agopalareddy/BayesianOptimizationPractice',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2025 – Aug 2025',
  },
  {
    id: '2025-08-google-calendar-sync',
    title: 'Google Calendar Availability Sync',
    excerpt:
      "A Google Apps Script that automatically syncs events from multiple source calendars to a single 'Availability' calendar, creating customizable availability blocks while preserving privacy.",
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/google-calendar-sync',
    date: '2025-08-11',
    category: 'Software & Tools',
    technologies: ['Google Apps Script', 'JavaScript', 'Google Calendar API'],
    github: 'https://github.com/agopalareddy/GoogleCalendarSync',
    demo: '/availability/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2025 – Aug 2025',
  },
  {
    id: '2025-08-mlb-statcast-pipeline',
    title: 'MLB Statcast Real-Time Data Pipeline',
    excerpt:
      'Built a real-time data pipeline for MLB pitch data using Apache Airflow, Snowflake, and Kafka, with an interactive Streamlit dashboard for pitch analysis and visualization.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/mlb-statcast-pipeline',
    date: '2025-10-01',
    category: 'Research & ML',
    technologies: [
      'Python',
      'Apache Airflow',
      'Snowflake',
      'Apache Kafka',
      'Apache Spark',
      'Streamlit',
      'pybaseball',
      'Pandas',
    ],
    github: 'https://github.com/agopalareddy/mlb-statcast-pipeline',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2025 – Dec 2025',
  },
  {
    id: '2025-08-vlm-security',
    title:
      'Red-Blue Visual Auto Defender: Automated Visual Jailbreak Generation and Explainable Defenses',
    excerpt:
      'Built a Red-Blue teaming system for VLM security that automatically generates visual jailbreak attacks and explainable, code-based defenses using OCR and keyword detection.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/vlm-security',
    date: '2025-10-02',
    category: 'Research & ML',
    technologies: [
      'Python',
      'PyTorch',
      'Transformers',
      'Gemma-3',
      'Pillow',
      'OpenCV',
      'OCR',
      'OpenAI API',
      'Anthropic API',
    ],
    github: 'https://github.com/agopalareddy/visual-jailbreak-defense',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2025 – Dec 2025',
  },
  {
    id: '2025-10-hackwashu-databases-workshop',
    title: 'HackWashU Databases Workshop',
    excerpt:
      'Developed and facilitated a hands-on databases workshop teaching SQLite, Supabase, API integration, and full-stack web development through two complete projects.',
    venue: 'Washington University in St. Louis - HackWashU',
    venue_tag: 'WashU',
    permalink: '/projects/hackwashu-databases-workshop',
    date: '2025-09-15',
    category: 'Software & Tools',
    technologies: [
      'Python',
      'SQLite',
      'Supabase',
      'PostgreSQL',
      'JavaScript',
      'HTML',
      'CSS',
      'APIs',
      'Database Design',
    ],
    github: 'https://github.com/agopalareddy/HackWashU-Databases-Workshop',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Sep 2025',
  },
  {
    id: '2025-11-instagram-unfollow-checker',
    title: 'Instagram Unfollow Checker',
    excerpt:
      "A cross-platform GUI application that identifies Instagram accounts you follow that don't follow you back, with session management and 2FA support.",
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/instagram-unfollow-checker',
    date: '2025-06-01',
    category: 'Software & Tools',
    technologies: ['Python', 'Tkinter', 'Instaloader', 'PyInstaller'],
    github: 'https://github.com/agopalareddy/instagram-unfollow-checker',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2025 – Aug 2025',
  },
  {
    id: '2026-04-ms-thesis',
    title:
      'Toward Vehicle-Agnostic Driving Signatures for Cognitive Impairment Prediction from Naturalistic Driving Data',
    excerpt:
      'Master&apos;s thesis investigating whether naturalistic driving data can predict cognitive impairment status across different vehicles, evaluating six modeling approaches on over 26,000 participant-weeks of telematics data from 304 older adults.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/ms-thesis',
    date: '2026-04-01',
    category: 'Research & ML',
    technologies: [
      'Python',
      'PyTorch',
      'Deep Learning',
      'Domain Adaptation',
      'Sequence Modeling',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Git',
    ],
    github: null,
    demo: null,
    pdf: 'https://openscholarship.wustl.edu/cgi/viewcontent.cgi?article=2429&context=eng_etds',
    presentation: null,
    has_detail: true,
    formatted_date: 'Aug 2025 – Apr 2026',
  },
  {
    id: '2026-06-blink-morse-decoder',
    title: 'Blink Morse Decoder',
    excerpt:
      'An accessibility-focused Android app that translates deliberate eye blinks into Morse code text using real-time camera-based facial landmark tracking and a custom blink state machine — enabling hands-free communication without extra hardware.',
    venue: 'CodeTillDawn Hackathon',
    venue_tag: 'Personal',
    permalink: '/projects/blink-morse-decoder',
    date: '2026-06-01',
    category: 'Software & Tools',
    technologies: ['Kotlin', 'Android', 'CameraX', 'SmartSpectra', 'Material 3'],
    github: 'https://github.com/agopalareddy/blink-morse-app',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2026',
  },
  {
    id: '2026-06-speedtest',
    title: 'Speed Test',
    excerpt:
      'A simple, single-page network speed test measuring download speed, upload speed, and ping against the server hosting this site, with live-updating results and connection details.',
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/speedtest',
    date: '2026-06-15',
    category: 'Software & Tools',
    technologies: ['Node.js', 'Express', 'JavaScript', 'Streams API'],
    github: 'https://github.com/agopalareddy/speedtest',
    demo: '/speedtest/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2026',
  },
  {
    id: '2026-06-wellness-companion',
    title: 'AURA: Ambient Wellness Companion',
    excerpt:
      'Built AURA, a privacy-first elderly wellness companion using Google ADK 2.0 multi-agent orchestration and Gemini. Empathetic check-ins, medication compliance tracking, anonymized telemetry, and automatic escalation for critical wellness drops.',
    venue: 'Kaggle Agents for Good Hackathon',
    venue_tag: 'Kaggle',
    permalink: '/projects/wellness-companion',
    date: '2026-06-21',
    category: 'Web Apps',
    technologies: [
      'Python',
      'FastAPI',
      'Google ADK',
      'Gemini',
      'MCP',
      'Multi-agent Systems',
      'JavaScript',
      'HTML',
      'CSS',
    ],
    github: 'https://github.com/agopalareddy/wellness-companion',
    demo: '/wellness/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2026',
  },
  {
    id: '2026-06-env-monitor',
    title: 'Environment Monitor',
    excerpt:
      'An Arduino-based continuous environment monitor using a DHT11 sensor and LCD 1602 display, with rolling EEPROM buffer, dew point calculation, and ambient light sensing.',
    venue: 'Personal Project',
    venue_tag: 'Personal',
    permalink: '/projects/env-monitor',
    date: '2026-06-23',
    category: 'Software & Tools',
    technologies: ['Arduino', 'C++', 'DHT11', 'LCD 1602', 'EEPROM', 'Embedded Systems'],
    github: 'https://github.com/agopalareddy/env-monitor',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Jun 2026',
  },
];
const projectGrid = document.getElementById('projectGrid');
// Clear SSR fallback (noscript + JSON blob) if present. Modern
// browsers re-execute the <noscript> contents as DOM nodes when JS
// is enabled, so we must remove them before the first render.
const ssrFallback = projectGrid.querySelector('noscript, script.projects-data');
if (ssrFallback) {
  ssrFallback.remove();
}
const searchInput = document.getElementById('projectSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const venueFilter = document.getElementById('venueFilter');
const projectSort = document.getElementById('projectSort');
const yearFilter = document.getElementById('yearFilter');
const a11yAnnouncer = document.getElementById('a11y-announcer');

let activeFilter = 'all';
let activeVenue = 'all';
let activeSort = 'date-desc';
let searchQuery = '';
let activeYear = 'all';

// ponytail: tiny DOM helper — keeps the catalog renderers off innerHTML
// (the `no-inner-html-js` linter rule) without dragging in a framework.
// `attrs` keys: class, text, html (only for static fragments), and any
// standard attribute name. Children are nodes or strings.
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    }
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

function octiconNode(key) {
  if (typeof OCTICONS !== 'undefined' && OCTICONS[key]) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(OCTICONS[key], 'image/svg+xml');
    return doc.documentElement;
  }
  return document.createTextNode('');
}

const venueLabels = {
  WashU: 'Washington University in St. Louis',
  OWU: 'Ohio Wesleyan University',
  MITxSureStart: 'MITxSureStart',
  Personal: 'Personal Projects',
};

function getCategoryClass(cat) {
  if (cat === 'Research & ML') return 'cat-research';
  if (cat === 'Web Apps') return 'cat-web';
  if (cat === 'Software & Tools') return 'cat-tools';
  return '';
}

function renderProjects() {
  // 1. Filter
  const filtered = projects.filter((p) => {
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesVenue = activeVenue === 'all' || p.venue_tag === activeVenue;

    const projYear = parseInt(p.date.split('-')[0], 10);
    const matchesYear = activeYear === 'all' || projYear.toString() === activeYear;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q) ||
      p.venue_tag.toLowerCase().includes(q) ||
      (q === 'washu' && p.venue.toLowerCase().includes('washington university')) ||
      (q === 'owu' && p.venue.toLowerCase().includes('ohio wesleyan')) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesVenue && matchesYear && matchesSearch;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    if (activeSort === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    } else if (activeSort === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    } else if (activeSort === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (filtered.length === 0) {
    projectGrid.replaceChildren(
      el(
        'div',
        { class: 'no-results' },
        'No projects match your search or filter criteria.',
        el(
          'button',
          { type: 'button', id: 'clearFiltersBtn', class: 'card-btn btn-detail' },
          'Clear Filters'
        )
      )
    );
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
    renderToc([]);
    if (a11yAnnouncer) a11yAnnouncer.textContent = 'Showing 0 projects.';
    return;
  }

  let lastYear = null;
  const fragment = document.createDocumentFragment();
  filtered.forEach((p) => {
    const year = p.date ? parseInt(p.date.split('-')[0], 10) : null;
    if (year && year !== lastYear) {
      fragment.append(el('h2', { class: 'timeline-year', id: `year-${year}`, text: String(year) }));
      lastYear = year;
    }
    fragment.append(buildProjectCard(p));
  });
  projectGrid.replaceChildren(fragment);

  renderToc(filtered);
  if (a11yAnnouncer) {
    a11yAnnouncer.textContent = `Showing ${filtered.length} project${filtered.length === 1 ? '' : 's'}.`;
  }
}

function buildProjectCard(p) {
  const catClass = getCategoryClass(p.category);
  const venueLabel = venueLabels[p.venue_tag] || p.venue_tag;

  const card = el(
    'div',
    {
      class: 'project-card card-surface timeline-card',
      id: `proj-${p.id}`,
    },
    el('span', { class: 'timeline-marker' }),
    el(
      'div',
      { class: 'card-meta' },
      el('span', { class: `card-category ${catClass}`, text: p.category }),
      el('span', { class: 'card-venue', text: p.formatted_date })
    ),
    el(
      'h3',
      { class: 'project-title' },
      el('a', {
        href: p.permalink,
        'aria-label': `Explore dedicated detail page for ${p.title}`,
        text: p.title,
      })
    ),
    el('div', { class: 'card-org-context', text: venueLabel }),
    el('p', { class: 'project-excerpt', text: p.excerpt }),
    el(
      'div',
      { class: 'project-tech' },
      p.technologies.map((t) => el('span', { class: 'tech-tag', text: t }))
    ),
    buildProjectActions(p)
  );
  return card;
}

function buildProjectActions(p) {
  const actions = el('div', { class: 'card-actions' });

  actions.append(
    el(
      'a',
      {
        href: p.permalink,
        class: 'card-btn btn-detail',
        'aria-label': `Explore dedicated detail page for ${p.title}`,
      },
      octiconNode('INFO_16'),
      ' Details'
    )
  );

  if (p.github) {
    actions.append(
      el(
        'a',
        {
          href: p.github,
          target: '_blank',
          rel: 'noopener',
          class: 'card-btn btn-github',
          'aria-label': `View ${p.title} codebase on GitHub (opens in a new tab)`,
        },
        octiconNode('MARK_GITHUB_16'),
        ' Code ',
        el('span', { class: 'sr-only', text: '(opens in a new tab)' })
      )
    );
  }
  if (p.demo) {
    actions.append(
      el(
        'a',
        {
          href: p.demo,
          class: 'card-btn btn-demo',
          'aria-label': `Launch live interactive demo for ${p.title}`,
        },
        octiconNode('ROCKET_16'),
        ' Demo'
      )
    );
  }
  if (p.pdf) {
    actions.append(
      el(
        'a',
        {
          href: p.pdf,
          target: '_blank',
          rel: 'noopener',
          class: 'card-btn btn-pdf',
          'aria-label': `Download ${p.title} PDF paper (opens in a new tab)`,
        },
        octiconNode('FILE_16'),
        ' PDF ',
        el('span', { class: 'sr-only', text: '(opens in a new tab)' })
      )
    );
  }
  if (p.presentation) {
    actions.append(
      el(
        'a',
        {
          href: p.presentation,
          target: '_blank',
          rel: 'noopener',
          class: 'card-btn btn-pdf',
          'aria-label': `Download ${p.title} presentation slides (opens in a new tab)`,
        },
        octiconNode('FILE_16'),
        ' Slide ',
        el('span', { class: 'sr-only', text: '(opens in a new tab)' })
      )
    );
  }

  return actions;
}

// Dynamic dropdown filters generation
function populateFilters() {
  if (venueFilter) {
    const venues = Array.from(new Set(projects.map((p) => p.venue_tag).filter(Boolean))).sort();

    const venueOptions = [el('option', { value: 'all', text: 'All Institutions/Venues' })];
    venues.forEach((v) => {
      venueOptions.push(el('option', { value: v, text: venueLabels[v] || v }));
    });
    venueFilter.replaceChildren(...venueOptions);
  }

  if (yearFilter) {
    const years = Array.from(
      new Set(projects.map((p) => parseInt(p.date.split('-')[0], 10)).filter(Boolean))
    ).sort((a, b) => b - a);

    const yearOptions = [el('option', { value: 'all', text: 'All Years' })];
    years.forEach((yr) => {
      yearOptions.push(el('option', { value: String(yr), text: String(yr) }));
    });
    yearFilter.replaceChildren(...yearOptions);
  }
}

// Sync filter/search state to the URL so a filtered view is shareable.
// replaceState (not pushState) keeps every keystroke off the back-button history.
function updateUrlParams() {
  const params = new URLSearchParams();
  if (activeFilter !== 'all') params.set('category', activeFilter);
  if (activeVenue !== 'all') params.set('venue', activeVenue);
  if (activeYear !== 'all') params.set('year', activeYear);
  if (activeSort !== 'date-desc') params.set('sort', activeSort);
  if (searchQuery) params.set('q', searchQuery);
  const qs = params.toString();
  history.replaceState(null, '', qs ? `?${qs}${location.hash}` : location.pathname + location.hash);
}

function clearAllFilters() {
  activeFilter = 'all';
  activeVenue = 'all';
  activeYear = 'all';
  activeSort = 'date-desc';
  searchQuery = '';

  filterButtons.forEach((b) => {
    const isAll = b.getAttribute('data-filter') === 'all';
    b.classList.toggle('active', isAll);
    b.setAttribute('aria-pressed', String(isAll));
  });
  if (venueFilter) venueFilter.value = 'all';
  if (yearFilter) yearFilter.value = 'all';
  if (projectSort) projectSort.value = 'date-desc';
  if (searchInput) searchInput.value = '';

  updateUrlParams();
  renderProjects();
}

// Bind Listeners
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateUrlParams();
    renderProjects();
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    activeFilter = btn.getAttribute('data-filter') || 'all';
    updateUrlParams();
    renderProjects();
  });
});

if (venueFilter) {
  venueFilter.addEventListener('change', (e) => {
    activeVenue = e.target.value;
    updateUrlParams();
    renderProjects();
  });
}

if (projectSort) {
  projectSort.addEventListener('change', (e) => {
    activeSort = e.target.value;
    updateUrlParams();
    renderProjects();
  });
}

if (yearFilter) {
  yearFilter.addEventListener('change', (e) => {
    activeYear = e.target.value;
    updateUrlParams();
    renderProjects();
  });
}

// Dynamic responsive layout helpers
function moveElementResponsive(el, mobileAnchor, desktopContainer) {
  const isMobile = window.innerWidth < 768;

  if (isMobile && mobileAnchor) {
    if (el.parentNode !== mobileAnchor.parentNode || el.previousElementSibling !== mobileAnchor) {
      mobileAnchor.parentNode.insertBefore(el, mobileAnchor.nextSibling);
    }
  } else if (!isMobile && desktopContainer) {
    if (el.parentNode !== desktopContainer) {
      desktopContainer.appendChild(el);
    }
  }
}

function positionFilterControlsResponsive() {
  const filterControls = document.getElementById('filterControls');
  if (!filterControls) return;

  const sidebar = document.querySelector('.academic-sidebar');
  const subtitle = document.querySelector('.academic-content > p');
  const stickyWrapper = document.querySelector('.mobile-sticky-wrapper');

  const el = window.innerWidth < 768 && stickyWrapper ? stickyWrapper : filterControls;
  moveElementResponsive(el, subtitle, sidebar);
}

function positionTocResponsive() {
  const tocContainer = document.getElementById('tocContainer');
  if (!tocContainer) return;

  const filterControls = document.getElementById('filterControls');
  const sidebar = document.querySelector('.academic-sidebar');

  moveElementResponsive(tocContainer, filterControls, sidebar);
}

function wrapMobileStickyPanels() {
  const isMobile = window.innerWidth < 768;
  const filterControls = document.getElementById('filterControls');
  const tocContainer = document.getElementById('tocContainer');
  const existingWrapper = document.querySelector('.mobile-sticky-wrapper');

  if (isMobile) {
    if (!filterControls || !tocContainer) return;
    // Already wrapped correctly — skip
    if (
      existingWrapper &&
      existingWrapper.contains(filterControls) &&
      existingWrapper.contains(tocContainer)
    )
      return;

    // Remove stale wrapper if it exists but doesn't contain both panels
    if (existingWrapper) {
      const parent = existingWrapper.parentNode;
      while (existingWrapper.firstChild) {
        parent.insertBefore(existingWrapper.firstChild, existingWrapper);
      }
      parent.removeChild(existingWrapper);
    }

    // Both panels should be adjacent siblings in academic-content
    if (filterControls.parentNode === tocContainer.parentNode) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-sticky-wrapper';
      filterControls.parentNode.insertBefore(wrapper, filterControls);
      wrapper.appendChild(filterControls);
      wrapper.appendChild(tocContainer);
    }
  } else {
    if (existingWrapper) {
      const parent = existingWrapper.parentNode;
      while (existingWrapper.firstChild) {
        parent.insertBefore(existingWrapper.firstChild, existingWrapper);
      }
      parent.removeChild(existingWrapper);
    }
  }
}

function setupTocScrollListeners(tocListElement) {
  const links = tocListElement.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Collapse the TOC on mobile first so the height calculation is accurate for the final scroll position
        const toggleBtn = document.getElementById('tocToggleBtn');
        const isMobile = window.innerWidth < 768;
        if (isMobile && toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
          toggleBtn.setAttribute('aria-expanded', 'false');
        }

        const headerOffset = isMobile ? 120 : 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without jump
        history.pushState(null, null, '#' + targetId);
      }
    });
  });
}

function renderToc(filtered) {
  const tocContainer = document.getElementById('tocContainer');
  const tocList = document.getElementById('tocList');
  if (!tocContainer || !tocList) return;

  if (filtered.length <= 1) {
    tocContainer.hidden = true;
    tocList.replaceChildren();
    return;
  }

  // Move TOC element to its correct container depending on viewport width
  positionTocResponsive();

  const toggleBtn = document.getElementById('tocToggleBtn');
  if (toggleBtn && !toggleBtn.hasAttribute('data-initialized')) {
    const isMobile = window.innerWidth < 768;
    toggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
    toggleBtn.setAttribute('data-initialized', 'true');
  }

  const fragment = document.createDocumentFragment();

  if (activeSort === 'title-asc') {
    filtered.forEach((p) => {
      fragment.append(buildTocItem(p, null));
    });
  } else {
    let currentYear = null;
    let firstProjIdOfYear = '';
    let yearItems = [];

    const flushYear = () => {
      if (currentYear === null) return;
      fragment.append(
        el(
          'li',
          { class: 'toc-item' },
          el('a', {
            href: `#proj-${firstProjIdOfYear}`,
            class: 'toc-year-header',
            text: String(currentYear),
          }),
          el('ul', { class: 'toc-nested-list' }, yearItems)
        )
      );
    };

    filtered.forEach((p) => {
      const year = p.date ? parseInt(p.date.split('-')[0], 10) : null;

      if (year && year !== currentYear) {
        flushYear();
        currentYear = year;
        firstProjIdOfYear = p.id;
        yearItems = [];
      }

      yearItems.push(buildTocItem(p, null));
    });

    flushYear();
  }

  tocList.replaceChildren(fragment);
  tocContainer.hidden = false;

  setupTocScrollListeners(tocList);
}

function buildTocItem(p) {
  return el(
    'li',
    { class: 'toc-item' },
    el('a', {
      href: `#proj-${p.id}`,
      class: 'toc-link',
      text: p.title || '',
    })
  );
}

// Initialization
const toggleBtn = document.getElementById('tocToggleBtn');
if (toggleBtn) {
  toggleBtn.setAttribute('data-toggle-bound', 'true');
  toggleBtn.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  });
}

const filterToggleBtn = document.getElementById('filterToggleBtn');
if (filterToggleBtn) {
  if (!filterToggleBtn.hasAttribute('data-initialized')) {
    const isMobile = window.innerWidth < 768;
    filterToggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
    filterToggleBtn.setAttribute('data-initialized', 'true');
  }
  filterToggleBtn.setAttribute('data-toggle-bound', 'true');
  filterToggleBtn.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  });
}

function repositionCatalogLayout() {
  positionFilterControlsResponsive();
  positionTocResponsive();
  wrapMobileStickyPanels();
}

// ponytail: breakpoint-only — window resize also fires when the mobile keyboard
// opens and must not reparent filter controls (that blurs the search input).
window.matchMedia('(max-width: 767px)').addEventListener('change', repositionCatalogLayout);

positionFilterControlsResponsive();
populateFilters();

// Read initial filter state from the URL so filtered views are shareable/bookmarkable.
// ponytail: also lets index.html tech-stack tags deep-link into a prefilled search via ?q=
const initParams = new URLSearchParams(window.location.search);
const qParam = initParams.get('q');
if (qParam && searchInput) {
  searchQuery = qParam;
  searchInput.value = qParam;
}
const categoryParam = initParams.get('category');
if (categoryParam) {
  const matchBtn = Array.from(filterButtons).find(
    (b) => b.getAttribute('data-filter') === categoryParam
  );
  if (matchBtn) {
    filterButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    matchBtn.classList.add('active');
    matchBtn.setAttribute('aria-pressed', 'true');
    activeFilter = categoryParam;
  }
}
const venueParam = initParams.get('venue');
if (venueParam && venueFilter) {
  activeVenue = venueParam;
  venueFilter.value = venueParam;
}
const yearParam = initParams.get('year');
if (yearParam && yearFilter) {
  activeYear = yearParam;
  yearFilter.value = yearParam;
}
const sortParam = initParams.get('sort');
if (sortParam && projectSort) {
  activeSort = sortParam;
  projectSort.value = sortParam;
}

renderProjects();
wrapMobileStickyPanels();
