import { Keyed, Typed } from './shared.model';

// Response from /works/[ID].json endpooint
export interface WorkResponse {
  title: string;
  key: string;
  authors: Author[];
  type: Keyed;
  subjects: string[];
  description?: Typed | string;
  covers?: number[];
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  location?: string;
  links?: Link[];
  latest_revision: number;
  revision: number;
  created: Typed;
  last_modified: Typed;
  first_publish_date?: string;
  excerpts?: Excerpt[];
  first_sentence?: Typed;
  subtitle?: string;
}

export interface Author {
  author: Keyed;
  type: Keyed;
}

export interface Link {
  url: string;
  title: string;
  type: Keyed;
}

export interface Excerpt {
  excerpt: string;
  author: Keyed;
  comment: string;
}
