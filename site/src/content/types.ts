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
}

export type ExperienceCategory =
  | "education"
  | "research"
  | "professional"
  | "leadership"
  | "presentations"
  | "awards";

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
  end_date: string;
  responsibilities: string[];
  related_projects: string[];
  links: ExperienceLink[];
  has_detail: boolean;
  excerpt: string;
  is_presentation?: boolean;
}
