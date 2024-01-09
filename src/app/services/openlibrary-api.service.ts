import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookSearchResponse } from '../models/search.model';

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  constructor(private http: HttpClient) { }

  search$(query: string, page_no: number = 1, limit: number = 10) {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<BookSearchResponse>(
      `${environment.baseUrl}/search.json?limit=${limit}&page=${page_no}&q=${encodedQuery}`,
    );
  }
}
