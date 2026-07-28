import { ExperienceEntryCard } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

export function Education() {
  return (
    <Theme>
      <ExperienceEntryCard
        e={{
          id: 'ms-cs-washu',
          title: 'M.S. Computer Science',
          category: 'education',
          organization: 'Washington University in St. Louis',
          location: 'St. Louis, Missouri, USA',
          role_context: null,
          start_date: '2024-08-01',
          end_date: '2026-05-31',
          responsibilities: [
            'GPA: 3.67/4.00.',
            'Thesis: Toward Vehicle-Agnostic Driving Signatures for Cognitive Impairment Prediction from Naturalistic Driving Data.',
          ],
          related_projects: [],
          links: [],
          has_detail: true,
          excerpt:
            'Thesis on vehicle-agnostic driving signatures for cognitive impairment prediction, advised by Dr. Alvitta Ottley (DRIVES Lab).',
        }}
      />
    </Theme>
  );
}

export function Professional() {
  return (
    <Theme>
      <ExperienceEntryCard
        e={{
          id: 'ai-eng-intern-crittero',
          title: 'AI Engineering Intern',
          category: 'professional',
          organization: 'Crittero, Inc.',
          location: 'Remote',
          role_context: 'Internship',
          start_date: '2025-05-01',
          end_date: '2025-08-31',
          responsibilities: ['Built and evaluated ML pipelines for production features.'],
          related_projects: [],
          links: [{ label: 'Company site', url: 'https://crittero.example.com', type: 'website' }],
          has_detail: true,
          excerpt:
            'AI engineering internship building and evaluating ML pipelines for production features.',
        }}
      />
    </Theme>
  );
}
