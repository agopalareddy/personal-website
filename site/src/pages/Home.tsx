import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import { projectCategoryClass, projectDetailUrl, projectYear } from '../content/projectDisplay';
import type { ProjectEntry } from '../content/types';

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aadarsha Gopala Reddy',
  url: 'https://agreddy.com',
  image: 'https://agreddy.com/images/profile.png',
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
 * The four pinned projects. Category and year come from the projects
 * database by id; the title and one-line description are home-page copy.
 * `href` overrides the detail-page link (Tales We Weave opens the live app).
 */
const FEATURED: Array<{ id: string; title: string; description: string; href?: string }> = [
  {
    id: '2026-04-ms-thesis',
    title: 'M.S. Thesis: Vehicle-Agnostic Driving Signatures',
    description:
      'Compared six modeling approaches for predicting cognitive impairment from naturalistic driving data.',
  },
  {
    id: '2024-12-multimodal-alzheimers',
    title: 'Multimodal Alzheimer’s Prediction',
    description: 'Combined MRI imaging with clinical data for early Alzheimer’s disease detection.',
  },
  {
    id: '2024-12-datacenter-cooling',
    title: 'Datacenter Cooling Optimization',
    description:
      'Applied deep reinforcement learning (DDQN, PPO, SAC) to optimize datacenter cooling efficiency.',
  },
  {
    id: '2024-12-interactive-storybook',
    title: 'Tales We Weave',
    href: '/storybook/',
    description:
      'AI-powered interactive storytelling app with branching narratives, built with Vue 3, Express, and MongoDB.',
  },
];

/**
 * Home: a short introduction with the three main actions, four pinned
 * projects, and skills (the first few areas, the rest behind "Show all").
 */
export function HomePage({ projects }: { projects: ProjectEntry[] }) {
  const pins = FEATURED.map((f) => {
    const p = projects.find((x) => x.id === f.id);
    if (!p) throw new Error(`Home: featured project "${f.id}" is not in the projects database`);
    return {
      ...f,
      href: f.href ?? projectDetailUrl(p),
      category: p.category,
      year: projectYear(p),
    };
  });

  return (
    <Layout
      activePage="home"
      bodyClassName="home-page"
      title="About Me"
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
        <p>
          I have hands-on experience across machine learning, data engineering, and full-stack
          development, gained through research, teaching, and industry internships. For the full
          story on my research, teaching, and work experience, see my{' '}
          <a href="/experience/">Experience</a> page, or download my <a href="/cv/">CV</a>.
        </p>
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
          <a
            href="#"
            className="btn-link protected-email"
            data-email-user="YWdy"
            data-email-domain="YWdyZWRkeS5jb20="
          >
            Email me
          </a>
          <noscript>
            (email requires JavaScript —{' '}
            <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">
              message me on LinkedIn
            </a>{' '}
            instead)
          </noscript>
        </div>
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
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <a href={`/projects/?q=${encodeURIComponent(skill)}`} rel="nofollow">
                        {skill}
                      </a>
                    </li>
                  ))}
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
