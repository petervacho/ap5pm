import { environment } from 'src/environments/environment';
import { EditionResponse } from '../responses/edition.model';
import { capitalize, checkList, removePrefix } from './utils';

export class EditionModel {
  constructor(private raw: EditionResponse) { }

  get title(): string {
    return this.raw.title;
  }

  get subtitle(): string | null {
    return this.raw.subtitle != undefined ? this.raw.subtitle : null;
  }

  get editionId(): string {
    return removePrefix(this.raw.key, '/books/');
  }

  // IDs of all works this edition is associated with (usually only one)
  get work_ids(): string[] {
    return this.raw.works
      .map((item) => item.key) // for some reason, the items are in { key = ... }
      .map((item) => removePrefix(item, '/works/'));
  }

  get physical_format(): string | null {
    return this.raw.physical_format != undefined
      ? this.raw.physical_format
      : null;
  }

  get physical_dimensions(): string | null {
    return this.raw.physical_dimensions != undefined
      ? this.raw.physical_dimensions
      : null;
  }

  get number_of_pages(): number | null {
    return this.raw.number_of_pages != undefined
      ? this.raw.number_of_pages
      : null;
  }

  get isbn_10(): string[] {
    return checkList(this.raw.isbn_10) ? this.raw.isbn_10 : [];
  }

  get isbn_13(): string[] {
    return checkList(this.raw.isbn_13) ? this.raw.isbn_13 : [];
  }

  get publishers(): string[] {
    return checkList(this.raw.publishers) ? this.raw.publishers : [];
  }

  get publish_date(): string | null {
    // Annoyingly, this isn't returned in a standardized format
    // sometimes it's ISO (2024-01-25), other times it's 'Jan 25 2024',
    // or something completely different, so as much as I'd like to make
    // this return something with a stable format here, I can't.
    return this.raw.publish_date != undefined ? this.raw.publish_date : null;
  }

  get languages(): string[] {
    if (!checkList(this.raw.languages)) {
      return [];
    }

    // TODO: Consider processing these languages, as they're only keys
    // (like ger/eng/slo/cze). It would be nice to have full names
    return this.raw.languages
      .map((item) => item.key)
      .map((item) => item.slice('/languages/'.length))
      .map((item) => capitalize(item));
  }

  // Get cover URLs for every cover listed for this work
  //
  // Size of the image can be 'S': small, 'M': medium, 'L': large
  getCoverUrls(size: 'S' | 'M' | 'L'): string[] {
    if (!checkList(this.raw.covers)) {
      return [];
    }

    // Add 'covers' subdomain.
    const baseUrl = new URL(environment.baseUrl);
    baseUrl.hostname = `covers.${baseUrl.hostname}`;
    const coversUrl = baseUrl.toString();

    return this.raw.covers.map(
      (cover_id) => `${coversUrl}b/id/${cover_id}-${size}.jpg`,
    );
  }

  // Get the first cover URL, if any
  //
  // This is a quicker convenience function to getCoverUrls used in views.
  getThumbnail(size: 'S' | 'M' | 'L'): string | null {
    const urls = this.getCoverUrls(size);
    return urls.length > 0 ? urls[0] : null;
  }
}
