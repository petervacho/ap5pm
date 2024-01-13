// TODO: Needs more requests to catch optionals

export interface WorkData {
  description: Description;
  links: Link[];
  title: string;
  covers: number[];
  subject_places: string[];
  first_publish_date: string;
  subject_people: string[];
  key: string;
  authors: Author[];
  excerpts: Excerpt[];
  subjects: string[];
  type: Type;
  subject_times: string[];
  latest_revision: number;
  revision: number;
  created: Description;
  last_modified: Description;
}

export interface Excerpt {
  excerpt: string;
  author: Type;
  pages?: string;
  comment?: string;
}

export interface Author {
  author: Type;
  type: Type;
}

export interface Link {
  url: string;
  title: string;
  type: Type;
}

export interface Type {
  key: string;
}

export interface Description {
  type: string;
  value: string;
}
