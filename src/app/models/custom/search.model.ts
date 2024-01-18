import { SearchDoc, SearchResponse } from '../responses/search.model';
import { checkList, removePrefix } from './utils';

export class SearchModel {
  data: SearchDataModel[];

  constructor(private raw: SearchResponse) {
    this.data = raw.docs.map((doc) => new SearchDataModel(doc));
  }
}

export class SearchDataModel {
  constructor(private raw: SearchDoc) { }

  get title(): string {
    return this.raw.title;
  }

  get workId(): string {
    return removePrefix(this.raw.key, '/works/');
  }

  get author_names(): string[] {
    if (!checkList(this.raw.author_name)) {
      return [];
    }

    return this.raw.author_name;
  }

  get first_publish_year(): number | null {
    return this.raw.first_publish_year != undefined
      ? this.raw.first_publish_year
      : null;
  }

  get edition_count(): number {
    return this.raw.edition_count;
  }
}
