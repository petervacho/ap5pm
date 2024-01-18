import { environment } from 'src/environments/environment';
import { WorkResponse } from '../responses/work.model';
import { WorkBookshelvesResponse } from '../responses/work_bookshelves.model';
import { checkList, removePrefix } from './utils';
import { WorkRatingsResponse } from '../responses/work_ratings.model';

export class WorkModel {
  constructor(
    private raw: WorkResponse,
    private rawBookshelves: WorkBookshelvesResponse,
    private rawRatings: WorkRatingsResponse,
  ) { }

  get title(): string {
    return this.raw.title;
  }

  get subtitle(): string | null {
    return this.raw.subtitle != null ? this.raw.subtitle : null;
  }

  get workId(): string {
    return removePrefix(this.raw.key, '/works/');
  }

  get author_ids(): string[] {
    return this.raw.authors
      .map((x) => x.author.key)
      .map((x) => removePrefix(x, '/authors/'));
  }

  get description(): string | null {
    const description = this.raw.description;

    if (description == undefined) {
      return null;
    }

    if (typeof description == 'string') {
      return description;
    } else if (description.value != undefined) {
      return description.value;
    }

    return null;
  }

  get fist_sentence(): string | null {
    return this.raw.first_sentence != undefined
      ? this.raw.first_sentence.value
      : null;
  }

  get first_publish_date(): string | null {
    return this.raw.first_publish_date != undefined
      ? this.raw.first_publish_date
      : null;
  }

  // Subjects/Keywords of the book
  get subjects(): string[] {
    return checkList(this.raw.subjects) ? this.raw.subjects : [];
  }

  // Places shown in the book
  get subject_places(): string[] {
    return checkList(this.raw.subject_places) ? this.raw.subject_places : [];
  }

  // Characters in the books
  get subject_people(): string[] {
    return checkList(this.raw.subject_people) ? this.raw.subject_people : [];
  }

  // Time periods in the book (i.e. middle ages)
  get subject_times(): string[] {
    return checkList(this.raw.subject_times) ? this.raw.subject_times : [];
  }

  // Average rating out of 5
  get rating_average(): number | null {
    const avg = this.rawRatings.summary.average;
    return avg != undefined ? avg : null;
  }

  // Amount of ratings submitted
  get rating_count(): number {
    return this.rawRatings.summary.count;
  }

  // Amount of people who marked this as "want to read"
  get want_to_read_count(): number {
    return this.rawBookshelves.counts.want_to_read;
  }

  // Amount of people who marked this as "currently reading"
  get currently_reading_count(): number {
    return this.rawBookshelves.counts.currently_reading;
  }

  // Amount of people who marked this as "already read"
  get already_read_count(): number {
    return this.rawBookshelves.counts.already_read;
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
