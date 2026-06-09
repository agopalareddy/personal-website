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
      'Artificial Intelligence',
      'Machine Learning',
      'PowerPoint',
    ],
    github: 'https://github.com/agopalareddy/AIPS',
    demo: null,
    pdf: null,
    presentation:
      'https://docs.google.com/presentation/d/10910WNa3CjiXIcH_T5OIXyOuOTiVKFHr/export/pptx',
    has_detail: true,
    formatted_date: 'Summer 2022',
  },
  {
    id: '2022-07-artificial-intelligence-in-modern-board-games',
    title: 'Artificial Intelligence in Modern Board Games',
    excerpt:
      'Developed an AI opponent for the card game Lost Cities using object oriented principles in Java.',
    venue: 'Ohio Wesleyan University',
    venue_tag: 'OWU',
    permalink: '/projects/artificial-intelligence-in-modern-board-games',
    date: '2022-07-25',
    category: 'Web Apps',
    technologies: ['Java', 'Artificial Intelligence', 'OOP', 'Game Theory', 'Git', 'Statistics'],
    github: 'https://github.com/agopalareddy/LostCities',
    demo: '/lost-cities/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Summer 2022',
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
    technologies: ['Java', 'OOP', 'Artificial Intelligence', 'Git'],
    github: 'https://github.com/agopalareddy/CS340Final-Connect4',
    demo: '/connect4/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2022',
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
      'Artificial Intelligence',
      'Statistics',
    ],
    github: 'https://github.com/agopalareddy/DATA490',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Spring 2023',
  },
  {
    id: '2024-11-php-calendar-app',
    title: 'PHP Calendar Application',
    excerpt:
      'Developed a feature-rich personal calendar and event management web application using PHP and MySQL, implementing secure user authentication, interactive calendar interface, and comprehensive event management capabilities.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/php-calendar-app',
    date: '2024-11-2',
    category: 'Web Apps',
    technologies: [
      'PHP',
      'MySQL',
      'HTML',
      'CSS',
      'JavaScript',
      'Web Security',
      'APIs',
      'Database Design',
      'Authentication',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/CSE503S_PHP_Calendar_App',
    demo: '/calendar/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2024',
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
    github: 'https://github.com/agopalareddy/CSE503S_Chat_App',
    demo: '/chat/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2024',
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
    github: 'https://github.com/agopalareddy/CSE510A_Datacenter_Cooling',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2024',
  },
  {
    id: '2024-12-interactive-storybook',
    title: 'Interactive Storybook',
    excerpt:
      'Developed an interactive storytelling application using Vue.js, Node.js, and MongoDB with AI-powered content generation, enabling users to create and experience branching narrative stories with dynamically generated text and images.',
    venue: 'Washington University in St. Louis',
    venue_tag: 'WashU',
    permalink: '/projects/interactive-storybook',
    date: '2024-11-30',
    category: 'Web Apps',
    technologies: [
      'Vue.js',
      'Node.js',
      'MongoDB',
      'OpenAI API',
      'JavaScript',
      'TypeScript',
      'HTML',
      'CSS',
      'APIs',
      'Database Design',
      'AI Integration',
      'Git',
    ],
    github: 'https://github.com/agopalareddy/CSE503S_Interactive_Storybook',
    demo: '/storybook/',
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2024',
  },
  {
    id: '2024-12-multimodal-alzheimers',
    title: "Multimodal Prediction of Alzheimer's Disease",
    excerpt:
      "Developed a multimodal approach for early detection of Alzheimer's Disease using the OASIS-1 dataset, combining imaging and clinical data analysis through deep learning and machine learning techniques.",
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
    github: 'https://github.com/agopalareddy/CSE419A_Multimodal_Prediction_of_Alzheimers',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2024',
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
    formatted_date: 'Spring 2025',
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
    formatted_date: 'Summer 2025',
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
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Summer 2025',
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
      'Streamlit',
      'Pandas',
      'Statcast API',
    ],
    github: 'https://github.com/agopalareddy/CSE-5114-Project',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2025',
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
      'Pillow',
      'OpenCV',
      'OCR',
      'OpenAI API',
      'Anthropic API',
      'Qwen-VL',
      'COCO Dataset',
    ],
    github: 'https://github.com/agopalareddy/CSE5519-Project',
    demo: null,
    pdf: null,
    presentation: null,
    has_detail: true,
    formatted_date: 'Fall 2025',
  },
  {
    id: '2025-10-hackwashu-databases-workshop',
    title: 'HackWashU Databases Workshop',
    excerpt:
      'Developed and facilitated a hands-on databases workshop teaching SQLite, Supabase, API integration, and full-stack web development through two complete projects.',
    venue: 'Washington University in St. Louis - HackWashU',
    venue_tag: 'WashU',
    permalink: '/projects/hackwashu-databases-workshop',
    date: '2025-10-12',
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
    formatted_date: 'Fall 2025',
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
    formatted_date: 'Summer 2025',
  },
  {
    id: '2026-06-blink-morse-decoder',
    title: 'Blink Morse Decoder',
    excerpt:
      'An accessibility-focused Android app that translates deliberate eye blinks into Morse code text using real-time camera-based facial landmark tracking and a custom blink state machine \u2014 enabling hands-free communication without extra hardware.',
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
    formatted_date: 'Summer 2026',
  },
  {
    id: '2026-04-ms-thesis',
    title:
      'Toward Vehicle-Agnostic Driving Signatures for Cognitive Impairment Prediction from Naturalistic Driving Data',
    excerpt:
      'Master&apos;s thesis investigating whether naturalistic driving data can help predict cognitive impairment status while accounting for differences across vehicles, using domain-adversarial and sequence-based modeling.',
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
    pdf: '/files/thesis-main.pdf',
    presentation: null,
    has_detail: true,
    formatted_date: 'Spring 2026',
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

let activeFilter = 'all';
let activeVenue = 'all';
let activeSort = 'date-desc';
let searchQuery = '';
let activeYear = 'all';

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
  let filtered = projects.filter((p) => {
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
    projectGrid.innerHTML =
      '<div class="no-results">No projects match your search or filter criteria.</div>';
    renderToc([]);
    return;
  }

  projectGrid.innerHTML = filtered
    .map((p) => {
      const catClass = getCategoryClass(p.category);
      const venueLabel = venueLabels[p.venue_tag] || p.venue_tag;
      const titleHtml = `<a href="${p.permalink}" aria-label="Explore dedicated detail page for ${p.title}">${p.title}</a>`;
      const tagsHtml = p.technologies.map((t) => `<span class="tech-tag">${t}</span>`).join('');

      let actions = [];
      actions.push(
        `<a href="${p.permalink}" class="card-btn btn-detail" aria-label="Explore dedicated detail page for ${p.title}"><i class="fas fa-info-circle" aria-hidden="true"></i> Details</a>`
      );

      if (p.github) {
        actions.push(
          `<a href="${p.github}" target="_blank" rel="noopener" class="card-btn btn-github" aria-label="View ${p.title} codebase on GitHub (opens in a new tab)"><i class="fab fa-github" aria-hidden="true"></i> Code <span class="sr-only">(opens in a new tab)</span></a>`
        );
      }
      if (p.demo) {
        actions.push(
          `<a href="${p.demo}" class="card-btn btn-demo" aria-label="Launch live interactive demo for ${p.title}"><i class="fas fa-rocket" aria-hidden="true"></i> Demo</a>`
        );
      }
      if (p.pdf) {
        actions.push(
          `<a href="${p.pdf}" target="_blank" rel="noopener" class="card-btn btn-pdf" aria-label="Download ${p.title} PDF paper (opens in a new tab)"><i class="fas fa-file-pdf" aria-hidden="true"></i> PDF <span class="sr-only">(opens in a new tab)</span></a>`
        );
      }
      if (p.presentation) {
        actions.push(
          `<a href="${p.presentation}" target="_blank" rel="noopener" class="card-btn btn-pdf" aria-label="Download ${p.title} presentation slides (opens in a new tab)"><i class="fas fa-file-powerpoint" aria-hidden="true"></i> Slide <span class="sr-only">(opens in a new tab)</span></a>`
        );
      }

      const actionsHtml = `<div class="card-actions">${actions.join('')}</div>`;

      return `
                    <div class="project-card spotlight-card" id="proj-${p.id}">
                        <div class="card-meta">
                            <span class="card-category ${catClass}">${p.category}</span>
                            <span class="card-venue">${p.formatted_date}</span>
                        </div>
                        <h3 class="project-title">${titleHtml}</h3>
                        <div class="card-org-context" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0rem; margin-bottom: 0.5rem; font-family: var(--font-body); font-weight: 500; line-height: 1.4;">${venueLabel}</div>
                        <p class="project-excerpt">${p.excerpt}</p>
                        <div class="project-tech">${tagsHtml}</div>
                        ${actionsHtml}
                    </div>
                `;
    })
    .join('');

  renderToc(filtered);
  setupSpotlight();
}

function setupSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-btn') || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const mainLink = card.querySelector('h3.project-title a');
      if (mainLink) {
        mainLink.click();
      }
    });
  });
}

