import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkSearchDoc, WorkSearchResponse } from '../../models/search.model';
import { EditionData } from 'src/app/models/edition.model';

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  constructor(private http: HttpClient) {}

  search$(query: string, page_no: number = 1, limit: number = 10) {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<WorkSearchResponse>(
      `${environment.baseUrl}/search.json?limit=${limit}&page=${page_no}&q=${encodedQuery}`,
    );
  }

  get_edition$(edition_key: string) {
    return this.http.get<EditionData>(
      `${environment.baseUrl}/books/${edition_key}.json`,
    );
  }
}
