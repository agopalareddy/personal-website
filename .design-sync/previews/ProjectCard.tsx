import { ProjectCard } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

export function WithLinksAndPresentation() {
  return (
    <Theme>
      <ProjectCard
        p={{
          id: '2022-07-aiparkinscan',
          title: 'AIParkinScan',
          excerpt:
            "Co-developed AIParkinScan software for Parkinson's diagnosis using audio and image data. Utilized neural networks, spectrograms, and Random Forest algorithm.",
          venue: 'MITxSureStart FutureMakers Create-a-Thon Program',
          venue_tag: 'MITxSureStart',
          permalink: '/projects/aiparkinscan',
          date: '2022-07-31',
          formatted_date: 'Jun 2022 – Aug 2022',
          category: 'Research & ML',
          technologies: ['Python', 'TensorFlow', 'Flask', 'Scikit-learn', 'Machine Learning'],
          github: 'https://github.com/agopalareddy/AIPS',
          demo: null,
          pdf: null,
          presentation: 'https://docs.google.com/presentation/d/example/export/pptx',
          has_detail: true,
          content_html: '<p>AIParkinScan combines two independent diagnostic signals.</p>',
        }}
      />
    </Theme>
  );
}

export function MinimalNoLinks() {
  return (
    <Theme>
      <ProjectCard
        p={{
          id: 'personal-website',
          title: 'agreddy.com',
          excerpt: 'Personal site and project archive, statically rendered at build time.',
          venue: 'Personal Project',
          venue_tag: 'Personal',
          permalink: '/projects/personal-website',
          date: '2026-01-15',
          formatted_date: 'Jan 2026',
          category: 'Web Apps',
          technologies: ['TypeScript', 'React', 'Vite'],
          github: null,
          demo: null,
          pdf: null,
          presentation: null,
          has_detail: false,
          content_html: '',
        }}
      />
    </Theme>
  );
}
