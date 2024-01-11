export interface EditionData {
  works: Work[];
  title: string;
  key: string;
  type: Work;
  latest_revision: number;
  revision: number;
  created: Created;
  last_modified: Created;

  publishers?: string[];
  publish_date?: string;
  identifiers?: Identifiers;
  covers?: number[];
  ocaid?: string;
  classifications?: Classifications;
  subtitle?: string;
  pagination?: string;
  languages?: Work[];
  number_of_pages?: number;
  lccn?: string[];
  lc_classifications?: string[];
  source_records?: string[];
  series?: string[];
  physical_format?: string;
  authors?: Work[];
  contributions?: string[];
  subjects?: string[];
  translation_of?: string;
  isbn_13?: string[];
  isbn_10?: string[];
  oclc_numbers?: string[];
  full_title?: string;
  publish_places?: string[];
  local_id?: string[];
  location?: string[];
  publish_country?: string;
  description?: Created | string;
  copyright_date?: string;
  notes?: Created | string;
  edition_name?: string;
  by_statement?: string;
  other_titles?: string[];
  contributors?: Contributor[];
  dewey_decimal_class?: string[];
  translated_from?: Work[];
  physical_dimensions?: string;
  weight?: string;
  ia_box_id?: string[];
  work_titles?: string[];
  uri_descriptions?: string[];
  uris?: string[];
  url?: string[];
}

export interface Contributor {
  role: string;
  name: string;
}

export interface Created {
  type: string;
  value: string;
}

export interface Classifications {
  nur?: string[];
}

export interface Identifiers {
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
}

export interface Work {
  key: string;
}
