import { EditionBatchResponse } from '../raw/edition_batch.model';
import { EditionModel } from './edition.model';

export class EditionBatchModel {
  data: EditionModel[];

  constructor(private raw: EditionBatchResponse) {
    this.data = raw.entries.map((raw) => new EditionModel(raw));
  }

  getNextOffset(): number | null {
    const nextRaw = this.raw.links.next;
    if (nextRaw == undefined) {
      return null;
    }

    // provide a base URL, so it can be a valid URL
    const nextUrl = new URL(nextRaw, 'http://example.com');
    const offsetValue = nextUrl.searchParams.get('offset');

    if (offsetValue == null) {
      console.error("The next URL didn't contain an offset query param");
      return null;
    }
    return parseInt(offsetValue, 10);
  }
}
