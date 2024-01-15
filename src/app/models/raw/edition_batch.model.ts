// TODO: This info was obtained from a single API call,
// needs further testing.

import { EditionResponse } from './edition.model';

export interface EditionBatchResponse {
  links: Links;
  size: number;
  entries: EditionResponse[];
}

export interface Links {
  self: string;
  work: string;
  next?: string;
  prev?: string;
}
