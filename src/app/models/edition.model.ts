import { environment } from 'src/environments/environment';

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
  physical_format?: string;
  authors?: Work[]; // usually unavailable, prefer work's authors
  contributors?: Contributor[];
  subjects?: string[];
  translation_of?: string;
  isbn_13?: string[];
  isbn_10?: string[];
  oclc_numbers?: string[];
  full_title?: string;
  publish_places?: string[];
  local_id?: string[];
  // location?
  publish_country?: string;
  description?: Created | string;
  copyright_date?: string;
  notes?: Created | string;
  edition_name?: string;
  by_statement?: string;
  other_titles?: string[];
  contributions?: string[];
  dewey_decimal_class?: string[];
  translated_from?: Work[];
  physical_dimensions?: string;
  weight?: string;
  ia_box_id?: string[];
  work_titles?: string[];
  uri_descriptions?: string[];
  uris?: string[];
  url?: string[];

  series?: string[];
  first_sentence?: string;
  subject_people?: string[];
  table_of_contents?: Tableofcontent[];
  ia_loaded_id?: string[];
}

export interface Tableofcontent {
  title: string;
  level: number;

  label?: string;
  pagenum?: string;
  type?: Work;
}

export interface Created {
  type: string;
  value: string;
}

export interface Contributor {
  name: string;
  role: string;
}

export interface Classifications {
  nur?: string[];
}

export interface Identifiers {
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
}

export interface Work {
  key: string;
}

// The actual JSON data returned from the API is horribly formatted to the
// point where using it in the view directly would introduce a lot of clutter.
// Instead, create a class with the formatting work already done which will be
// used in the view in place of the original response.
export class FormattedEditionData {
  constructor(public rawData: EditionData) { }

  // Helper type guard method to check whether an optional list contains data.
  //
  // This is a very simple check, but because of how commonly it's needed
  // it's been made into a simple function, to reduce the repetition.
  private checkList(lst: any[] | undefined): lst is any[] {
    return lst != undefined && lst.length > 0;
  }

  get title(): string {
    return this.rawData.title;
  }

  get edition_id(): string {
    return this.rawData.key.slice('/books/'.length);
  }

  get publishers(): string {
    return this.checkList(this.rawData.publishers)
      ? this.rawData.publishers.join(', ')
      : 'N/A';
  }

  get publish_date(): string {
    // Annoyingly, this isn't returned in a standardized format
    // sometimes it's ISO (2024-01-25), other times it's 'Jan 25 2024',
    // or something completely different, so as much as I'd like to make
    // this return something with a stable format here, I can't.
    return this.rawData.publish_date != undefined
      ? this.rawData.publish_date
      : 'N/A';
  }

  get languages(): string {
    if (!this.checkList(this.rawData.languages)) {
      return 'N/A';
    }

    // TODO: This will return a language key (like ger/eng/..)
    // it would be nice to instead return a full language name.
    return this.rawData.languages
      .map((item) => item.key) // for some reason, the items are in { key = ... } structure
      .map((item) => item.slice('/languages/'.length)) // remove the /languaes/ prefix
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1)) // capitalize
      .join(', ');
  }

  getCoverUrls(size: 'S' | 'M' | 'L'): string[] {
    if (!this.checkList(this.rawData.covers)) {
      return [];
    }

    // Add 'covers' subdomain.
    const baseUrl = new URL(environment.baseUrl);
    baseUrl.hostname = `covers.${baseUrl.hostname}`;
    const coversUrl = baseUrl.toString();

    // https://covers.openlibrary.org/b/id/14553071-M.jpg
    return this.rawData.covers.map(
      (cover_id) => `${coversUrl}b/id/${cover_id}-${size}.jpg`,
    );
  }

  // Get the first cover URL, if any
  get_thumbnail(size: 'S' | 'M' | 'L'): string | null {
    const urls = this.getCoverUrls(size);
    return urls.length > 0 ? urls[0] : null;
  }
}
