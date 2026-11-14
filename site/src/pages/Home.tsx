import { Layout } from '../components/chrome/Layout';

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

/** Ported from index.html/scripts/chrome.py's home page rendering. */
export function HomePage() {
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
      <section className="page__content" itemProp="text">
        <h1 id="hello-im-aadarsha">Hello, I&rsquo;m Aadarsha</h1>
        <p>
          I&rsquo;m an IT Training Specialist at the{' '}
          <a href="https://www.ufl.edu/">University of Florida</a>, where I develop and deliver AI
          training for university employees in UF Information Technology. Before this, I earned an M.S. in Computer Science at{' '}
          <a href="https://www.washu.edu/">Washington University in St. Louis</a>, where my thesis
          used domain-adversarial learning to predict cognitive impairment from naturalistic driving
          data. I have hands-on experience across machine learning, data engineering, and full-stack
          development, gained through research, teaching, and industry internships.
        </p>
        <div className="home-skill-details card-surface">
          <button
            className="home-skill-toggle toc-toggle-btn"
            type="button"
            aria-expanded="true"
            aria-controls="homeSkillGroups"
          >
            Technical stack by area
          </button>
          <dl
            className="home-skill-groups"
            id="homeSkillGroups"
            aria-label="Technical stack by area"
          >
            {SKILL_GROUPS.map((group) => (
              <div className="home-skill-group" key={group.label}>
                <dt>{group.label}</dt>
                <dd>
                  <ul className="project-tech home-skill-tags">
                    {group.skills.map((skill) => (
                      <li className="tech-tag" key={skill}>
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
        </div>
        <div className="home-actions">
          <a
            href="/files/reddy_resume.pdf"
            target="_blank"
            rel="noopener"
            className="site-action-btn"
            aria-label="Download Resume PDF (opens in a new tab)"
          >
            <svg
              className="octicon octicon-download"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
              fill="currentColor"
            >
              <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path>
              <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path>
            </svg>
            Resume
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href="/availability/" className="doc-row-btn btn-secondary">
            <svg
              className="octicon octicon-calendar"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
              fill="currentColor"
            >
              <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z"></path>
            </svg>
            Book a meeting
          </a>
        </div>
        <p>
          For the full story on my research, teaching, and work experience, see my{' '}
          <a href="/experience/">Experience</a> page, or download my <a href="/cv/">CV</a>.
        </p>
        <h2 id="featured-projects">Featured Projects</h2>
        <ul>
          <li>
            <strong>
              <a href="/projects/ms-thesis.html">
                M.S. Thesis: Vehicle-Agnostic Driving Signatures
              </a>
            </strong>{' '}
            — Compared six modeling approaches for predicting cognitive impairment from naturalistic
            driving data.
          </li>
          <li>
            <strong>
              <a href="/projects/multimodal-alzheimers.html">
                Multimodal Alzheimer&rsquo;s Prediction
              </a>
            </strong>{' '}
            — Combined MRI imaging with clinical data for early Alzheimer&rsquo;s disease detection.
          </li>
          <li>
            <strong>
              <a href="/projects/datacenter-cooling.html">Datacenter Cooling Optimization</a>
            </strong>{' '}
            — Applied deep reinforcement learning (DDQN, PPO, SAC) to optimize datacenter cooling
            efficiency.
          </li>
          <li>
            <strong>
              <a href="/storybook/">Tales We Weave</a>
            </strong>{' '}
            — AI-powered interactive storytelling app with branching narratives, built with Vue 3,
            Express, and MongoDB.
          </li>
        </ul>
        <p>
          Check out more on my <a href="/projects/">Projects</a> page.
        </p>
        <h2 id="research-interests">Research Interests</h2>
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
