import { EditionResponse } from './edition.model';

// Response from /works/[ID]/editions.json endpoint
export interface WorkEditionsResponse {
  links: Links;
  size: number;
  entries: EditionResponse[];
}

export interface Links {
  self: string;
  work: string;
  next?: string;
}
