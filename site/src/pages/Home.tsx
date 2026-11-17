import { SITE_NAME } from '../components/chrome/Head';
import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import { projectCategoryClass, projectDetailUrl, projectYear } from '../content/projectDisplay';
import { experienceSearchText, matchesQuery, projectSearchText } from '../content/search';
import type { ExperienceEntry, ProjectEntry } from '../content/types';

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aadarsha Gopala Reddy',
  url: 'https://agreddy.com',
  image: 'https://agreddy.com/images/profile-640.jpg',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Washington University in St. Louis',
    sameAs: 'https://www.wustl.edu',
  },
  jobTitle: 'IT Training Specialist',
  worksFor: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Florida',
    sameAs: 'https://www.ufl.edu',
  },
  sameAs: ['https://github.com/agopalareddy', 'https://www.linkedin.com/in/agopalareddy/'],
});

const SKILL_GROUPS: Array<{ label: string; skills: string[] }> = [
  {
    label: 'Languages',
    skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C#', 'C++'],
  },
  {
    label: 'ML & analytics',
    skills: [
      'Statistics',
      'Data Analysis',
      'Pandas',
      'NumPy',
      'PyTorch',
      'TensorFlow',
      'Keras',
      'Scikit-learn',
      'XGBoost',
      'Transformers',
    ],
  },
  {
    label: 'Data systems',
    skills: [
      'Database Design',
      'PostgreSQL',
      'MySQL',
      'SQLite',
      'MongoDB',
      'Supabase',
      'Snowflake',
      'Spark',
      'Airflow',
      'Kafka',
    ],
  },
  {
    label: 'Web & apps',
    skills: [
      'HTML',
      'CSS',
      'React',
      'Vue',
      'Node',
      'Express',
      'FastAPI',
      'Flask',
      'Streamlit',
      'Socket.IO',
    ],
  },
  {
    label: 'AI practice',
    skills: [
      'Agentic Coding',
      'Context Engineering',
      'AI Code Review',
      'AI-Assisted Testing',
      'Multi-agent Systems',
    ],
  },
  {
    label: 'AI tools',
    skills: ['Claude Code', 'Codex', 'Copilot', 'Cursor', 'Antigravity'],
  },
  {
    label: 'Agents & APIs',
    skills: ['Gemini', 'OpenAI', 'Claude', 'Fal.ai API', 'Google ADK', 'MCP', 'Skills'],
  },
  {
    label: 'Tools',
    skills: ['Git', 'AWS', 'Docker', 'Tableau', 'Power BI', 'Google Workspace', 'Microsoft 365'],
  },
];

/** How many skill groups show before "Show all". */
const LEAD_SKILL_GROUPS = 4;
const SKILL_COUNT = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

/**
 * The four pinned projects. Title, category and year come from the projects
 * database by id, so a pin reads the same as the page it opens. The
 * description, result and stack are home-page copy; each result is a figure
 * stated on the project's own page.
 * `href` overrides the detail-page link (Tales We Weave opens the live app).
 */
const FEATURED: Array<{
  id: string;
  description: string;
  result: string;
  stack: string[];
  href?: string;
}> = [
  {
    id: '2026-04-ms-thesis',
    description:
      'M.S. thesis comparing six models for predicting cognitive impairment from everyday driving, across vehicle makes and models.',
    result:
      '790,000 trips from 304 older adults; the best model reached a participant-level ROC AUC of 0.599.',
    stack: ['Python', 'PyTorch', 'scikit-learn'],
  },
  {
    id: '2026-09-umm',
    description:
      'Android voice keyboard that strips filler words and formats dictation, using your own OpenRouter key.',
    result: 'A short dictation costs about $0.0004 and comes back in 1.2 to 1.8 seconds.',
    stack: ['Kotlin', 'Jetpack Compose', 'OpenRouter'],
  },
  {
    id: '2024-12-datacenter-cooling',
    description:
      'Trained DDQN, PPO and SAC agents to run cooling in an EnergyPlus datacenter simulation.',
    result: 'DDQN improved energy efficiency 35.8% over a rules-based controller.',
    stack: ['Python', 'PyTorch', 'EnergyPlus'],
  },
  {
    id: '2024-12-interactive-storybook',
    href: '/storybook/',
    description:
      'Branching stories written by Gemini and illustrated by fal.ai, with a zoomable map of the story tree.',
    result: 'Live demo: read or write a story in the browser.',
    stack: ['Vue 3', 'Express', 'MongoDB'],
  },
];

/** Skills whose search should match inside words: "sql" finds MySQL and SQLite. */
const SKILL_QUERY: Record<string, string> = { SQL: 'sql' };

/**
 * Where a skill links: the projects that name it, else the experience
 * entries that do, else nowhere (plain text). The quoted query matches
 * whole words, so "Java" does not open the JavaScript projects.
 */
function skillHref(skill: string, projectTexts: string[], experienceTexts: string[]) {
  const q = SKILL_QUERY[skill] ?? `"${skill}"`;
  if (projectTexts.some((t) => matchesQuery(t, q))) return `/projects/?q=${encodeURIComponent(q)}`;
  if (experienceTexts.some((t) => matchesQuery(t, q))) {
    return `/experience/?q=${encodeURIComponent(q)}`;
  }
  return null;
}

