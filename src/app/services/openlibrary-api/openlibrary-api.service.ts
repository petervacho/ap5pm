import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EditionData } from 'src/app/models/edition.model';
import { WorkSearchData } from 'src/app/models/work_search.model';
import { EditionBatchData } from 'src/app/models/edition_batch.model';

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  constructor(private http: HttpClient) { }

  search$(query: string, page_no: number = 1, limit: number = 10) {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<WorkSearchData>(
      `${environment.baseUrl}/search.json?limit=${limit}&page=${page_no}&q=${encodedQuery}`,
    );
  }

  get_edition_batch$(work_key: string, offset: number = 0) {
    return this.http.get<EditionBatchData>(
      `${environment.baseUrl}/works/${work_key}/editions.json?offset=${offset}`,
    );
  }

  get_edition$(edition_key: string) {
    return this.http.get<EditionData>(
      `${environment.baseUrl}/books/${edition_key}.json`,
    );
  }
}
