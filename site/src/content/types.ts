export interface ProjectEntry {
  id: string;
  title: string;
  excerpt: string;
  venue: string;
  venue_tag: string;
  permalink: string;
  date: string;
  formatted_date: string;
  category: string;
  technologies: string[];
  github: string | null;
  demo: string | null;
  pdf: string | null;
  presentation: string | null;
  has_detail: boolean;
  content_html: string;
  /**
   * One image at the top of the project's page: a capture of the running
   * project or a figure from the work itself. Never an illustration.
   */
  figure?: ProjectFigure;
  /**
   * A staged pipeline diagram, drawn as HTML instead of an image so it
   * follows the theme and reflows on a phone. Shown where `figure` would be.
   */
  pipeline?: ProjectPipeline;
}

export interface ProjectPipeline {
  caption: string;
  /** In order; each stage's steps run left to right, then the next stage. */
  stages: Array<{ title: string; steps: string[] }>;
}

export interface ProjectFigure {
  /** Site-relative path, e.g. /images/projects/figures/connect-4-ai.webp */
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export type ExperienceCategory =
  'education' | 'research' | 'professional' | 'leadership' | 'presentations' | 'awards';

export interface ExperienceLink {
  label: string;
  url: string;
  type: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  category: ExperienceCategory;
  organization: string;
  location: string | null;
  role_context: string | null;
  start_date: string;
  end_date: string | null;
  responsibilities: string[];
  related_projects: string[];
  links: ExperienceLink[];
  has_detail: boolean;
  excerpt: string;
  is_presentation?: boolean;
  /** Named people on the work (advisors, supervisors): one About row each. */
  people?: Array<{ role: string; name: string }>;
}