/**
 * Home: a short introduction with the three main actions, four pinned
 * projects, and skills (the first few areas, the rest behind "Show all").
 */
export function HomePage({
  projects,
  experiences,
}: {
  projects: ProjectEntry[];
  experiences: ExperienceEntry[];
}) {
  const projectTexts = projects.map(projectSearchText);
  const experienceTexts = experiences.map(experienceSearchText);
  const pins = FEATURED.map((f) => {
    const p = projects.find((x) => x.id === f.id);
    if (!p) throw new Error(`Home: featured project "${f.id}" is not in the projects database`);
    return {
      ...f,
      title: p.title,
      href: f.href ?? projectDetailUrl(p),
      category: p.category,
      year: projectYear(p),
    };
  });

  return (
    <Layout
      activePage="home"
      bodyClassName="home-page"
      title={SITE_NAME}
      description="IT Training Specialist at the University of Florida with an M.S. in Computer Science from Washington University in St. Louis. Research interests in machine learning for aging and Alzheimer's disease."
      canonicalUrl="https://agreddy.com/"
      ogType="website"
      contentAriaLabel="Biography and Overview"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <section className="page__content home-intro" itemProp="text">
        <h1 id="hello-im-aadarsha">Hello, I&rsquo;m Aadarsha</h1>
        <p className="home-lede">
          I&rsquo;m an IT Training Specialist at the{' '}
          <a href="https://www.ufl.edu/">University of Florida</a>, where I develop and deliver AI
          training for university employees in UF Information Technology. Before this, I earned an
          M.S. in Computer Science at{' '}
          <a href="https://www.washu.edu/">Washington University in St. Louis</a>, where my thesis
          used domain-adversarial learning to predict cognitive impairment from naturalistic driving
          data.
        </p>
        {/* Straight after the lede so both buttons are in the first screen on a
            phone. Email is in the profile beside this, and at the end of the page. */}
        <div className="home-actions">
          <a
            href="/files/reddy_resume.pdf"
            target="_blank"
            rel="noopener"
            className="btn-primary"
            aria-label="Resume PDF (opens in a new tab)"
          >
            <Icon name="DOWNLOAD_16" /> Resume
          </a>
          <a href="/availability/" className="btn-default">
            <Icon name="CALENDAR_16" /> Book a meeting
          </a>
        </div>
        <p>
          I have hands-on experience across machine learning, data engineering, and full-stack
          development, gained through research, teaching, and industry internships. For the full
          story on my research, teaching, and work experience, see my{' '}
          <a href="/experience/">Experience</a> page, or download my <a href="/cv/">CV</a>.
        </p>
      </section>

      <section aria-labelledby="featured-projects">
        <div className="section-heading">
          <h2 id="featured-projects">Featured projects</h2>
          <a href="/projects/">All {projects.length} projects</a>
        </div>
        <ul className="home-pins">
          {pins.map((pin) => (
            <li className="home-pin" key={pin.id}>
              <h3 className="home-pin-title">
                <a href={pin.href}>{pin.title}</a>
              </h3>
              <p className="home-pin-description">{pin.description}</p>
              <p className="home-pin-result">{pin.result}</p>
              <p className="home-pin-stack">
                <span className="sr-only">Built with </span>
                {pin.stack.join(' · ')}
              </p>
              <p className="home-pin-meta">
                <span
                  className={`home-pin-dot ${projectCategoryClass(pin.category)}`}
                  aria-hidden="true"
                />
                {pin.category}
                <span aria-hidden="true">·</span>
                {pin.year}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills">
        <div className="section-heading">
          <h2 id="skills">Skills</h2>
          <button
            type="button"
            className="btn-link home-skills-toggle"
            aria-expanded="false"
            aria-controls="homeSkillGroups"
            data-label-collapsed={`Show all ${SKILL_COUNT}`}
            data-label-expanded="Show fewer"
          >
            Show all {SKILL_COUNT}
          </button>
        </div>
        <dl className="home-skills" id="homeSkillGroups" data-expanded="false">
          {SKILL_GROUPS.map((group, i) => (
            <div
              className={
                i < LEAD_SKILL_GROUPS
                  ? 'home-skill-group'
                  : 'home-skill-group home-skill-group--extra'
              }
              key={group.label}
            >
              <dt>{group.label}</dt>
              <dd>
                <ul className="home-skill-list">
                  {group.skills.map((skill) => {
                    const href = skillHref(skill, projectTexts, experienceTexts);
                    return (
                      <li key={skill}>
                        {href ? (
                          <a href={href} rel="nofollow">
                            {skill}
                          </a>
                        ) : (
                          skill
                        )}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="research-interests">
        <div className="section-heading">
          <h2 id="research-interests">Research interests</h2>
        </div>
        <p>
          My research interests are in public health, with a focus on aging and Alzheimer&rsquo;s
          disease, and in applying machine learning and AI to those problems. I&rsquo;m glad to hear
          from people working on related questions.{' '}
          <a
            href="#"
            className="protected-email"
            data-email-user="YWdy"
            data-email-domain="YWdyZWRkeS5jb20="
          >
            Email me
          </a>
          <noscript>
            {' '}
            (requires JavaScript —{' '}
            <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">
              message me on LinkedIn
            </a>{' '}
            instead)
          </noscript>{' '}
          or review my <a href="/cv/">CV</a> for the full record.
        </p>
      </section>
    </Layout>
  );
}