// Dynamic dropdown filters generation
function populateFilters() {
  if (venueFilter) {
    const venues = Array.from(new Set(projects.map((p) => p.venue_tag).filter(Boolean))).sort();

    let venueOptions = '<option value="all">All Institutions/Venues</option>';
    venues.forEach((v) => {
      const label = venueLabels[v] || v;
      venueOptions += `<option value="${v}">${label}</option>`;
    });
    venueFilter.innerHTML = venueOptions;
  }

  if (yearFilter) {
    const years = Array.from(
      new Set(projects.map((p) => parseInt(p.date.split('-')[0], 10)).filter(Boolean))
    ).sort((a, b) => b - a);

    let yearOptions = '<option value="all">All Years</option>';
    years.forEach((yr) => {
      yearOptions += `<option value="${yr}">${yr}</option>`;
    });
    yearFilter.innerHTML = yearOptions;
  }
}

// Bind Listeners
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
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
    renderProjects();
  });
});

if (venueFilter) {
  venueFilter.addEventListener('change', (e) => {
    activeVenue = e.target.value;
    renderProjects();
  });
}

if (projectSort) {
  projectSort.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProjects();
  });
}

if (yearFilter) {
  yearFilter.addEventListener('change', (e) => {
    activeYear = e.target.value;
    renderProjects();
  });
}

