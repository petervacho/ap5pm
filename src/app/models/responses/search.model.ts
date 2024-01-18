// Response from /search.json?q=... endpoint
export interface SearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: SearchDoc[];
  num_found: number;
  q: string;
  offset?: any;
}

export interface SearchDoc {
  key: string;
  type: string;
  seed: string[]; // a bunch of url paths to books/subjects/works/authors

  // Titles
  title: string;
  title_sort: string;
  title_suggest: string;
  subtitle?: string;
  alternative_title?: number; // Almost never present
  alternative_subtitle?: number; // Almost never present

  // Editions of this work
  edition_count: number; // amount of elements in edition_key
  edition_key: string[]; // List of Edition ID strings

  // Publishing data
  first_publish_year?: number;
  // Following are lists of various things, they're unique, and contain data for
  // each edition (when it's known).
  publish_date?: string[];
  publish_year?: number[];
  publisher?: string[];
  publish_place?: string[];
  publisher_facet?: string[]; // seems to match publisher

  // Cover image
  cover_i?: number; // Numeric id of the image
  cover_edition_key?: string; // Id of the edition which this cover belongs to

  // Bookshelves data (aggregation from each edition, where available)
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;

  // Author data
  author_key?: string[];
  author_name?: string[];
  author_alternative_name?: string[]; // various permutations of the name, or true alts
  author_facet?: string[]; // list of "[AUTHOR_ID] [NAME]" values

  // Ratings
  ratings_average?: number;
  ratings_sortable?: number;
  ratings_count?: number;
  ratings_count_1?: number;
  ratings_count_2?: number;
  ratings_count_3?: number;
  ratings_count_4?: number;
  ratings_count_5?: number;

  // Content Subjects/Keywords
  subject?: string[]; // Basically keywords (human readable)
  subject_key?: string[]; // Indexed subject names
  subject_facet?: string[]; // Seems to match subject

  // Content Places
  place?: string[]; // Names of places in the book (human-readable)
  place_key?: string[]; // Indexed places
  place_facet?: string[]; // Seems to match place

  // Content Time
  time?: string[]; // Time in the book (i.e. middle age) (human-readable)
  time_key?: string[]; // Indexed times
  time_facet?: string[]; // Seems to match time

  // Content Characters
  person?: string[]; // Names of the characters in the book (human-readable)
  person_key?: string[]; // Indexed people
  person_facet?: string[]; // Seems to match person

  // Misc
  language?: string[]; // List of (known) languages of the editions
  number_of_pages_median?: number; // avg amount of pages in the editions
  isbn?: string[]; // List of (known) ISBN numbers of the editions (both 10 and 13)
  contributor?: string[]; // Contributors of the book (illustrators, editors, ...)
  first_sentence?: string[];
  has_fulltext: boolean;
  lccn?: string[];
  oclc?: string[];
  lcc?: string[];
  ddc?: string[];
  last_modified_i: number;
  ebook_count_i: number;
  ebook_access: string;
  public_scan_b: boolean;
  ia?: string[];
  ia_collection?: string[];
  ia_collection_s?: string;
  lending_edition_s?: string;
  lending_identifier_s?: string;
  printdisabled_s?: string;
  readinglog_count?: number;
  lcc_sort?: string;
  ddc_sort?: string;
  _version_: number;

  // Identifiers
  id_bodleian__oxford_university?: string[];
  id_yakaboo?: string[];
  id_abebooks_de?: string[];
  id_project_gutenberg?: string[];
  id_librivox?: string[];
  id_isfdb?: string[];
  id_freebase?: string[];
  id_issn?: string[];
  id_isbn?: string[];
  id_boston_public_library?: string[];
  id_harvard?: string[];
  id_lulu?: string[];
  id_etsc?: string[];
  id_ean?: string[];
  id_alibris_id?: string[];
  id_canadian_national_library_archive?: string[];
  id_google?: string[];
  id_paperback_swap?: string[];
  id_amazon_ca_asin?: string[];
  id_amazon_co_uk_asin?: string[];
  id_amazon_de_asin?: string[];
  id_amazon_it_asin?: string[];
  id_british_national_bibliography?: string[];
  id_nla?: string[];
  id_hathi_trust?: string[];
  id_scribd?: string[];
  id_dnb?: string[];
  id_libris?: string[];
  id_bibliothèque_nationale_de_france?: string[];
  id_british_library?: string[];
  id_standard_ebooks?: string[];
  id_amazon?: string[];
  id_bcid?: string[];
  id_better_world_books?: string[];
  id_depósito_legal?: string[];
  id_goodreads?: string[];
  id_librarything?: string[];
  id_overdrive?: string[];
  id_wikidata?: string[];
  ia_loaded_id?: string[];
  ia_box_id?: string[];

  // Almost never actually present
  redirects?: number;
  format?: number;
  by_statement?: number;
  ia_count?: number;
}
