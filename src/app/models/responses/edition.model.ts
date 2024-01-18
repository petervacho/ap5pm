import { Keyed, Typed } from './shared.model';

// Respone from /books/[id].json endpoint
export interface EditionResponse {
  title: string;
  key: string;
  type: Keyed;
  works: Keyed[];

  created: Typed;
  last_modified: Typed;
  latest_revision: number;
  revision: number;

  authors?: Keyed[];
  isbn_13?: string[];
  languages?: Keyed[];
  pagination?: string;
  publish_date?: string;
  publishers?: string[];
  source_records?: string[];
  subjects?: string[];
  weight?: string;
  full_title?: string;
  covers?: number[];
  number_of_pages?: number;
  identifiers?: Identifiers;
  local_id?: string[];
  physical_format?: string;
  isbn_10?: string[];
  classifications?: Classifications;
  ocaid?: string;
  notes?: Typed;
  subtitle?: string;
  lc_classifications?: string[];
  description?: Typed;
  oclc_numbers?: string[];
  physical_dimensions?: string;
  publish_country?: string;
  work_titles?: string[];
  contributions?: string[];
  publish_places?: string[];
  other_titles?: string[];
  series?: string[];
  genres?: string[];
  edition_name?: string;
  by_statement?: string;
  first_sentence?: Typed;
  dewey_decimal_class?: string[];
  ia_box_id?: string[];
  translation_of?: string;
  translated_from?: Keyed[];
  contributors?: Contributor[];
  subject_people?: string[];
  subject_places?: string[];
  table_of_contents?: Tableofcontent[];
  copyright_date?: string;
  lccn?: string[];
  ia_loaded_id?: string[];
  uri_descriptions?: string[];
  uris?: string[];
  url?: string[];
  subject_times?: string[];
  subject_place?: string[];
  subject_time?: string[];
  work_title?: string[];
}

export interface Tableofcontent {
  title: string;
  level: number;

  label?: string;
  pagenum?: string;
  type?: Keyed;
}

export interface Contributor {
  role: string;
  name: string;
}

export interface Classifications {
  nur?: string[];
}

export interface Identifiers {
  better_world_books?: string[];
  scribd?: string[];
  goodreads?: string[];
  amazon?: string[];
  librarything?: string[];
  alibris_id?: string[];
  'amazon.co.uk_asin'?: string[];
  'amazon.it_asin'?: string[];
  google?: string[];
  'amazon.de_asin'?: string[];
  british_national_bibliography?: string[];
  british_library?: string[];
  bibliothèque_nationale_de_france?: string[];
  nla?: string[];
  paperback_swap?: string[];
  hathi_trust?: string[];
  // There's almost certainly some more fields here, but after
  // parsing about 20 books, these are the most common ones.
}