// Table of Contents generator
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function positionTocResponsive() {
  const tocContainer = document.getElementById('tocContainer');
  if (!tocContainer) return;

  const isMobile = window.innerWidth < 768;
  const searchElement = document.querySelector('search');
  const sidebar = document.querySelector('.academic-sidebar');

  if (isMobile && searchElement) {
    if (
      tocContainer.parentNode !== searchElement.parentNode ||
      tocContainer.previousElementSibling !== searchElement
    ) {
      searchElement.parentNode.insertBefore(tocContainer, searchElement.nextSibling);
    }
  } else if (!isMobile && sidebar) {
    if (tocContainer.parentNode !== sidebar) {
      sidebar.appendChild(tocContainer);
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
    tocList.innerHTML = '';
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

  let html = '';

  if (activeSort === 'title-asc') {
    filtered.forEach((p) => {
      let title = p.title || '';
      html += `
        <li class="toc-item">
          <a href="#proj-${p.id}" class="toc-link">${escapeHtml(title)}</a>
        </li>
      `;
    });
  } else {
    let currentYear = null;
    let firstProjIdOfYear = '';
    let yearItemsHtml = '';

    filtered.forEach((p) => {
      const year = p.date ? parseInt(p.date.split('-')[0], 10) : null;
      let title = p.title || '';

      if (year && year !== currentYear) {
        if (currentYear !== null) {
          html += `
            <li class="toc-item">
              <a href="#proj-${firstProjIdOfYear}" class="toc-year-header">${currentYear}</a>
              <ul class="toc-nested-list">${yearItemsHtml}</ul>
            </li>
          `;
        }
        currentYear = year;
        firstProjIdOfYear = p.id;
        yearItemsHtml = '';
      }

      yearItemsHtml += `
        <li class="toc-item">
          <a href="#proj-${p.id}" class="toc-link">${escapeHtml(title)}</a>
        </li>
      `;
    });

    if (currentYear !== null) {
      html += `
        <li class="toc-item">
          <a href="#proj-${firstProjIdOfYear}" class="toc-year-header">${currentYear}</a>
          <ul class="toc-nested-list">${yearItemsHtml}</ul>
        </li>
      `;
    } else {
      html = yearItemsHtml;
    }
  }

  tocList.innerHTML = html;
  tocContainer.hidden = false;

  setupTocScrollListeners(tocList);
}

// Initialization
const toggleBtn = document.getElementById('tocToggleBtn');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !expanded);
  });
}

window.addEventListener('resize', positionTocResponsive);

populateFilters();
renderProjects();
