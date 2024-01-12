import { EditionData } from './edition.model';

export interface EditionBatchData {
  links: Links;
  size: number;
  entries: EditionData[];
}

export interface Links {
  self: string;
  work: string;
  next?: string;
  prev?: string;
}
